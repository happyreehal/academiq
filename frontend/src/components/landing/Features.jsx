import { motion } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { features } from "../../data/landingData";

gsap.registerPlugin(ScrollTrigger);

// ✅ Premium SVG Icons (theme matched)
const ICONS = {
  "01": (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <line x1="8" y1="7" x2="16" y2="7" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  ),
  "02": (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" y1="16" x2="8" y2="16" />
      <line x1="16" y1="16" x2="16" y2="16" />
    </svg>
  ),
  "03": (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  ),
  "04": (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12" y2="18" />
    </svg>
  ),
  "05": (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  "06": (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
};

// ✅ Premium Icon with subtle animation
function PremiumIcon({ num }) {
  return (
    <div className="premium-icon">
      <div className="premium-icon-bg" />
      <div className="premium-icon-svg" style={{ color: "#1D9E75" }}>
        {ICONS[num]}
      </div>
    </div>
  );
}

function TiltCard({ feature, index }) {
  const cardRef = useRef(null);
  const rafRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    gsap.fromTo(el,
      { opacity: 0, y: 60, scale: 0.9 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.8, delay: index * 0.08, ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
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

      setTilt({
        x: ((e.clientY - centerY) / rect.height) * -6,
        y: ((e.clientX - centerX) / rect.width) * 6,
      });
      setGlowPos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
      rafRef.current = null;
    });
  }, []);

  const handleMouseLeave = () => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
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
        transition: "transform 0.2s ease-out",
        position: "relative",
        overflow: "hidden",
        padding: "36px 32px",
        minHeight: "260px",
      }}
    >
      {/* Glow overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(29,158,117,0.12) 0%, transparent 60%)`,
        pointerEvents: "none",
        opacity: tilt.x !== 0 || tilt.y !== 0 ? 1 : 0,
        transition: "opacity 0.3s",
      }} />

      {/* Number */}
      <div style={{
        fontSize: "11px",
        color: "rgba(29,158,117,0.4)",
        letterSpacing: "3px",
        marginBottom: "24px",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: "600",
        position: "relative", zIndex: 1
      }}>
        {feature.num}
      </div>

      {/* Premium Icon */}
      <PremiumIcon num={feature.num} />

      {/* Title */}
      <h3 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "22px",
        fontWeight: "500",
        color: "white",
        marginBottom: "14px",
        marginTop: "24px",
        position: "relative",
        zIndex: 1,
        lineHeight: "1.3",
      }}>
        {feature.title}
      </h3>

      {/* Description */}
      <p style={{
        color: "rgba(255,255,255,0.4)",
        fontSize: "13px",
        lineHeight: "1.7",
        fontWeight: "300",
        position: "relative",
        zIndex: 1,
      }}>
        {feature.desc}
      </p>

      {/* Bottom accent line */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "2px",
        background: "linear-gradient(90deg, #1D9E75, transparent)",
        transform: tilt.x !== 0 || tilt.y !== 0 ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left",
        transition: "transform 0.4s ease",
      }} />
    </div>
  );
}

export default function Features() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={sectionRef} style={{
      padding: "120px 6%",
      background: "#040b14",
      position: "relative"
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(29,158,117,0.3), transparent)",
      }} />

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div ref={titleRef} style={{ marginBottom: "60px" }}>
          <div style={{
            fontSize: "11px",
            color: "#1D9E75",
            letterSpacing: "3px",
            textTransform: "uppercase",
            marginBottom: "20px"
          }}>
            — Features
          </div>

          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(32px,4vw,52px)",
            fontWeight: "300",
            color: "white",
            maxWidth: "500px",
            lineHeight: "1.2"
          }}>
            Everything You Need
            <br />
            <span style={{ fontStyle: "italic", color: "#1D9E75" }}>
              to Excel
            </span>
          </h2>
        </div>

        <div className="feat-grid">
          {features.map((feature, i) => (
            <TiltCard key={feature.num} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}