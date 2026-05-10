import { motion } from "framer-motion";

export default function PageTransition({ children }) {
  return (
    <>
      {/* ✅ Layer 1: Subtle Top Glow Line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: [0, 1, 0] }}
        exit={{ scaleX: 0, opacity: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.76, 0, 0.24, 1],
        }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "linear-gradient(90deg, transparent, #1D9E75, #4ecba0, #1D9E75, transparent)",
          boxShadow: "0 0 20px rgba(29,158,117,0.8), 0 0 40px rgba(29,158,117,0.4)",
          zIndex: 9999,
          pointerEvents: "none",
          transformOrigin: "center",
        }}
      />

      {/* ✅ Layer 2: Subtle Vignette Pulse */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0] }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.7,
          ease: "easeInOut",
        }}
        style={{
          position: "fixed",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)",
          zIndex: 9997,
          pointerEvents: "none",
        }}
      />

      {/* ✅ Layer 3: Center Glow Pulse (subtle) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 0.3, 0], scale: [0.5, 2, 3] }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(29,158,117,0.4) 0%, transparent 60%)",
          borderRadius: "50%",
          zIndex: 9996,
          pointerEvents: "none",
          filter: "blur(60px)",
        }}
      />

      {/* ✅ Layer 4: Page Content — Apple-style Premium Reveal */}
      <motion.div
        initial={{ 
          opacity: 0, 
          scale: 1.05,
          filter: "blur(20px) brightness(0.7) saturate(0.5)",
        }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          filter: "blur(0px) brightness(1) saturate(1)",
        }}
        exit={{ 
          opacity: 0, 
          scale: 0.96,
          filter: "blur(15px) brightness(0.6) saturate(0.5)",
        }}
        transition={{ 
          duration: 0.8, 
          ease: [0.25, 0.1, 0.25, 1], // Apple's signature easing
        }}
        style={{
          width: "100%",
          minHeight: "100vh",
          transformOrigin: "center center",
        }}
      >
        {children}
      </motion.div>

      {/* ✅ Layer 5: Bottom Glow Line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: [0, 1, 0] }}
        exit={{ scaleX: 0, opacity: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.76, 0, 0.24, 1],
          delay: 0.1,
        }}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "linear-gradient(90deg, transparent, #1D9E75, #4ecba0, #1D9E75, transparent)",
          boxShadow: "0 0 20px rgba(29,158,117,0.8), 0 0 40px rgba(29,158,117,0.4)",
          zIndex: 9999,
          pointerEvents: "none",
          transformOrigin: "center",
        }}
      />
    </>
  );
}