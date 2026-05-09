import { ADMIN_TABS, SUPER_ADMIN_TABS } from "../../data/adminConstants";

export default function AdminTabs({ activeTab, setActiveTab, isSuperAdmin, pendingStudents, pendingAdmins }) {
  
  // Combine tabs based on user role
  const tabs = isSuperAdmin 
    ? [...ADMIN_TABS, ...SUPER_ADMIN_TABS] 
    : ADMIN_TABS;

  // Get badge count for specific tabs
  const getBadgeCount = (tabId) => {
    if (tabId === "students") return pendingStudents;
    if (tabId === "admins") return pendingAdmins;
    return 0;
  };

  return (
    <div style={{
      display: "flex", 
      gap: "8px", 
      marginBottom: "36px", 
      background: "rgba(255,255,255,0.02)", 
      padding: "8px", 
      borderRadius: "4px", 
      border: "1px solid rgba(255,255,255,0.06)", 
      flexWrap: "wrap", 
      backdropFilter: "blur(20px)"
    }}>
      {tabs.map(tab => {
        const badgeCount = getBadgeCount(tab.id);
        const isActive = activeTab === tab.id;
        const isSuperTab = tab.isSuper;
        
        return (
          <button
            key={tab.id}
            className={`adm-tab ${isSuperTab ? "super-tab" : ""} ${isActive ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
            {badgeCount > 0 && (
              <span className="badge badge-red" style={{ marginLeft: "6px", padding: "2px 6px", fontSize: "10px" }}>
                {badgeCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}