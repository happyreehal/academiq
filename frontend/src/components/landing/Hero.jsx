import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { heroStats, IMAGES } from "../../data/landingData";
import CountUp from "./CountUp";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 50, rotateX: -90 },
  visible: {
    opacity: 1, y: 0, rotateX: 0,
    transition: { type: "spring", damping: 12, stiffness: 100 },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const AnimatedText = ({ text, className, style }) => {
  const letters = text.split("");
  return (
    <motion.span
      className={className} style={style}
      variants={containerVariants} initial="hidden" animate="visible"
      aria-label={text}
    >
      {letters.map((letter, index) => (
        <motion.span key={index} variants={letterVariants} style={{ display: "inline-block" }}>
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default function Hero({ isLoaded, mousePos }) {
  const navigate = useNavigate();

  // ✅ Fix 1 — window size fallback safe values
  const winW = window.innerWidth || 1440;
  const winH = window.innerHeight || 900;

  // ✅ Fix 2 — mousePos default safe check
  const mx = mousePos?.x ?? winW / 2;
  const my = mousePos?.y ?? winH / 2;

  const parallaxX = (mx - winW / 2) * 0.02;
  const parallaxY = (my - winH / 2) * 0.02;

  return (
    <section style={{
      minHeight: "100vh", paddingTop: "72px",
      display: "flex", alignItems: "center",
      position: "relative", overflow: "hidden",
      background: "linear-gradient(135deg, #030810 0%, #06121f 50%, #030810 100%)",
    }}>
      {/* Gradient Orbs */}
      <div style={{ 
        position: "absolute", top: "20%", right: "10%", 
        width: "600px", height: "600px", 
        background: "radial-gradient(circle, rgba(29,158,117,0.06) 0%, transparent 70%)", 
        borderRadius: "50%", 
        // ✅ Fix 1+2 — safe parallax values
        transform: `translate(${parallaxX}px, ${parallaxY}px)`, 
        transition: "transform 0.3s ease" 
      }} />
      <div style={{ 
        position: "absolute", bottom: "10%", left: "5%", 
        width: "400px", height: "400px", 
        background: "radial-gradient(circle, rgba(45,95,160,0.06) 0%, transparent 70%)", 
        borderRadius: "50%" 
      }} />

      {/* Horizontal Line */}
      <div style={{ 
        position: "absolute", top: "50%", left: 0, right: 0, height: "1px", 
        background: "linear-gradient(90deg, transparent, rgba(29,158,117,0.1), transparent)" 
      }} />

      <div className="hero-grid" style={{ 
        maxWidth: "1200px", margin: "0 auto", padding: "80px 6%", 
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", 
        alignItems: "center", width: "100%", position: "relative", zIndex: 1 
      }}>
        {/* Left Content */}
        <div>
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ 
              display: "inline-flex", alignItems: "center", gap: "8px", 
              marginBottom: "28px", padding: "6px 16px", 
              border: "1px solid rgba(29,158,117,0.3)", borderRadius: "2px", 
              background: "rgba(29,158,117,0.05)" 
            }}
          >
            <div style={{ 
              width: "6px", height: "6px", borderRadius: "50%", 
              background: "#1D9E75", animation: "pulse 2s infinite" 
            }} />
            <span style={{ 
              color: "#1D9E75", fontSize: "11px", fontWeight: "600", 
              letterSpacing: "2px", textTransform: "uppercase" 
            }}>
              NAAC Grade A++ Certified
            </span>
          </motion.div>

          {/* Heading */}
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(42px, 5.5vw, 72px)", fontWeight: "300",
            color: "white", lineHeight: "1.1", marginBottom: "28px",
            letterSpacing: "-1px", perspective: "1000px",
          }}>
            <AnimatedText text="Your Academic" />
            <br />
            <AnimatedText text="Edge, " />
            <AnimatedText 
              text="Powered" 
              style={{ fontStyle: "italic", color: "#1D9E75", textShadow: "0 0 20px rgba(29,158,117,0.3)" }} 
            />
            <br />
            <AnimatedText text="by AI" />
          </h1>

          {/* Divider */}
          <motion.div 
            initial={{ width: 0 }} animate={{ width: 60 }}
            transition={{ delay: 1.5, duration: 0.6, ease: "easeOut" }}
            style={{ height: "1px", background: "#1D9E75", margin: "20px 0" }}
          />

          {/* Description */}
          <motion.p 
            variants={fadeUpVariants} initial="hidden" animate="visible"
            transition={{ delay: 1.8, duration: 0.8 }}
            style={{ 
              color: "rgba(255,255,255,0.45)", fontSize: "15px", 
              lineHeight: "1.8", marginBottom: "44px", 
              maxWidth: "420px", fontWeight: "300" 
            }}
          >
            Access previous year question papers, get AI-generated practice papers, 
            and ace your exams at Sri Guru Teg Bahadur Khalsa College.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.6 }}
            className="cta-btns" 
            style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "60px" }}
          >
            <motion.button 
              whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}
              className="btn-primary hover-target" onClick={() => navigate("/register")}
            >
              <span>Get Started Free</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}
              className="btn-outline hover-target" onClick={() => navigate("/login")}
            >
              Sign In →
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.6 }}
            className="stats-row" 
            style={{ 
              display: "flex", gap: "48px", paddingTop: "32px", 
              borderTop: "1px solid rgba(255,255,255,0.06)" 
            }}
          >
            {heroStats.map((s, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.4 + i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.1, y: -5 }}
                style={{ cursor: "pointer" }}
              >
                <div className="stat-num">
                  <CountUp value={s.num} suffix={s.num.includes("+") ? "+" : ""} />
                </div>
                <div style={{ 
                  fontSize: "11px", color: "rgba(255,255,255,0.3)", 
                  marginTop: "6px", letterSpacing: "1px", textTransform: "uppercase" 
                }}>
                  {s.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right Visual */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
          className="hero-visual floating" 
          style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          <div style={{ position: "relative", width: "360px", height: "360px" }}>
            <div style={{ 
              position: "absolute", inset: "-20px", 
              border: "1px solid rgba(29,158,117,0.15)", borderRadius: "50%", 
              animation: "spin 20s linear infinite" 
            }} />
            <div style={{ 
              position: "absolute", inset: "-40px", 
              border: "1px dashed rgba(29,158,117,0.08)", borderRadius: "50%", 
              animation: "spin 30s linear infinite reverse" 
            }} />
            <motion.div 
              whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }}
              className="hover-glow" 
              style={{
                width: "100%", height: "100%", borderRadius: "50%", 
                overflow: "hidden", border: "1px solid rgba(29,158,117,0.3)",
                boxShadow: "0 0 80px rgba(29,158,117,0.2), inset 0 0 80px rgba(0,0,0,0.5)"
              }}
            >
              <img 
                src={IMAGES.COLLEGE_LOGO} alt="College" 
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.9)" }} 
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5, type: "spring" }}
              whileHover={{ scale: 1.15, rotate: 5 }}
              style={{
                position: "absolute", bottom: "20px", right: "-20px", 
                background: "#1D9E75", color: "white", padding: "12px 18px", 
                borderRadius: "2px", boxShadow: "0 20px 40px rgba(29,158,117,0.5)", cursor: "pointer",
              }} 
            >
              <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: "28px", fontWeight: "300", lineHeight: 1 }}>
                A++
              </div>
              <div style={{ fontSize: "10px", letterSpacing: "1px", opacity: 0.8 }}>NAAC GRADE</div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        style={{ 
          position: "absolute", bottom: "40px", left: "50%", 
          transform: "translateX(-50%)", display: "flex", 
          flexDirection: "column", alignItems: "center", gap: "8px" 
        }}
      >
        <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", letterSpacing: "2px" }}>
          SCROLL
        </div>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, rgba(29,158,117,0.5), transparent)" }} 
        />
      </motion.div>
    </section>
  );
}