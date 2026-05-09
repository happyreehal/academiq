import { useNavigate } from "react-router-dom";
import { IMAGES } from "../../data/landingData";

export default function Navbar({ scrollY }) {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      padding: "0 6%", height: "72px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrollY > 50 ? "rgba(3,8,16,0.95)" : "transparent",
      backdropFilter: scrollY > 50 ? "blur(20px)" : "none",
      borderBottom: scrollY > 50 ? "1px solid rgba(255,255,255,0.06)" : "none",
      transition: "all 0.4s ease",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <img 
          src={IMAGES.COLLEGE_LOGO} 
          alt="logo" 
          className="hover-glow" 
          style={{ width: "38px", height: "38px", borderRadius: "4px", objectFit: "cover" }} 
        />
        <div>
          <div style={{ color: "white", fontWeight: "600", fontSize: "15px", letterSpacing: "1px" }}>
            ACADEMIQ
          </div>
          <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px", letterSpacing: "1px" }}>
            SGTB KHALSA COLLEGE
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: "40px" }}>
        <button className="nav-link hover-target" onClick={() => scrollToSection("features")}>
          Features
        </button>
        <button className="nav-link hover-target" onClick={() => scrollToSection("about")}>
          About
        </button>
        <button className="nav-link hover-target" onClick={() => scrollToSection("developer")}>
          Developer
        </button>
      </div>

      {/* Login Button */}
      <button 
        className="btn-primary hover-target" 
        onClick={() => navigate("/login")} 
        style={{ padding: "10px 24px", fontSize: "11px" }}
      >
        <span>Login →</span>
      </button>
    </nav>
  );
}