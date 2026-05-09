import { motion, useAnimationControls } from "framer-motion";

const topItems = [
  { text: "AI POWERED", icon: "🤖" },
  { text: "NAAC A++", icon: "🏆" },
  { text: "10+ YEARS PAPERS", icon: "📚" },
  { text: "BUILT FOR STUDENTS", icon: "🎓" },
  { text: "SMART FILTERS", icon: "🔍" },
  { text: "MOBILE FIRST", icon: "📱" },
];

const bottomItems = [
  { text: "PRACTICE PAPERS", icon: "📝" },
  { text: "SECURE ACCESS", icon: "🔒" },
  { text: "REAL-TIME GENERATION", icon: "⚡" },
  { text: "SGTB KHALSA COLLEGE", icon: "🏛️" },
  { text: "EXAM READY", icon: "✨" },
  { text: "FREE FOREVER", icon: "💎" },
];

// ✅ Fix 2 — useAnimationControls for proper pause
function MarqueeRow({ items, direction = "left", duration = 40 }) {
  const controls = useAnimationControls();
  const duplicated = [...items, ...items, ...items];

  const handleMouseEnter = () => controls.stop();
  const handleMouseLeave = () => {
    controls.start({
      x: direction === "left" ? ["0%", "-33.33%"] : ["-33.33%", "0%"],
      transition: { duration, repeat: Infinity, ease: "linear" }
    });
  };

  return (
    <div
      style={{ overflow: "hidden", position: "relative", padding: "20px 0" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        animate={controls}
        initial={{ x: direction === "left" ? "0%" : "-33.33%" }}
        onViewportEnter={() => {
          controls.start({
            x: direction === "left" ? ["0%", "-33.33%"] : ["-33.33%", "0%"],
            transition: { duration, repeat: Infinity, ease: "linear" }
          });
        }}
        style={{ display: "flex", gap: "60px", whiteSpace: "nowrap", width: "max-content" }}
      >
        {/* ✅ Fix 1 — unique key */}
        {duplicated.map((item, i) => (
          <div
            key={`${item.text}-${i}`}
            className="marquee-item"
            style={{ display: "flex", alignItems: "center", gap: "20px", cursor: "pointer", transition: "all 0.3s ease" }}
          >
            <span style={{ fontSize: "32px", transition: "transform 0.3s" }}>
              {item.icon}
            </span>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(40px, 5vw, 72px)", fontWeight: "400",
              background: "linear-gradient(135deg, #ffffff 0%, #1D9E75 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text", letterSpacing: "1px", fontStyle: "italic",
              textShadow: "0 0 30px rgba(29,158,117,0.2)", transition: "all 0.3s",
            }}>
              {item.text}
            </span>
            <span style={{ color: "#1D9E75", fontSize: "32px", fontWeight: "200", opacity: 0.6 }}>
              ✦
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Marquee() {
  return (
    <section style={{
      background: "linear-gradient(180deg, #040b14 0%, #030810 50%, #040b14 100%)",
      padding: "80px 0", position: "relative", overflow: "hidden",
      borderTop: "1px solid rgba(29,158,117,0.1)",
      borderBottom: "1px solid rgba(29,158,117,0.1)",
    }}>
      <style>{`
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .marquee-item:hover span:nth-child(1) { transform: scale(1.3) rotate(15deg); }
        .marquee-item:hover span:nth-child(2) { letter-spacing: 3px !important; }
      `}</style>

      {/* Background Glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)", width: "100%", height: "60%",
        background: "radial-gradient(ellipse, rgba(29,158,117,0.08) 0%, transparent 70%)",
        animation: "glow-pulse 4s ease-in-out infinite", pointerEvents: "none",
      }} />

      {/* Edge Fade Left */}
      <div style={{
        position: "absolute", top: 0, left: 0, bottom: 0, width: "200px",
        background: "linear-gradient(90deg, #030810 0%, transparent 100%)",
        zIndex: 3, pointerEvents: "none",
      }} />

      {/* Edge Fade Right */}
      <div style={{
        position: "absolute", top: 0, right: 0, bottom: 0, width: "200px",
        background: "linear-gradient(-90deg, #030810 0%, transparent 100%)",
        zIndex: 3, pointerEvents: "none",
      }} />

      {/* Label */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: "center", marginBottom: "40px", position: "relative", zIndex: 4 }}
      >
        <div style={{ fontSize: "11px", color: "#1D9E75", letterSpacing: "4px", textTransform: "uppercase", marginBottom: "12px" }}>
          ✦ Why Choose AcademiQ ✦
        </div>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", fontStyle: "italic", letterSpacing: "1px" }}>
          Hover to pause
        </p>
      </motion.div>

      <MarqueeRow items={topItems} direction="left" duration={50} />

      <div style={{
        margin: "20px auto", width: "120px", height: "1px",
        background: "linear-gradient(90deg, transparent, #1D9E75, transparent)",
        position: "relative", zIndex: 4,
      }} />

      <MarqueeRow items={bottomItems} direction="right" duration={45} />
    </section>
  );
}