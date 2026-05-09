// ✅ Fix 1 — SUPER_ADMIN_EMAIL import remove, is_super use karo
export default function AdminsTab({ admins, approveAdmin, rejectAdmin, removeAdmin }) {
  const pendingAdmins = admins.filter(a => a.status === "pending");
  const activeAdmins = admins.filter(a => a.status === "active");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* PENDING ADMINS */}
      <div className="card">
        <h2 className="card-title">
          ⏳ Pending Admin Requests 
          <span className="badge badge-yellow">{pendingAdmins.length}</span>
        </h2>
        
        {pendingAdmins.length === 0 ? (
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", fontWeight: "300" }}>
            No pending requests
          </p>
        ) : (
          pendingAdmins.map(a => (
            <div key={a.email} className="list-item">
              <div>
                {/* ✅ Fix 2 — fallback */}
                <div className="list-item-name">{a.name ?? "Unknown"}</div>
                <div className="list-item-info">{a.email}</div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button className="btn-approve" onClick={() => approveAdmin(a.email)}>✅ Approve</button>
                <button className="btn-reject" onClick={() => rejectAdmin(a.email)}>❌ Reject</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ACTIVE ADMINS */}
      <div className="card">
        <h2 className="card-title">
          👑 Active Admins 
          <span className="badge badge-green">{activeAdmins.length}</span>
        </h2>
        
        {activeAdmins.length === 0 ? (
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", fontWeight: "300" }}>
            No active admins
          </p>
        ) : (
          activeAdmins.map(a => (
            <div key={a.email} className="list-item">
              <div>
                <div className="list-item-name" style={{ display: "flex", alignItems: "center" }}>
                  {a.name ?? "Unknown"}
                  {/* ✅ Fix 1 — is_super use karo */}
                  {a.is_super && (
                    <span className="badge-super">SUPER</span>
                  )}
                </div>
                <div className="list-item-info">{a.email}</div>
              </div>
              
              {/* ✅ Fix 1 — is_super se check */}
              {!a.is_super && (
                <button className="btn-danger" onClick={() => removeAdmin(a.email)}>
                  🗑️ Remove
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}