import { motion } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { features } from "../../data/landingData";

gsap.registerPlugin(ScrollTrigger);

// ✅ Premium 3D Icon Component
function Icon3D({ icon, index }) {
  return (
    <div className="icon-3d-wrapper">
      <div className="icon-3d-cube" style={{ animationDelay: `${index * 0.3}s` }}>
        <div className="icon-3d-face icon-3d-front">{icon}</div>
        <div className="icon-3d-face icon-3d-back">{icon}</div>
        <div className="icon-3d-face icon-3d-right">{icon}</div>
        <div className="icon-3d-face icon-3d-left">{icon}</div>
        <div className="icon-3d-face icon-3d-top">{icon}</div>
        <div className="icon-3d-face icon-3d-bottom">{icon}</div>
      </div>
      <div className="icon-3d-glow" />
    </div>
  );
}

function TiltCard({ feature, index }) {
  const cardRef = useRef(null);
  const rafRef = useRef(null);
  const tiltRef = useRef({ x: 0, y: 0 });
  const glowRef = useRef({ x: 50, y: 50 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    gsap.fromTo(el, 
      { opacity: 0, y: 80, scale: 0.85 },
      {
        opacity: 1, y: 0, scale: 1, duration: 1, delay: index * 0.1, ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, [index]);

  const handleMouseMove = useCallback((e) => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      if (!cardRef.current) { rafRef.current = null; return; }
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const newTilt = {
        x: ((e.clientY - centerY) / rect.height) * -10,
        y: ((e.clientX - centerX) / rect.width) * 10,
      };
      const newGlow = {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      };
      
      tiltRef.current = newTilt;
      glowRef.current = newGlow;
      setTilt(newTilt);
      setGlowPos(newGlow);
      rafRef.current = null;
    });
  }, []);

  const handleMouseLeave = () => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    tiltRef.current = { x: 0, y: 0 };
    glowRef.current = { x: 50, y: 50 };
    setTilt({ x: 0, y: 0 });
    setGlowPos({ x: 50, y: 50 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="feat-card hover-target"
      style={{
        background: "#040b14",
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.1s ease-out",
        position: "relative", 
        overflow: "hidden",
        minHeight: "280px", // ✅ Minimum height ensure karo
      }}
    >
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(29,158,117,0.15) 0%, transparent 50%)`,
        pointerEvents: "none",
        opacity: tilt.x !== 0 || tilt.y !== 0 ? 1 : 0,
        transition: "opacity 0.3s",
      }} />

      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", letterSpacing: "2px", marginBottom: "20px", position: "relative", zIndex: 1 }}>
        {feature.num}
      </div>

      <Icon3D icon={feature.icon} index={index} />

      <h3 style={{ 
        fontFamily: "'Cormorant Garamond', serif", 
        fontSize: "20px", 
        fontWeight: "400", 
        color: "white", 
        marginBottom: "12px", 
        marginTop: "20px", 
        position: "relative", 
        zIndex: 1,
        wordWrap: "break-word", // ✅ Text wrap karo
        overflowWrap: "break-word",
      }}>
        {feature.title}
      </h3>

      <p style={{ 
        color: "rgba(255,255,255,0.35)", 
        fontSize: "13px", 
        lineHeight: "1.8", 
        fontWeight: "300", 
        position: "relative", 
        zIndex: 1,
        wordWrap: "break-word", // ✅ Text wrap karo
        overflowWrap: "break-word",
      }}>
        {feature.desc}
      </p>
    </div>
  );
}

export default function Features() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={sectionRef} style={{ padding: "120px 6%", background: "#040b14", position: "relative" }}>
      
      <div style={{ 
        position: "absolute", top: 0, left: 0, right: 0, height: "1px", 
        background: "linear-gradient(90deg, transparent, rgba(29,158,117,0.3), transparent)",
      }} />

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div ref={titleRef} style={{ marginBottom: "80px" }}>
          <div style={{ fontSize: "11px", color: "#1D9E75", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "20px" }}>
            — Features
          </div>
          
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px,4vw,52px)", fontWeight: "300", color: "white", maxWidth: "500px", lineHeight: "1.2" }}>
            Everything You Need
            <br />
            <span style={{ fontStyle: "italic", color: "#1D9E75", display: "inline-block" }}>
              to Excel
            </span>
          </h2>
        </div>

        <div 
          className="feat-grid" 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(3, 1fr)", // ✅ Fixed 3 columns
            gap: "1px", 
            background: "rgba(255,255,255,0.04)",
          }}
        >
          {features.map((feature, i) => (
            <TiltCard key={feature.num} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}