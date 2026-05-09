import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function StudentNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isAIPage = location.pathname === "/ai-generator";

  return (
    <nav className="student-navbar">
      {/* Left: Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div className="student-logo">Q</div>
        <span style={{ color: "white", fontWeight: "600", fontSize: "15px" }}>
          AcademiQ <span style={{ color: "#1D9E75" }}>Student Portal</span>
        </span>
      </div>

      {/* Right: AI Button + User + Logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <button 
          onClick={() => navigate(isAIPage ? "/student" : "/ai-generator")} 
          className="btn-ai"
        >
          {isAIPage ? "📋 Dashboard" : "🤖 AI Generator"}
        </button>
        
        <span style={{ 
          color: "rgba(255,255,255,0.5)", 
          fontSize: "13px", 
          letterSpacing: "1px" 
        }}>
          👋 {user?.name ?? "Student"}
        </span>
        
        <button onClick={handleLogout} className="btn-logout-student">
          Logout
        </button>
      </div>
    </nav>
  );
}