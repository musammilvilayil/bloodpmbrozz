export const BLOOD_COMPATIBILITY = {
  "O-": {
    give: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
    receive: ["O-"],
    label: "Universal Red Cell Donor",
    description: "Can be given to patients of any blood type in extreme emergencies."
  },
  "O+": {
    give: ["O+", "A+", "B+", "AB+"],
    receive: ["O+", "O-"],
    label: "Most Common Blood Type",
    description: "Crucial for emergency units and trauma centers."
  },
  "A-": {
    give: ["A-", "A+", "AB-", "AB+"],
    receive: ["A-", "O-"],
    label: "Rare Negative Group",
    description: "Important for matching A- and AB- patients."
  },
  "A+": {
    give: ["A+", "AB+"],
    receive: ["A+", "A-", "O+", "O-"],
    label: "High Demand Group",
    description: "Widely needed across surgeries and oncology."
  },
  "B-": {
    give: ["B-", "B+", "AB-", "AB+"],
    receive: ["B-", "O-"],
    label: "Rare Negative Group",
    description: "Vital for neonatal and pediatric emergencies."
  },
  "B+": {
    give: ["B+", "AB+"],
    receive: ["B+", "B-", "O+", "O-"],
    label: "High Prevalence in India",
    description: "One of the most frequently requested groups in Kerala."
  },
  "AB-": {
    give: ["AB-", "AB+"],
    receive: ["AB-", "A-", "B-", "O-"],
    label: "Rarest Blood Type",
    description: "Very rare in the population; donors are exceptionally valuable."
  },
  "AB+": {
    give: ["AB+"],
    receive: ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"],
    label: "Universal Recipient",
    description: "Can safely receive red blood cells from any blood group."
  }
};

export const DONOR_ELIGIBILITY = [
  {
    title: "Age & Weight",
    desc: "Age between 18 and 65 years. Body weight must be at least 50 kg.",
    icon: "UserCheck"
  },
  {
    title: "Hemoglobin Level",
    desc: "Minimum hemoglobin level of 12.5 g/dl at the time of screening.",
    icon: "Activity"
  },
  {
    title: "Donation Interval",
    desc: "Minimum 3 months (90 days) for men; minimum 4 months (120 days) for women.",
    icon: "Calendar"
  },
  {
    title: "Health & Medication",
    desc: "Free from fever, cold, or flu for at least 48 hours. No antibiotics in the last 7 days.",
    icon: "ShieldCheck"
  },
  {
    title: "Hydration & Rest",
    desc: "Well-rested (at least 6 hours sleep) and adequately hydrated prior to donation.",
    icon: "Heart"
  },
  {
    title: "Medical Deferrals",
    desc: "Tattoos or piercings within the last 6 months require temporary deferral as per medical protocols.",
    icon: "AlertCircle"
  }
];
