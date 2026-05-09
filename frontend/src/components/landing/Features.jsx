import { motion, useInView } from "framer-motion";
import { useRef, useState, useCallback } from "react";
import { features } from "../../data/landingData";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.9 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring", damping: 15, stiffness: 100 },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

function TiltCard({ feature }) {
  const cardRef = useRef(null);
  const rafRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  // ✅ Fix — RAF throttled mousemove
  const handleMouseMove = useCallback((e) => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      if (!cardRef.current) { rafRef.current = null; return; }
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      setTilt({
        x: ((e.clientY - centerY) / rect.height) * -10,
        y: ((e.clientX - centerX) / rect.width) * 10,
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
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="feat-card hover-target"
      style={{
        background: "#040b14",
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.1s ease-out",
        position: "relative", overflow: "hidden",
      }}
    >
      {/* Dynamic Glow */}
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

      <motion.div 
        whileHover={{ scale: 1.4, rotate: 15 }}
        transition={{ type: "spring", damping: 10 }}
        style={{ fontSize: "28px", marginBottom: "16px", position: "relative", zIndex: 1, display: "inline-block" }}
      >
        {feature.icon}
      </motion.div>

      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: "400", color: "white", marginBottom: "12px", position: "relative", zIndex: 1 }}>
        {feature.title}
      </h3>

      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", lineHeight: "1.8", fontWeight: "300", position: "relative", zIndex: 1 }}>
        {feature.desc}
      </p>
    </motion.div>
  );
}

export default function Features() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="features" ref={sectionRef} style={{ padding: "120px 6%", background: "#040b14", position: "relative" }}>
      
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ 
          position: "absolute", top: 0, left: 0, right: 0, height: "1px", 
          background: "linear-gradient(90deg, transparent, rgba(29,158,117,0.3), transparent)",
          transformOrigin: "center",
        }} 
      />

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <motion.div 
          variants={titleVariants} initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          style={{ marginBottom: "80px" }}
        >
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6 }}
            style={{ fontSize: "11px", color: "#1D9E75", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "20px" }}
          >
            — Features
          </motion.div>
          
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px,4vw,52px)", fontWeight: "300", color: "white", maxWidth: "500px", lineHeight: "1.2" }}>
            Everything You Need
            <br />
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              style={{ fontStyle: "italic", color: "#1D9E75", display: "inline-block" }}
            >
              to Excel
            </motion.span>
          </h2>
        </motion.div>

        <motion.div 
          variants={containerVariants} initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="feat-grid" 
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1px", background: "rgba(255,255,255,0.04)" }}
        >
          {features.map((feature, i) => (
            <TiltCard key={feature.num} feature={feature} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}