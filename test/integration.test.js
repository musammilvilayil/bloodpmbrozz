import assert from 'node:assert';
import { 
  normalizeBloodGroup, 
  normalizePhoneNumber, 
  formatDistrict, 
  parseCSV, 
  mapRowsToDonors, 
  VALID_BLOOD_GROUPS 
} from '../api/utils.js';
import { 
  fetchLiveDonors, 
  applyOverrides, 
  sanitizePublicDonors, 
  adminOverrides 
} from '../api/donors.js';

console.log("=== RUNNING BLOOD PM BROZZ INTEGRATION & UNIT TESTS ===");

// 1. Blood Group Normalization Tests
console.log("\n[Test 1] Blood Group Normalization & Validation...");
assert.strictEqual(normalizeBloodGroup("O+"), "O+");
assert.strictEqual(normalizeBloodGroup("o+ve"), "O+");
assert.strictEqual(normalizeBloodGroup("O positive"), "O+");
assert.strictEqual(normalizeBloodGroup("A-"), "A-");
assert.strictEqual(normalizeBloodGroup("ab+"), "AB+");
assert.strictEqual(normalizeBloodGroup("B-VE"), "B-");
assert.deepStrictEqual(VALID_BLOOD_GROUPS, ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]);
console.log("✓ Blood Group Normalization PASSED");

// 2. Phone Number Normalization Tests
console.log("\n[Test 2] Phone Number Normalization...");
assert.strictEqual(normalizePhoneNumber("6282135504"), "+916282135504");
assert.strictEqual(normalizePhoneNumber("+916282135504"), "+916282135504");
assert.strictEqual(normalizePhoneNumber("06282135504"), "+916282135504");
assert.strictEqual(normalizePhoneNumber("916282135504"), "+916282135504");
console.log("✓ Phone Number Normalization PASSED");

// 3. District Formatting Tests
console.log("\n[Test 3] District Formatting...");
assert.strictEqual(formatDistrict("kollam"), "Kollam");
assert.strictEqual(formatDistrict("ERNAKULAM"), "Ernakulam");
assert.strictEqual(formatDistrict("thiruvananthapuram"), "Thiruvananthapuram");
assert.strictEqual(formatDistrict(""), "Kerala");
console.log("✓ District Formatting PASSED");

// 4. CSV Parsing & Quoting Tests
console.log("\n[Test 4] CSV Parser with quoted fields and commas...");
const sampleCsv = `Timestamp,Full Name,Blood Group,Mobile Number,WhatsApp Number,Current Residence,District or Current Country,Currently Available in Kerala?,Consent
"17/10/2026 00:04:49","MUHAMMAD MUSAMMIL A","O+","6282135504","Same","Kerala","kollam","Yes","I consent to store and use these details for community blood donor coordination."`;
const parsedRows = parseCSV(sampleCsv);
assert.strictEqual(parsedRows.length, 2);
assert.strictEqual(parsedRows[0][1], "Full Name");
assert.strictEqual(parsedRows[1][1], "MUHAMMAD MUSAMMIL A");
assert.strictEqual(parsedRows[1][2], "O+");
assert.strictEqual(parsedRows[1][4], "Same");
console.log("✓ CSV Parser PASSED");

// 5. Mapping to Donors & Privacy Consent Enforcement
console.log("\n[Test 5] Mapping CSV rows to Structured Donors...");
const donors = mapRowsToDonors(parsedRows);
assert.strictEqual(donors.length, 1);
const donor = donors[0];
assert.strictEqual(donor.name, "MUHAMMAD MUSAMMIL A");
assert.strictEqual(donor.bloodGroup, "O+");
assert.strictEqual(donor.district, "Kollam");
assert.strictEqual(donor.mobileNumber, "+916282135504");
assert.strictEqual(donor.whatsappNumber, "+916282135504"); // "Same" mapped to mobile number
assert.strictEqual(donor.isAvailable, true);
assert.strictEqual(donor.hasConsent, true);
console.log("✓ Donor Mapping & Normalization PASSED");

// 6. Public Sanitization: Ensure unconsented contacts are NEVER exposed
console.log("\n[Test 6] Privacy Sanitization Rules...");
const unconsentedDonor = {
  id: "DNR-9999",
  name: "Private Donor",
  bloodGroup: "B+",
  district: "Ernakulam",
  currentResidence: "Kerala",
  mobileNumber: "+919876543210",
  whatsappNumber: "+919876543210",
  isAvailable: true,
  hasConsent: true,
  adminStatus: "APPROVED",
  publicCallConsent: false, // Opted out of call
  publicWhatsAppConsent: false // Opted out of WhatsApp
};
const sanitized = sanitizePublicDonors([donor, unconsentedDonor]);
assert.strictEqual(sanitized.length, 2);
const s1 = sanitized.find(d => d.id === donor.id);
assert.strictEqual(s1.allowCall, true);
assert.strictEqual(s1.phone, "+916282135504");

const s2 = sanitized.find(d => d.id === "DNR-9999");
assert.strictEqual(s2.allowCall, false);
assert.strictEqual(s2.phone, null); // Strictly null!
assert.strictEqual(s2.allowWhatsApp, false);
assert.strictEqual(s2.whatsapp, null); // Strictly null!
console.log("✓ Privacy Sanitization & Contact Protection PASSED");

// 7. Live Google Sheet Connectivity Test
console.log("\n[Test 7] Live Google Sheet Synchronization...");
(async () => {
  const liveRecords = await fetchLiveDonors();
  assert.ok(liveRecords.length >= 1, "Should fetch at least 1 record from live Google Sheet");
  console.log(`✓ Live Google Sheet Synced successfully (${liveRecords.length} record(s) fetched)`);
  
  // 8. Admin Overrides
  console.log("\n[Test 8] Admin Overrides...");
  adminOverrides.set(liveRecords[0].id, { isAvailable: false });
  const overridden = applyOverrides(liveRecords);
  assert.strictEqual(overridden[0].isAvailable, false);
  console.log("✓ Admin Overrides PASSED");

  console.log("\n=======================================================");
  console.log("🎉 ALL BLOOD PM BROZZ INTEGRATION TESTS PASSED (8/8)!");
  console.log("=======================================================\n");
})();
