import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isSuperAdmin = user?.is_super;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="admin-navbar">
      {/* Left: Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div className="admin-logo">Q</div>
        <span style={{ color: "white", fontWeight: "600", fontSize: "15px" }}>
          AcademiQ <span style={{ color: "#1D9E75" }}>Admin</span>
          {isSuperAdmin && <span className="badge-super">SUPER</span>}
        </span>
      </div>

      {/* Right: User + Logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <span style={{ 
          color: "rgba(255,255,255,0.5)", 
          fontSize: "13px", 
          letterSpacing: "1px" 
        }}>
          {/* ✅ Fallback added */}
          👋 {user?.name ?? "Admin"}
        </span>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>
    </nav>
  );
}