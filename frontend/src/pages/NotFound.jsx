import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #030810 0%, #0d2035 50%, #030810 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
      padding: "20px",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background Glow */}
      <div style={{
        position: "absolute",
        top: "30%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "600px",
        height: "600px",
        background: "radial-gradient(circle, rgba(29,158,117,0.08) 0%, transparent 70%)",
        borderRadius: "50%",
        pointerEvents: "none",
      }} />

      {/* Animated 404 */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", damping: 12 }}
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(120px, 20vw, 200px)",
          fontWeight: "300",
          color: "white",
          letterSpacing: "-5px",
          lineHeight: 1,
          marginBottom: "16px",
          background: "linear-gradient(135deg, #1D9E75, #4ecba0)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          position: "relative",
          zIndex: 1,
        }}
      >
        404
      </motion.h1>

      {/* Divider */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 80 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        style={{
          height: "1px",
          background: "#1D9E75",
          margin: "24px 0",
          boxShadow: "0 0 10px #1D9E75",
        }}
      />

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(28px, 4vw, 42px)",
          fontWeight: "300",
          color: "white",
          marginBottom: "16px",
          letterSpacing: "-1px",
          position: "relative",
          zIndex: 1,
        }}
      >
        Page <span style={{ fontStyle: "italic", color: "#1D9E75" }}>Not Found</span>
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        style={{
          color: "rgba(255,255,255,0.4)",
          fontSize: "15px",
          maxWidth: "500px",
          lineHeight: "1.7",
          marginBottom: "48px",
          fontWeight: "300",
          position: "relative",
          zIndex: 1,
        }}
      >
        The page you're looking for doesn't exist or has been moved. 
        Let's get you back on track.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        style={{ 
          display: "flex", 
          gap: "16px", 
          flexWrap: "wrap", 
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <motion.button
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.history.length > 1 ? navigate(-1) : navigate("/")}
          style={{
            background: "transparent",
            color: "rgba(255,255,255,0.8)",
            border: "1px solid rgba(255,255,255,0.2)",
            padding: "14px 28px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "1px",
            textTransform: "uppercase",
            transition: "all 0.3s",
          }}
          onMouseOver={e => {
            e.target.style.borderColor = "#1D9E75";
            e.target.style.color = "#1D9E75";
          }}
          onMouseOut={e => {
            e.target.style.borderColor = "rgba(255,255,255,0.2)";
            e.target.style.color = "rgba(255,255,255,0.8)";
          }}
        >
          ← Go Back
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          style={{
            background: "linear-gradient(135deg, #1D9E75, #0d7a5a)",
            color: "white",
            border: "none",
            padding: "14px 28px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "1px",
            textTransform: "uppercase",
            transition: "all 0.3s",
          }}
          onMouseOver={e => {
            e.target.style.boxShadow = "0 10px 25px rgba(29,158,117,0.4)";
          }}
          onMouseOut={e => {
            e.target.style.boxShadow = "none";
          }}
        >
          🏠 Home Page
        </motion.button>
      </motion.div>

      {/* Floating Decoration */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        style={{
          position: "absolute",
          top: "15%",
          left: "10%",
          fontSize: "60px",
          opacity: 0.1,
          pointerEvents: "none",
        }}
      >
        📚
      </motion.div>

      <motion.div
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        style={{
          position: "absolute",
          bottom: "15%",
          right: "10%",
          fontSize: "60px",
          opacity: 0.1,
          pointerEvents: "none",
        }}
      >
        🎓
      </motion.div>

      {/* Footer Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        style={{
          position: "absolute",
          bottom: "40px",
          color: "rgba(255,255,255,0.2)",
          fontSize: "11px",
          letterSpacing: "2px",
          textTransform: "uppercase",
        }}
      >
        AcademiQ • SGTB Khalsa College
      </motion.p>
    </div>
  );
}