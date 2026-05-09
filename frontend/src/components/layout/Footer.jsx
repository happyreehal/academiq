import { motion } from "framer-motion";
import { IMAGES } from "../../data/landingData";

export default function Footer() {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      style={{ 
        background: "#020609", padding: "40px 6%", 
        borderTop: "1px solid rgba(255,255,255,0.04)" 
      }}
    >
      <div style={{ 
        maxWidth: "1200px", margin: "0 auto", 
        display: "flex", justifyContent: "space-between", 
        alignItems: "center", flexWrap: "wrap", gap: "20px" 
      }}>
        {/* Logo */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="hover-glow hover-target" 
          style={{ 
            display: "flex", alignItems: "center", 
            gap: "12px", cursor: "none" 
          }}
        >
          <img 
            src={IMAGES.COLLEGE_LOGO} 
            alt="logo" 
            style={{ 
              width: "30px", height: "30px", 
              borderRadius: "3px", objectFit: "cover" 
            }} 
          />
          <span style={{ 
            color: "rgba(255,255,255,0.5)", fontSize: "13px", letterSpacing: "2px" 
          }}>
            ACADEMIQ
          </span>
        </motion.div>

        {/* Center Text */}
        <p style={{ 
          color: "rgba(255,255,255,0.2)", fontSize: "11px", textAlign: "center" 
        }}>
          SGTB Khalsa College, Sri Anandpur Sahib • NAAC A++
        </p>

        {/* Right Text */}
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px" }}>
          Developed by Happy Reehal © 2026
        </p>
      </div>
    </motion.footer>
  );
}