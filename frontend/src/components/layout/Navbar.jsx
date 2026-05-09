import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IMAGES } from "../../data/landingData";

export default function Navbar({ scrollY = 0 }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
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

      {/* Nav Links — Desktop */}
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

      {/* Right Side — Desktop */}
      <div className="nav-actions" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          className="nav-link hover-target"
          onClick={() => navigate("/register")}
          style={{ fontSize: "11px", letterSpacing: "1px" }}
        >
          Register
        </button>
        <button 
          className="btn-primary hover-target" 
          onClick={() => navigate("/login")} 
          style={{ padding: "10px 24px", fontSize: "11px" }}
        >
          <span>Login →</span>
        </button>
      </div>

      {/* Hamburger — Mobile */}
      <button
        className="nav-hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: "none",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "8px",
          flexDirection: "column",
          gap: "5px",
        }}
      >
        <span style={{ width: "22px", height: "2px", background: "white", display: "block", transition: "all 0.3s",
          transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
        <span style={{ width: "22px", height: "2px", background: "white", display: "block", transition: "all 0.3s",
          opacity: menuOpen ? 0 : 1 }} />
        <span style={{ width: "22px", height: "2px", background: "white", display: "block", transition: "all 0.3s",
          transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
      </button>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div style={{
          position: "fixed",
          top: "72px",
          left: 0,
          right: 0,
          background: "rgba(3,8,16,0.98)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "24px 6%",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          zIndex: 999,
        }}>
          <button className="nav-link" onClick={() => scrollToSection("features")}>Features</button>
          <button className="nav-link" onClick={() => scrollToSection("about")}>About</button>
          <button className="nav-link" onClick={() => scrollToSection("developer")}>Developer</button>
          <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.08)" }} />
          <button className="nav-link" onClick={() => { navigate("/register"); setMenuOpen(false); }}>Register</button>
          <button className="btn-primary" onClick={() => { navigate("/login"); setMenuOpen(false); }}
            style={{ padding: "12px 24px", fontSize: "13px" }}>
            Login →
          </button>
        </div>
      )}
    </nav>
  );
}