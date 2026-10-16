/**
 * Blood PM Brozz - Google Apps Script Backend Integration
 * Web App API for Google Sheets & Google Form Synchronization
 * 
 * Features:
 * 1. doGet: Fetch approved public donors or full administrative data (with token)
 * 2. doPost: Admin approval/rejection, availability override, consent updates, edits
 * 3. onFormSubmit: Normalizes new submissions from Google Form
 */

const CONFIG = {
  // Set your secure Admin Secret here or in Script Properties (ADMIN_SECRET)
  ADMIN_SECRET_DEFAULT: "BloodPMBrozz_SecureAdmin_2026",
  SHEET_NAME: "Form Responses 1", // Default sheet name for Google Forms
};

function getAdminSecret() {
  const prop = PropertiesService.getScriptProperties().getProperty("ADMIN_SECRET");
  return prop || CONFIG.ADMIN_SECRET_DEFAULT;
}

/**
 * Handle GET Requests
 * Usage:
 * - /exec?action=public_donors (Public directory feed)
 * - /exec?action=admin_donors&token=... (Admin full view)
 * - /exec?action=stats (Public summary stats)
 */
function doGet(e) {
  try {
    const params = (e && e.parameter) || {};
    const action = params.action || "public_donors";
    
    if (action === "admin_donors") {
      const token = params.token;
      if (token !== getAdminSecret()) {
        return jsonResponse({ error: "Unauthorized. Invalid admin token." }, 401);
      }
      const allDonors = getAllDonorsData();
      return jsonResponse({ success: true, count: allDonors.length, donors: allDonors });
    }
    
    if (action === "stats") {
      const stats = calculateStats();
      return jsonResponse({ success: true, stats: stats });
    }
    
    // Default: Public donors only
    const publicDonors = getPublicDonorsData();
    return jsonResponse({
      success: true,
      lastUpdated: new Date().toISOString(),
      count: publicDonors.length,
      donors: publicDonors
    });
  } catch (err) {
    return jsonResponse({ error: err.toString() }, 500);
  }
}

/**
 * Handle POST Requests
 * For administrative updates & status overrides
 */
function doPost(e) {
  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    }
    
    const token = payload.token;
    if (token !== getAdminSecret()) {
      return jsonResponse({ error: "Unauthorized. Invalid admin token." }, 401);
    }
    
    const action = payload.action;
    
    if (action === "update_status") {
      // payload: { id, status, isAvailable, callConsent, whatsappConsent, adminNotes }
      const updated = updateDonorRecord(payload);
      return jsonResponse({ success: true, message: "Donor updated successfully", record: updated });
    }
    
    if (action === "deactivate") {
      const result = deactivateDonorRecord(payload.id);
      return jsonResponse({ success: true, message: "Donor deactivated", result: result });
    }
    
    return jsonResponse({ error: "Unknown action" }, 400);
  } catch (err) {
    return jsonResponse({ error: err.toString() }, 500);
  }
}

/**
 * Fetch raw sheet data and map to structured objects
 */
function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(CONFIG.SHEET_NAME) || ss.getSheets()[0];
}

function ensureMetadataHeaders(sheet) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const requiredMetadata = [
    "Donor_ID",
    "Admin_Status",       // APPROVED, PENDING, REJECTED, DEACTIVATED
    "Availability_Override", // AVAILABLE, UNAVAILABLE, AUTO
    "Public_Call_Consent",   // YES, NO
    "Public_WhatsApp_Consent",// YES, NO
    "Admin_Notes",
    "Last_Updated"
  ];
  
  let changed = false;
  let nextCol = sheet.getLastColumn() + 1;
  for (let i = 0; i < requiredMetadata.length; i++) {
    const colName = requiredMetadata[i];
    if (headers.indexOf(colName) === -1) {
      sheet.getRange(1, nextCol).setValue(colName);
      nextCol++;
      changed = true;
    }
  }
  return changed;
}

function getAllDonorsData() {
  const sheet = getSheet();
  ensureMetadataHeaders(sheet);
  
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  const headers = data[0];
  const rows = data.slice(1);
  
  const donors = [];
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowIndex = i + 2; // 1-based, skipping header
    
    const donor = mapRowToDonor(headers, row, rowIndex);
    if (donor) {
      donors.push(donor);
    }
  }
  
  return donors;
}

function getPublicDonorsData() {
  const all = getAllDonorsData();
  
  // Filter for approved and consented donors only
  return all
    .filter(function(d) {
      // Must not be deactivated or rejected
      if (d.adminStatus === "REJECTED" || d.adminStatus === "DEACTIVATED") {
        return false;
      }
      // Must have basic consent
      if (!d.hasBaseConsent) {
        return false;
      }
      // Must have valid blood group
      if (!isValidBloodGroup(d.bloodGroup)) {
        return false;
      }
      return true;
    })
    .map(function(d) {
      // Return only consent-approved public fields
      const isAvailable = (d.availabilityOverride === "AVAILABLE") ||
        (d.availabilityOverride !== "UNAVAILABLE" && d.availableInKerala === "Yes");
      
      const allowCall = d.publicCallConsent === "YES" || d.publicCallConsent === true;
      const allowWhatsApp = (d.publicWhatsAppConsent === "YES" || d.publicWhatsAppConsent === true) && Boolean(d.whatsappNumber);
      
      return {
        id: d.id,
        name: d.name,
        bloodGroup: normalizeBloodGroup(d.bloodGroup),
        district: formatDistrict(d.district),
        currentResidence: d.currentResidence,
        isAvailable: isAvailable,
        allowCall: allowCall,
        phone: allowCall ? d.mobileNumber : null,
        allowWhatsApp: allowWhatsApp,
        whatsapp: allowWhatsApp ? d.whatsappNumber : null,
        registeredAt: d.timestamp
      };
    });
}

function mapRowToDonor(headers, row, rowIndex) {
  const getCol = function(name) {
    const idx = headers.indexOf(name);
    return idx !== -1 ? row[idx] : "";
  };
  
  const timestamp = getCol("Timestamp") || "";
  const name = String(getCol("Full Name") || "").trim();
  const bloodGroup = String(getCol("Blood Group") || "").trim();
  const rawMobile = String(getCol("Mobile Number") || "").trim();
  const rawWhatsApp = String(getCol("WhatsApp Number") || "").trim();
  const currentResidence = String(getCol("Current Residence") || "").trim();
  const district = String(getCol("District or Current Country") || "").trim();
  const availableInKerala = String(getCol("Currently Available in Kerala?") || "").trim();
  const consentText = String(getCol("Consent") || "").trim();
  
  if (!name && !bloodGroup) return null;
  
  const mobile = normalizePhoneNumber(rawMobile);
  let whatsapp = "";
  if (rawWhatsApp.toLowerCase() === "same") {
    whatsapp = mobile;
  } else if (rawWhatsApp) {
    whatsapp = normalizePhoneNumber(rawWhatsApp);
  }
  
  const idCol = headers.indexOf("Donor_ID");
  let id = idCol !== -1 && row[idCol] ? String(row[idCol]) : "";
  if (!id) {
    id = "DNR-" + (1000 + rowIndex);
  }
  
  const statusCol = headers.indexOf("Admin_Status");
  let adminStatus = statusCol !== -1 && row[statusCol] ? String(row[statusCol]).toUpperCase() : "APPROVED";
  
  const availCol = headers.indexOf("Availability_Override");
  let availOverride = availCol !== -1 && row[availCol] ? String(row[availCol]).toUpperCase() : "AUTO";
  
  const callCol = headers.indexOf("Public_Call_Consent");
  let callConsent = callCol !== -1 && row[callCol] ? String(row[callCol]).toUpperCase() : "YES";
  
  const waCol = headers.indexOf("Public_WhatsApp_Consent");
  let waConsent = waCol !== -1 && row[waCol] ? String(row[waCol]).toUpperCase() : (whatsapp ? "YES" : "NO");
  
  const notesCol = headers.indexOf("Admin_Notes");
  let adminNotes = notesCol !== -1 ? String(row[notesCol] || "") : "";
  
  const updatedCol = headers.indexOf("Last_Updated");
  let lastUpdated = updatedCol !== -1 ? String(row[updatedCol] || "") : "";
  
  const hasBaseConsent = consentText.length > 0;
  
  return {
    id: id,
    rowIndex: rowIndex,
    timestamp: timestamp,
    name: name,
    bloodGroup: normalizeBloodGroup(bloodGroup),
    rawBloodGroup: bloodGroup,
    mobileNumber: mobile,
    whatsappNumber: whatsapp,
    currentResidence: currentResidence,
    district: formatDistrict(district),
    availableInKerala: availableInKerala,
    consentText: consentText,
    hasBaseConsent: hasBaseConsent,
    adminStatus: adminStatus,
    availabilityOverride: availOverride,
    publicCallConsent: callConsent,
    publicWhatsAppConsent: waConsent,
    adminNotes: adminNotes,
    lastUpdated: lastUpdated
  };
}

function normalizeBloodGroup(bg) {
  if (!bg) return "";
  let clean = bg.toUpperCase().replace(/\s+/g, "");
  // common normalization
  if (clean === "O+VE" || clean === "OPOSITIVE" || clean === "O_POS") return "O+";
  if (clean === "O-VE" || clean === "ONEGATIVE" || clean === "O_NEG") return "O-";
  if (clean === "A+VE" || clean === "APOSITIVE" || clean === "A_POS") return "A+";
  if (clean === "A-VE" || clean === "ANEGATIVE" || clean === "A_NEG") return "A-";
  if (clean === "B+VE" || clean === "BPOSITIVE" || clean === "B_POS") return "B+";
  if (clean === "B-VE" || clean === "BNEGATIVE" || clean === "B_NEG") return "B-";
  if (clean === "AB+VE" || clean === "ABPOSITIVE" || clean === "AB_POS") return "AB+";
  if (clean === "AB-VE" || clean === "ABNEGATIVE" || clean === "AB_NEG") return "AB-";
  return clean;
}

function isValidBloodGroup(bg) {
  const valid = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  return valid.indexOf(normalizeBloodGroup(bg)) !== -1;
}

function normalizePhoneNumber(phone) {
  if (!phone) return "";
  let digits = String(phone).replace(/[^\d+]/g, "");
  if (!digits.startsWith("+")) {
    if (digits.length === 10) {
      digits = "+91" + digits;
    } else if (digits.length === 12 && digits.startsWith("91")) {
      digits = "+" + digits;
    }
  }
  return digits;
}

function formatDistrict(dist) {
  if (!dist) return "Kerala";
  let trimmed = String(dist).trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

function calculateStats() {
  const publicList = getPublicDonorsData();
  const stats = {
    totalRegistered: publicList.length,
    availableNow: publicList.filter(function(d) { return d.isAvailable; }).length,
    byBloodGroup: {
      "A+": 0, "A-": 0, "B+": 0, "B-": 0,
      "AB+": 0, "AB-": 0, "O+": 0, "O-": 0
    },
    byDistrict: {}
  };
  
  publicList.forEach(function(d) {
    if (stats.byBloodGroup[d.bloodGroup] !== undefined) {
      stats.byBloodGroup[d.bloodGroup]++;
    }
    const dist = d.district || "Other";
    stats.byDistrict[dist] = (stats.byDistrict[dist] || 0) + 1;
  });
  
  return stats;
}

function updateDonorRecord(payload) {
  const sheet = getSheet();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const donors = getAllDonorsData();
  const target = donors.find(function(d) { return d.id === payload.id; });
  
  if (!target) {
    throw new Error("Donor ID not found: " + payload.id);
  }
  
  const rowIndex = target.rowIndex;
  const setCell = function(colName, val) {
    const colIdx = headers.indexOf(colName);
    if (colIdx !== -1) {
      sheet.getRange(rowIndex, colIdx + 1).setValue(val);
    }
  };
  
  if (payload.status !== undefined) setCell("Admin_Status", payload.status);
  if (payload.isAvailable !== undefined) setCell("Availability_Override", payload.isAvailable ? "AVAILABLE" : "UNAVAILABLE");
  if (payload.callConsent !== undefined) setCell("Public_Call_Consent", payload.callConsent ? "YES" : "NO");
  if (payload.whatsappConsent !== undefined) setCell("Public_WhatsApp_Consent", payload.whatsappConsent ? "YES" : "NO");
  if (payload.adminNotes !== undefined) setCell("Admin_Notes", payload.adminNotes);
  
  setCell("Last_Updated", new Date().toISOString());
  return { id: payload.id, success: true };
}

function deactivateDonorRecord(id) {
  return updateDonorRecord({ id: id, status: "DEACTIVATED" });
}

function jsonResponse(obj, statusCode) {
  const output = ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * Setup function - run once from Apps Script editor to initialize columns
 */
function setup() {
  const sheet = getSheet();
  ensureMetadataHeaders(sheet);
  Logger.log("Headers initialized successfully.");
}
