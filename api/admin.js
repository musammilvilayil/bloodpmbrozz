import { 
  fetchLiveDonors, 
  applyOverrides, 
  adminOverrides 
} from './donors.js';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "BloodPM@Brozz2026!";
const ADMIN_SECRET = process.env.ADMIN_SECRET || "BloodPMBrozz_SecretKey_9918";

// Simple secure session token generator
function generateToken() {
  const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const payload = `admin:${expires}:${ADMIN_SECRET}`;
  const sig = Buffer.from(payload).toString('base64');
  return `${sig}.${expires}`;
}

function verifyToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.substring(7);
  const [sig, expiresStr] = token.split('.');
  if (!sig || !expiresStr) return false;
  
  const expires = parseInt(expiresStr, 10);
  if (Date.now() > expires) return false;
  
  const expectedPayload = `admin:${expires}:${ADMIN_SECRET}`;
  const expectedSig = Buffer.from(expectedPayload).toString('base64');
  return sig === expectedSig;
}

export default async function handler(req, res) {
  // Enable CORS if accessed from dev tools
  if (res && res.setHeader) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  }

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const method = req.method;
  const body = req.body || {};
  const query = req.query || {};

  // 1. Admin Login
  if (method === 'POST' && body.action === 'login') {
    const { password } = body;
    if (password === ADMIN_PASSWORD) {
      const token = generateToken();
      return res.status(200).json({
        success: true,
        message: "Authentication successful",
        token,
        expiresIn: "24h"
      });
    } else {
      return res.status(401).json({
        success: false,
        error: "Invalid admin password"
      });
    }
  }

  // 2. Authorization check for all other admin routes
  const authHeader = req.headers ? (req.headers.authorization || req.headers.Authorization) : null;
  if (!verifyToken(authHeader)) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized. Valid administrator Bearer token required."
    });
  }

  // 3. Admin: Get all donors (including unapproved, raw contacts, admin notes)
  if (method === 'GET' || (method === 'POST' && body.action === 'get_all')) {
    try {
      const rawDonors = await fetchLiveDonors();
      const allDonors = applyOverrides(rawDonors);

      return res.status(200).json({
        success: true,
        totalRecords: allDonors.length,
        donors: allDonors,
        overridesCount: adminOverrides.size
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // 4. Admin: Update Donor Status / Availability / Consent
  if (method === 'POST' && body.action === 'update_donor') {
    const { id, adminStatus, isAvailable, publicCallConsent, publicWhatsAppConsent, adminNotes } = body;
    if (!id) {
      return res.status(400).json({ success: false, error: "Donor id is required" });
    }

    const currentOverride = adminOverrides.get(id) || {};
    const updatedOverride = {
      ...currentOverride,
      ...(adminStatus !== undefined ? { adminStatus } : {}),
      ...(isAvailable !== undefined ? { isAvailable, availabilityOverride: isAvailable ? "AVAILABLE" : "UNAVAILABLE" } : {}),
      ...(publicCallConsent !== undefined ? { publicCallConsent } : {}),
      ...(publicWhatsAppConsent !== undefined ? { publicWhatsAppConsent } : {}),
      ...(adminNotes !== undefined ? { adminNotes } : {}),
      lastUpdated: new Date().toISOString()
    };

    adminOverrides.set(id, updatedOverride);

    // Optional: Forward to Google Apps Script Web App if configured
    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    let syncedWithSheet = false;
    if (appsScriptUrl) {
      try {
        await fetch(appsScriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: process.env.ADMIN_SECRET || "BloodPMBrozz_SecureAdmin_2026",
            action: 'update_status',
            id,
            status: adminStatus,
            isAvailable,
            callConsent: publicCallConsent,
            whatsappConsent: publicWhatsAppConsent,
            adminNotes
          })
        });
        syncedWithSheet = true;
      } catch (e) {
        console.warn("Could not sync with Google Apps Script Web App:", e);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Donor record updated successfully",
      id,
      updatedOverride,
      syncedWithSheet
    });
  }

  // 5. Admin: Deactivate record
  if (method === 'POST' && body.action === 'deactivate') {
    const { id } = body;
    if (!id) return res.status(400).json({ success: false, error: "Donor id required" });

    const current = adminOverrides.get(id) || {};
    adminOverrides.set(id, { ...current, adminStatus: 'DEACTIVATED', isAvailable: false });

    return res.status(200).json({
      success: true,
      message: `Donor ${id} deactivated`,
      id
    });
  }

  return res.status(400).json({ success: false, error: "Unsupported admin action" });
}
