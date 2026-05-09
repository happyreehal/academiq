// API Configuration
export const API = "https://academiq-jenb.onrender.com";

// Semester Options
export const SEMESTERS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];

// Token Helpers
export const getToken = () => localStorage.getItem("academiq_token");

export const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`
});

// Tab Configuration
export const ADMIN_TABS = [
  { id: "upload", label: "Upload", icon: "📤" },
  { id: "papers", label: "Papers", icon: "📋" },
  { id: "students", label: "Students", icon: "👨‍🎓" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

export const SUPER_ADMIN_TABS = [
  { id: "admins", label: "Admins", icon: "👑", isSuper: true },
  { id: "superadmin", label: "Super", icon: "🔐", isSuper: true },
];