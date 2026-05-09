import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { aboutItems, IMAGES } from "../../data/landingData";

export default function About() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section 
      id="about" 
      ref={sectionRef}
      style={{ 
        padding: "120px 6%", 
        background: "#030810", 
        position: "relative" 
      }}
    >
      {/* Animated Top Border */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ 
          position: "absolute", top: 0, left: 0, right: 0, height: "1px", 
          background: "linear-gradient(90deg, transparent, rgba(29,158,117,0.3), transparent)" 
        }} 
      />

      <div className="about-grid" style={{ 
        maxWidth: "1200px", margin: "0 auto", display: "grid", 
        gridTemplateColumns: "1fr 1fr", gap: "100px", alignItems: "center" 
      }}>
        {/* Left Text - Slides from Left */}
        <motion.div 
          initial={{ opacity: 0, x: -60 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{ 
              fontSize: "11px", color: "#1D9E75", letterSpacing: "3px", 
              textTransform: "uppercase", marginBottom: "20px" 
            }}
          >
            — About
          </motion.div>
          
          <h2 style={{ 
            fontFamily: "'Cormorant Garamond', serif", 
            fontSize: "clamp(28px,4vw,48px)", fontWeight: "300", 
            color: "white", marginBottom: "24px", lineHeight: "1.2" 
          }}>
            Sri Guru Teg Bahadur<br />
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              style={{ fontStyle: "italic", color: "#1D9E75", display: "inline-block" }}
            >
              Khalsa College
            </motion.span>
          </h2>
          
          <motion.div 
            initial={{ width: 0 }}
            animate={isInView ? { width: 60 } : { width: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            style={{ height: "1px", background: "#1D9E75", margin: "20px 0" }}
          />
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            style={{ 
              color: "rgba(255,255,255,0.4)", fontSize: "14px", 
              lineHeight: "1.9", marginBottom: "16px", fontWeight: "300" 
            }}
          >
            A premier institution of higher education in Punjab, India. Established with a vision to provide quality education, accredited with NAAC Grade A++.
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 1, duration: 0.6 }}
            style={{ 
              color: "rgba(255,255,255,0.4)", fontSize: "14px", 
              lineHeight: "1.9", marginBottom: "40px", fontWeight: "300" 
            }}
          >
            AcademiQ was built to digitize academic resources and empower students with AI-driven learning tools.
          </motion.p>

          {/* About Items - Stagger */}
          <motion.div 
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
              visible: { transition: { staggerChildren: 0.1, delayChildren: 1.2 } }
            }}
            style={{ 
              display: "grid", gridTemplateColumns: "1fr 1fr", 
              gap: "12px", marginBottom: "40px" 
            }}
          >
            {aboutItems.map((item, i) => (
              <motion.div 
                key={i} 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ scale: 1.05, y: -3 }}
                className="hover-target" 
                style={{ 
                  padding: "14px 16px", 
                  border: "1px solid rgba(255,255,255,0.06)", 
                  borderRadius: "2px", display: "flex", 
                  alignItems: "center", gap: "10px", transition: "all 0.3s",
                  cursor: "pointer",
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
                <span className="emoji" style={{ fontSize: "16px" }}>{item.icon}</span>
                <span style={{ 
                  fontSize: "12px", color: "rgba(255,255,255,0.5)", 
                  letterSpacing: "0.5px" 
                }}>
                  {item.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          <motion.a 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            whileHover={{ scale: 1.05, y: -3 }}
            href="https://www.sgtbcollege.org.in/" 
            target="_blank" 
            rel="noreferrer" 
            className="btn-outline hover-target" 
            style={{ 
              display: "inline-block", textDecoration: "none", 
              padding: "12px 28px", fontSize: "11px" 
            }}
          >
            Visit Website →
          </motion.a>
        </motion.div>

        {/* Right Visual - Slides from Right with Rotate */}
        <motion.div 
          initial={{ opacity: 0, x: 60, rotate: 5 }}
          animate={isInView ? { opacity: 1, x: 0, rotate: 0 } : { opacity: 0, x: 60, rotate: 5 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="about-visual floating" 
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div style={{ position: "relative", width: "320px", height: "400px" }}>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="hover-glow" 
              style={{ 
                width: "100%", height: "100%", 
                border: "1px solid rgba(29,158,117,0.4)", 
                borderRadius: "2px", overflow: "hidden", 
                background: "linear-gradient(135deg, #0d2035, #1D9E75)", 
                boxShadow: "0 20px 40px rgba(0,0,0,0.5)" 
              }}
            >
              <img 
                src={IMAGES.COLLEGE_LOGO} 
                alt="College" 
                style={{ 
                  width: "100%", height: "100%", 
                  objectFit: "contain", padding: "40px" 
                }} 
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
              transition={{ delay: 1, type: "spring", damping: 12 }}
              style={{ 
                position: "absolute", top: "-16px", left: "-16px", 
                width: "80px", height: "80px", 
                border: "1px solid rgba(29,158,117,0.5)", borderRadius: "2px" 
              }} 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0, rotate: -180 }}
              transition={{ delay: 1.2, type: "spring", damping: 12 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              style={{ 
                position: "absolute", bottom: "-16px", right: "-16px", 
                width: "120px", height: "60px", background: "#1D9E75", 
                borderRadius: "2px", display: "flex", flexDirection: "column", 
                alignItems: "center", justifyContent: "center", 
                boxShadow: "0 10px 20px rgba(29,158,117,0.4)",
                cursor: "pointer",
              }}
            >
              <div style={{ 
                fontFamily: "'Cormorant Garamond'", fontSize: "32px", 
                color: "white", fontWeight: "300" 
              }}>
                A++
              </div>
              <div style={{ 
                fontSize: "9px", color: "rgba(255,255,255,0.7)", letterSpacing: "1px" 
              }}>
                NAAC GRADE
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}