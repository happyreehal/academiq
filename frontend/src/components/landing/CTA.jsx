import { motion, useInView } from "framer-motion";
import { useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

function MagneticButton({ children, onClick, className, primary = false }) {
  const buttonRef = useRef(null);
  const rafRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // ✅ Fix — RAF throttled
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
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} style={{ padding: "120px 6%", background: "#040b14", position: "relative", textAlign: "center" }}>
      
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1 }}
        style={{ 
          position: "absolute", top: 0, left: 0, right: 0, height: "1px", 
          background: "linear-gradient(90deg, transparent, rgba(29,158,117,0.3), transparent)" 
        }} 
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ duration: 1.5 }}
        style={{ 
          position: "absolute", inset: 0, 
          background: "radial-gradient(ellipse at center, rgba(29,158,117,0.06) 0%, transparent 70%)" 
        }} 
      />

      <div style={{ maxWidth: "600px", margin: "0 auto", position: "relative" }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          style={{ fontSize: "11px", color: "#1D9E75", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "24px" }}
        >
          — Get Started
        </motion.div>
        
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px,5vw,64px)", fontWeight: "300", color: "white", marginBottom: "24px", lineHeight: "1.1" }}>
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ display: "inline-block" }}
          >
            Ready to Ace
          </motion.span>
          <br />
          <motion.span 
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ fontStyle: "italic", color: "#1D9E75", textShadow: "0 0 15px rgba(29,158,117,0.3)", display: "inline-block" }}
          >
            Your Exams?
          </motion.span>
        </h2>
        
        <motion.div 
          initial={{ width: 0 }}
          animate={isInView ? { width: 60 } : { width: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{ height: "1px", background: "#1D9E75", margin: "0 auto 32px" }}
        />
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px", marginBottom: "48px", lineHeight: "1.8", fontWeight: "300" }}
        >
          Join AcademiQ and access years of question papers with AI-powered practice tests.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="cta-btns" 
          style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}
        >
          <MagneticButton onClick={() => navigate("/register")} className="btn-primary hover-target" primary={true}>
            Register Now — It's Free
          </MagneticButton>
          <MagneticButton onClick={() => navigate("/login")} className="btn-outline hover-target">
            Sign In →
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}