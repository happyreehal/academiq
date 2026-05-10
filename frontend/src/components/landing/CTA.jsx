import { motion } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function MagneticButton({ children, onClick, className, primary = false }) {
  const buttonRef = useRef(null);
  const rafRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      if (!buttonRef.current) { rafRef.current = null; return; }
      const rect = buttonRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
      setPosition({ x, y });
      rafRef.current = null;
    });
  }, []);

  const handleMouseLeave = () => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", damping: 15, stiffness: 200 }}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      {primary ? <span>{children}</span> : children}
    </motion.button>
  );
}

export default function CTA() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Content scale + fade in on scroll
      gsap.fromTo(contentRef.current,
        { opacity: 0, scale: 0.85, y: 60 },
        {
          opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{ padding: "120px 6%", background: "#040b14", position: "relative", textAlign: "center" }}>
      
      <div style={{ 
        position: "absolute", top: 0, left: 0, right: 0, height: "1px", 
        background: "linear-gradient(90deg, transparent, rgba(29,158,117,0.3), transparent)" 
      }} />
      
      <div style={{ 
        position: "absolute", inset: 0, 
        background: "radial-gradient(ellipse at center, rgba(29,158,117,0.06) 0%, transparent 70%)" 
      }} />

      <div ref={contentRef} style={{ maxWidth: "600px", margin: "0 auto", position: "relative" }}>
        <div style={{ fontSize: "11px", color: "#1D9E75", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "24px" }}>
          — Get Started
        </div>
        
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px,5vw,64px)", fontWeight: "300", color: "white", marginBottom: "24px", lineHeight: "1.1" }}>
          <span style={{ display: "inline-block" }}>Ready to Ace</span>
          <br />
          <span style={{ fontStyle: "italic", color: "#1D9E75", textShadow: "0 0 15px rgba(29,158,117,0.3)", display: "inline-block" }}>
            Your Exams?
          </span>
        </h2>
        
        <div style={{ height: "1px", background: "#1D9E75", margin: "0 auto 32px", width: "60px" }} />
        
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px", marginBottom: "48px", lineHeight: "1.8", fontWeight: "300" }}>
          Join AcademiQ and access years of question papers with AI-powered practice tests.
        </p>

        <div className="cta-btns" style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <MagneticButton onClick={() => navigate("/register")} className="btn-primary hover-target" primary={true}>
            Register Now — It's Free
          </MagneticButton>
          <MagneticButton onClick={() => navigate("/login")} className="btn-outline hover-target">
            Sign In →
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}