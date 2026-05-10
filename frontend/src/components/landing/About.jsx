import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { aboutItems } from "../../data/landingData";

gsap.registerPlugin(ScrollTrigger);

// ✅ Premium 3D Graduation Cap Component
function GraduationCap3D() {
  return (
    <div className="grad-cap-wrapper">
      <div className="grad-cap-scene">
        {/* Cap top (mortarboard) */}
        <div className="grad-cap-top">
          <div className="grad-cap-face grad-cap-face-top">🎓</div>
        </div>
        
        {/* Tassel */}
        <div className="grad-cap-tassel" />
        
        {/* Glow */}
        <div className="grad-cap-glow" />
        
        {/* Floating particles around */}
        <div className="grad-particle grad-particle-1">📚</div>
        <div className="grad-particle grad-particle-2">✨</div>
        <div className="grad-particle grad-particle-3">⭐</div>
        <div className="grad-particle grad-particle-4">💡</div>
      </div>

      {/* A++ Badge */}
      <div className="grad-badge">
        <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: "32px", color: "white", fontWeight: "300", lineHeight: 1 }}>A++</div>
        <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.7)", letterSpacing: "1px" }}>NAAC GRADE</div>
      </div>
    </div>
  );
}

export default function About() {
  const sectionRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const itemsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(leftRef.current,
        { opacity: 0, x: -80 },
        {
          opacity: 1, x: 0, duration: 1.2, ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(rightRef.current,
        { opacity: 0, x: 80, rotate: 5 },
        {
          opacity: 1, x: 0, rotate: 0, duration: 1.2, ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );

      const items = itemsRef.current?.querySelectorAll(".about-item");
      if (items) {
        gsap.fromTo(items,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out",
            scrollTrigger: {
              trigger: itemsRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} style={{ padding: "120px 6%", background: "#030810", position: "relative" }}>
      
      <div style={{ 
        position: "absolute", top: 0, left: 0, right: 0, height: "1px", 
        background: "linear-gradient(90deg, transparent, rgba(29,158,117,0.3), transparent)" 
      }} />

      <div className="about-grid" style={{ 
        maxWidth: "1200px", margin: "0 auto", display: "grid", 
        gridTemplateColumns: "1fr 1fr", gap: "100px", alignItems: "center" 
      }}>
        {/* Left Text */}
        <div ref={leftRef}>
          <div style={{ fontSize: "11px", color: "#1D9E75", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "20px" }}>
            — About
          </div>
          
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: "300", color: "white", marginBottom: "24px", lineHeight: "1.2" }}>
            Sri Guru Teg Bahadur<br />
            <span style={{ fontStyle: "italic", color: "#1D9E75", display: "inline-block" }}>
              Khalsa College
            </span>
          </h2>
          
          <div style={{ height: "1px", background: "#1D9E75", margin: "20px 0", width: "60px" }} />
          
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", lineHeight: "1.9", marginBottom: "16px", fontWeight: "300" }}>
            A premier institution of higher education in Punjab, India. Established with a vision to provide quality education, accredited with NAAC Grade A++.
          </p>
          
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", lineHeight: "1.9", marginBottom: "40px", fontWeight: "300" }}>
            AcademiQ was built to digitize academic resources and empower students with AI-driven learning tools.
          </p>

          <div 
            ref={itemsRef}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "40px" }}
          >
            {aboutItems.map((item) => (
              <div 
                key={item.label}
                className="about-item hover-target" 
                style={{ 
                  padding: "14px 16px", border: "1px solid rgba(255,255,255,0.06)", 
                  borderRadius: "2px", display: "flex", alignItems: "center", 
                  gap: "10px", transition: "all 0.3s", cursor: "pointer",
                }} 
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = "#1D9E75"; 
                  e.currentTarget.style.background = "rgba(29,158,117,0.05)";
                }} 
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; 
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <span style={{ fontSize: "16px" }}>{item.icon}</span>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.5px" }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <motion.a 
            whileHover={{ scale: 1.05, y: -3 }}
            href="https://www.sgtbcollege.org.in/" 
            target="_blank" rel="noreferrer" 
            className="btn-outline hover-target" 
            style={{ display: "inline-block", textDecoration: "none", padding: "12px 28px", fontSize: "11px" }}
          >
            Visit Website →
          </motion.a>
        </div>

        {/* ✅ Right Visual — Premium 3D Graduation Cap */}
        <div ref={rightRef} className="about-visual" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <GraduationCap3D />
        </div>
      </div>
    </section>
  );
}