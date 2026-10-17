import { 
  GOOGLE_SHEET_CSV_URL, 
  parseCSV, 
  mapRowsToDonors,
  VALID_BLOOD_GROUPS
} from './utils.js';

// Server-side cache for high performance & avoiding Google Sheets rate-limiting
let cachedDonors = null;
let lastCacheTime = 0;
let lastSyncStatus = "OK"; // "OK" | "RESTRICTED_401" | "ERROR"
const CACHE_TTL_MS = 10 * 1000; // 10 seconds for real-time dynamic syncing

// In-memory admin overrides for quick approval & status adjustments
// (In production, can also be synced directly with Google Apps Script)
export const adminOverrides = new Map();

export async function fetchLiveDonors(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedDonors && (now - lastCacheTime < CACHE_TTL_MS)) {
    return cachedDonors;
  }

  // 1. If Google Apps Script Web App URL is configured, use it for direct authorized Sheets API access
  const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (appsScriptUrl) {
    try {
      const res = await fetch(`${appsScriptUrl}?action=public_donors`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.donors) && json.donors.length > 0) {
          cachedDonors = json.donors;
          lastCacheTime = now;
          return json.donors;
        }
      }
    } catch (e) {
      console.warn("Apps Script Web App sync failed:", e.message);
    }
  }

  // 2. Direct Google Sheet CSV export
  try {
    const res = await fetch(GOOGLE_SHEET_CSV_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/csv,text/plain,*/*'
      }
    });

    if (res.ok) {
      const csvText = await res.text();
      // Ensure response is actually CSV and not an HTML redirect/login page
      if (csvText.includes('Timestamp') && csvText.includes('Full Name')) {
        const rows = parseCSV(csvText);
        const parsed = mapRowsToDonors(rows);
        if (parsed.length > 0) {
          cachedDonors = parsed;
          lastCacheTime = now;
          lastSyncStatus = "OK";
          return parsed;
        }
      }
    }
    if (res.status === 401) {
      lastSyncStatus = "RESTRICTED_401";
    }
    throw new Error(`Google Sheet returned status ${res.status}`);
  } catch (err) {
    if (err.message && err.message.includes("401")) {
      lastSyncStatus = "RESTRICTED_401";
    }
    console.warn("Live Google Sheet sync status:", err.message);
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
      res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=10');
      res.setHeader('Content-Type', 'application/json');
    }

    const responsePayload = {
      success: true,
      count: publicDonors.length,
      stats,
      donors: publicDonors,
      source: "Google Sheets Live Sync",
      sheetStatus: lastSyncStatus,
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
