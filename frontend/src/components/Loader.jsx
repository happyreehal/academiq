import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Loader() {
  const [progress, setProgress] = useState(0);

  // ✅ Counter 0 → 100
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 8 + 2; // random increment for realistic feel
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
      }
      setProgress(Math.floor(current));
    }, 60);

    return () => clearInterval(interval);
  }, []);

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
        transition={{ duration: 0.8, type: "spring", damping: 12 }}
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

      {/* Title with Letter Reveal */}
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

      {/* ✅ Progress Bar with Counter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{
          width: "240px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {/* Counter */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <span style={{
            color: "#1D9E75",
            fontSize: "11px",
            letterSpacing: "2px",
            fontWeight: "600",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            LOADING
          </span>
          <span style={{
            color: "white",
            fontSize: "13px",
            fontWeight: "700",
            fontFamily: "'DM Sans', sans-serif",
            fontVariantNumeric: "tabular-nums",
            minWidth: "40px",
            textAlign: "right",
          }}>
            {progress}%
          </span>
        </div>

        {/* Progress Track */}
        <div style={{
          width: "100%",
          height: "2px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: "2px",
          overflow: "hidden",
          position: "relative",
        }}>
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #1D9E75, #4ecba0)",
              boxShadow: "0 0 10px rgba(29,158,117,0.6)",
            }}
          />
        </div>
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