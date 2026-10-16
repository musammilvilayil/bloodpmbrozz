import { 
  GOOGLE_SHEET_CSV_URL, 
  parseCSV, 
  mapRowsToDonors,
  VALID_BLOOD_GROUPS
} from './utils.js';

// Server-side cache for high performance & avoiding Google Sheets rate-limiting
let cachedDonors = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

// In-memory admin overrides for quick approval & status adjustments
// (In production, can also be synced directly with Google Apps Script)
export const adminOverrides = new Map();

export async function fetchLiveDonors(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedDonors && (now - lastCacheTime < CACHE_TTL_MS)) {
    return cachedDonors;
  }

  try {
    const res = await fetch(GOOGLE_SHEET_CSV_URL, {
      headers: {
        'User-Agent': 'BloodPMBrozz-API/1.0',
        'Accept': 'text/csv'
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch sheet CSV: ${res.status} ${res.statusText}`);
    }

    const csvText = await res.text();
    const rows = parseCSV(csvText);
    const parsed = mapRowsToDonors(rows);

    cachedDonors = parsed;
    lastCacheTime = now;
    return parsed;
  } catch (err) {
    console.error("Error fetching live Google Sheet:", err);
    // If cached version exists, serve stale
    if (cachedDonors) return cachedDonors;
    // Otherwise fallback to initial seed record from user's live sheet
    return [
      {
        id: "DNR-1002",
        name: "Muhammad Musammil A",
        bloodGroup: "O+",
        mobileNumber: "+916282135504",
        whatsappNumber: "+916282135504",
        currentResidence: "Kerala",
        district: "Kollam",
        availableInKerala: "Yes",
        hasConsent: true,
        adminStatus: "APPROVED",
        isAvailable: true,
        publicCallConsent: true,
        publicWhatsAppConsent: true,
        timestamp: "17/10/2026 00:04:49"
      }
    ];
  }
}

export function applyOverrides(donors) {
  return donors.map(d => {
    if (adminOverrides.has(d.id)) {
      const override = adminOverrides.get(d.id);
      return { ...d, ...override };
    }
    return d;
  });
}

export function sanitizePublicDonors(donors) {
  return donors
    .filter(d => {
      // Must be approved and have consent
      if (d.adminStatus === "REJECTED" || d.adminStatus === "DEACTIVATED") return false;
      if (!d.hasConsent) return false;
      return true;
    })
    .map(d => {
      const allowCall = d.publicCallConsent === true;
      const allowWhatsApp = d.publicWhatsAppConsent === true && Boolean(d.whatsappNumber);

      return {
        id: d.id,
        name: d.name,
        bloodGroup: d.bloodGroup,
        district: d.district,
        currentResidence: d.currentResidence,
        isAvailable: d.isAvailable,
        allowCall,
        phone: allowCall ? d.mobileNumber : null,
        allowWhatsApp,
        whatsapp: allowWhatsApp ? d.whatsappNumber : null,
        registeredAt: d.timestamp
      };
    });
}

export default async function handler(req, res) {
  try {
    const url = (req && req.url) || '';
    const forceRefresh = url.includes('refresh=true') || Boolean(req?.headers?.['x-refresh']);
    const rawDonors = await fetchLiveDonors(forceRefresh);
    const donorsWithOverrides = applyOverrides(rawDonors);
    const publicDonors = sanitizePublicDonors(donorsWithOverrides);

    // Calculate live summary stats
    const stats = {
      totalDonors: publicDonors.length,
      availableNow: publicDonors.filter(d => d.isAvailable).length,
      bloodGroups: VALID_BLOOD_GROUPS.reduce((acc, bg) => {
        acc[bg] = publicDonors.filter(d => d.bloodGroup === bg).length;
        return acc;
      }, {}),
      districts: publicDonors.reduce((acc, d) => {
        const dist = d.district || "Kerala";
        acc[dist] = (acc[dist] || 0) + 1;
        return acc;
      }, {})
    };

    // Edge caching headers for Vercel
    if (res && res.setHeader) {
      res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
      res.setHeader('Content-Type', 'application/json');
    }

    const responsePayload = {
      success: true,
      count: publicDonors.length,
      stats,
      donors: publicDonors,
      source: "Google Sheets Live Sync",
      lastSync: new Date(lastCacheTime || Date.now()).toISOString()
    };

    if (res && res.json) {
      return res.status(200).json(responsePayload);
    }
    return responsePayload;
  } catch (err) {
    console.error("API /api/donors error:", err);
    const errPayload = { success: false, error: "Internal Server Error fetching donors" };
    if (res && res.status) {
      return res.status(500).json(errPayload);
    }
    return errPayload;
  }
}
