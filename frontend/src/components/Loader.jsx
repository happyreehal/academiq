import { motion } from "framer-motion";

export default function Loader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 0.6, ease: "easeInOut" }
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "#030810",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
      }}
    >
      {/* Animated Logo */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          duration: 0.8, 
          type: "spring", 
          damping: 12 
        }}
        style={{
          width: "80px",
          height: "80px",
          background: "linear-gradient(135deg, #1D9E75, #0d7a5a)",
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "32px",
          boxShadow: "0 20px 60px rgba(29,158,117,0.4)",
        }}
      >
        <span style={{ 
          fontSize: "40px", 
          fontWeight: "900", 
          color: "white",
          fontFamily: "'DM Sans', sans-serif"
        }}>
          Q
        </span>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "32px",
          fontWeight: "300",
          color: "white",
          letterSpacing: "4px",
          marginBottom: "8px",
        }}
      >
        ACADEMIQ
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        style={{
          color: "rgba(255,255,255,0.4)",
          fontSize: "11px",
          letterSpacing: "3px",
          textTransform: "uppercase",
          marginBottom: "40px",
        }}
      >
        Loading Experience
      </motion.p>

      {/* Loading Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{
          width: "200px",
          height: "2px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          style={{
            width: "50%",
            height: "100%",
            background: "linear-gradient(90deg, transparent, #1D9E75, transparent)",
          }}
        />
      </motion.div>

      {/* Bottom Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        style={{
          position: "absolute",
          bottom: "40px",
          color: "rgba(255,255,255,0.2)",
          fontSize: "10px",
          letterSpacing: "2px",
          textTransform: "uppercase",
        }}
      >
        SGTB Khalsa College
      </motion.div>
    </motion.div>
  );
}