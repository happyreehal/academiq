import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AINavbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="ai-navbar">
      {/* Left: Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div className="ai-logo">Q</div>
        <span style={{ fontWeight: "600", fontSize: "16px", letterSpacing: "0.5px", color: "white" }}>
          AcademiQ <span style={{ color: "#1D9E75" }}>AI</span>
        </span>
      </div>

      {/* Right: Back + Logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button onClick={() => navigate("/student")} className="btn-back">
          BACK
        </button>
        <button onClick={handleLogout} className="btn-logout-ai">
          Logout
        </button>
      </div>
    </nav>
  );
}