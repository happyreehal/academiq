import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { steps } from "../../data/landingData";

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section 
      ref={sectionRef}
      style={{ 
        padding: "120px 6%", 
        background: "#040b14", 
        position: "relative" 
      }}
    >
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1 }}
        style={{ 
          position: "absolute", top: 0, left: 0, right: 0, height: "1px", 
          background: "linear-gradient(90deg, transparent, rgba(29,158,117,0.3), transparent)" 
        }} 
      />

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Section Title */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: "center", marginBottom: "80px" }}
        >
          <div style={{ 
            fontSize: "11px", color: "#1D9E75", letterSpacing: "3px", 
            textTransform: "uppercase", marginBottom: "20px" 
          }}>
            — How It Works
          </div>
          <h2 style={{ 
            fontFamily: "'Cormorant Garamond', serif", 
            fontSize: "clamp(28px,4vw,52px)", fontWeight: "300", color: "white" 
          }}>
            Three Simple{" "}
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{ fontStyle: "italic", color: "#1D9E75", display: "inline-block" }}
            >
              Steps
            </motion.span>
          </h2>
        </motion.div>

        {/* Steps Grid - Stagger */}
        <motion.div 
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            visible: { transition: { staggerChildren: 0.2, delayChildren: 0.5 } }
          }}
          className="steps-grid" 
          style={{ 
            display: "grid", gridTemplateColumns: "repeat(3,1fr)", 
            gap: "2px", background: "rgba(255,255,255,0.04)" 
          }}
        >
          {steps.map((s, i) => (
            <motion.div 
              key={i} 
              variants={{
                hidden: { opacity: 0, y: 50, scale: 0.9 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 15 } }
              }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="step-card hover-target" 
              style={{ 
                background: "#040b14", padding: "48px 36px", 
                position: "relative", overflow: "hidden", 
                borderTop: "2px solid transparent", 
                cursor: "pointer",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderTopColor = "#1D9E75"; 
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.4)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderTopColor = "transparent"; 
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div className="step-num">{s.step}</div>
              
              <motion.div 
                whileHover={{ scale: 1.4, rotate: 15 }}
                style={{ 
                  fontSize: "32px", 
                  marginBottom: "20px",
                  display: "inline-block",
                }}
              >
                {s.icon}
              </motion.div>
              
              <h3 style={{ 
                fontFamily: "'Cormorant Garamond', serif", 
                fontSize: "24px", fontWeight: "400", 
                color: "white", marginBottom: "14px" 
              }}>
                {s.title}
              </h3>
              
              <p style={{ 
                color: "rgba(255,255,255,0.35)", fontSize: "13px", 
                lineHeight: "1.8", fontWeight: "300" 
              }}>
                {s.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}