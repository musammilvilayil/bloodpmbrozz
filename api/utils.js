/**
 * Shared utility functions for parsing, validating, and normalizing donor data
 * from Google Sheets and Google Forms.
 */

export const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1zDtsboLMoDs8NMgDqmUFxedtULj5HasnXsCQdSXGVI0/export?format=csv";
export const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdvTzN2DwFIvEb2UxeTO970ZaS0Be4F_vqXKbfPNzJEXc9_fw/viewform?usp=dialog";

export const VALID_BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const KERALA_DISTRICTS = [
  "Alappuzha",
  "Ernakulam",
  "Idukki",
  "Kannur",
  "Kasaragod",
  "Kollam",
  "Kottayam",
  "Kozhikode",
  "Malappuram",
  "Palakkad",
  "Pathanamthitta",
  "Thiruvananthapuram",
  "Thrissur",
  "Wayanad"
];

/**
 * Normalizes blood group string (handles formatting differences like "o +ve", "A Positive", etc.)
 */
export function normalizeBloodGroup(raw) {
  if (!raw) return "";
  let clean = String(raw).toUpperCase().replace(/\s+/g, "");
  
  if (clean === "O+VE" || clean === "OPOSITIVE" || clean === "O_POS" || clean === "O POSITIVE") return "O+";
  if (clean === "O-VE" || clean === "ONEGATIVE" || clean === "O_NEG" || clean === "O NEGATIVE") return "O-";
  if (clean === "A+VE" || clean === "APOSITIVE" || clean === "A_POS" || clean === "A POSITIVE") return "A+";
  if (clean === "A-VE" || clean === "ANEGATIVE" || clean === "A_NEG" || clean === "A NEGATIVE") return "A-";
  if (clean === "B+VE" || clean === "BPOSITIVE" || clean === "B_POS" || clean === "B POSITIVE") return "B+";
  if (clean === "B-VE" || clean === "BNEGATIVE" || clean === "B_NEG" || clean === "B NEGATIVE") return "B-";
  if (clean === "AB+VE" || clean === "ABPOSITIVE" || clean === "AB_POS" || clean === "AB POSITIVE") return "AB+";
  if (clean === "AB-VE" || clean === "ABNEGATIVE" || clean === "AB_NEG" || clean === "AB NEGATIVE") return "AB-";
  
  return clean;
}

/**
 * Normalizes Indian and international phone numbers into E.164 (+91...)
 */
export function normalizePhoneNumber(raw) {
  if (!raw) return "";
  let digits = String(raw).replace(/[^\d+]/g, "");
  if (!digits) return "";
  
  if (!digits.startsWith("+")) {
    if (digits.length === 10) {
      digits = "+91" + digits;
    } else if (digits.length === 12 && digits.startsWith("91")) {
      digits = "+" + digits;
    } else if (digits.length === 11 && digits.startsWith("0")) {
      digits = "+91" + digits.substring(1);
    }
  }
  return digits;
}

/**
 * Formats district name cleanly
 */
export function formatDistrict(raw) {
  if (!raw) return "Kerala";
  let dist = String(raw).trim();
  if (!dist) return "Kerala";
  
  // Check against known Kerala districts for case insensitivity
  const found = KERALA_DISTRICTS.find(d => d.toLowerCase() === dist.toLowerCase());
  if (found) return found;
  
  // Capitalize words
  return dist
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Simple robust CSV Parser that handles quoted strings with commas and newlines
 */
export function parseCSV(csvText) {
  const rows = [];
  let currentRow = [];
  let currentField = "";
  let insideQuotes = false;
  
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];
    
    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentField);
      currentField = "";
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentField);
      currentField = "";
      if (currentRow.some(f => f.trim().length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
    } else {
      currentField += char;
    }
  }
  
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some(f => f.trim().length > 0)) {
      rows.push(currentRow);
    }
  }
  
  return rows;
}

/**
 * Map CSV rows to donor objects
 */
export function mapRowsToDonors(rows) {
  if (!rows || rows.length <= 1) return [];
  
  const headers = rows[0].map(h => h.trim());
  const dataRows = rows.slice(1);
  
  const getCol = (row, name) => {
    const idx = headers.indexOf(name);
    return idx !== -1 ? (row[idx] || "").trim() : "";
  };
  
  return dataRows.map((row, index) => {
    const timestamp = getCol(row, "Timestamp");
    const name = getCol(row, "Full Name");
    const rawBlood = getCol(row, "Blood Group");
    const rawMobile = getCol(row, "Mobile Number");
    const rawWA = getCol(row, "WhatsApp Number");
    const currentResidence = getCol(row, "Current Residence");
    const district = getCol(row, "District or Current Country");
    const availableInKerala = getCol(row, "Currently Available in Kerala?");
    const consent = getCol(row, "Consent");
    
    const bloodGroup = normalizeBloodGroup(rawBlood);
    const mobile = normalizePhoneNumber(rawMobile);
    
    let whatsapp = "";
    if (rawWA.toLowerCase() === "same") {
      whatsapp = mobile;
    } else if (rawWA) {
      whatsapp = normalizePhoneNumber(rawWA);
    }
    
    // Check metadata columns if present (from Apps Script)
    const adminStatus = getCol(row, "Admin_Status") || "APPROVED";
    const availOverride = getCol(row, "Availability_Override") || "AUTO";
    const callConsent = getCol(row, "Public_Call_Consent") || "YES";
    const waConsent = getCol(row, "Public_WhatsApp_Consent") || (whatsapp ? "YES" : "NO");
    const adminNotes = getCol(row, "Admin_Notes") || "";
    
    // ID generation
    const id = getCol(row, "Donor_ID") || `DNR-${1000 + index + 1}`;
    
    // Calculated availability
    const isAvailable = availOverride === "AVAILABLE" ||
      (availOverride !== "UNAVAILABLE" && (availableInKerala.toLowerCase() === "yes" || availableInKerala.toLowerCase() === "true"));
    
    const hasConsent = consent.length > 5;
    
    return {
      id,
      rowIndex: index + 2,
      timestamp,
      name,
      bloodGroup,
      rawBloodGroup: rawBlood,
      mobileNumber: mobile,
      whatsappNumber: whatsapp,
      currentResidence,
      district: formatDistrict(district),
      availableInKerala,
      consentText: consent,
      hasConsent,
      adminStatus,
      availabilityOverride: availOverride,
      isAvailable,
      publicCallConsent: callConsent === "YES" || callConsent === "true",
      publicWhatsAppConsent: waConsent === "YES" || waConsent === "true",
      adminNotes
    };
  }).filter(d => Boolean(d.name) && VALID_BLOOD_GROUPS.includes(d.bloodGroup));
}
