import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, lazy, Suspense, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroStats } from "../../data/landingData";
import CountUp from "./CountUp";

gsap.registerPlugin(ScrollTrigger);
const Scene3D = lazy(() => import("./Scene3D"));

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.3 } },
};
const letterVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 12, stiffness: 100 } },
};

const AnimatedText = ({ text, style }) => (
  <motion.span style={style} variants={containerVariants} initial="hidden" animate="visible" aria-label={text}>
    {text.split("").map((letter, index) => (
      <motion.span key={index} variants={letterVariants} style={{ display: "inline-block" }}>
        {letter === " " ? "\u00A0" : letter}
      </motion.span>
    ))}
  </motion.span>
);

export default function Hero({ isLoaded, isMobile = false }) {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const [show3D, setShow3D] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    const timer = setTimeout(() => setShow3D(true), isMobile ? 500 : 700);
    return () => clearTimeout(timer);
  }, [isLoaded, isMobile]);

  useEffect(() => {
    if (isMobile) return;
    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        y: -60, opacity: 0.4, ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top", end: "bottom top", scrub: 1,
        },
      });
    }, heroRef);
    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section
      ref={heroRef}
      style={{
        minHeight: "100vh", paddingTop: "72px",
        display: "flex", alignItems: "center",
        position: "relative", overflow: "hidden",
        background: "radial-gradient(ellipse at center, #06121f 0%, #030810 70%)",
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "900px", height: "900px",
        background: "radial-gradient(circle, rgba(29,158,117,0.1) 0%, transparent 60%)",
        borderRadius: "50%", pointerEvents: "none", zIndex: 0,
      }} />

      {/* ✅ Crystal — RIGHT SIDE on PC, full on mobile */}
      {show3D && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            position: "absolute",
            top: 0, bottom: 0, right: 0,
            left: isMobile ? 0 : "40%", // ✅ Right 60% on PC
            zIndex: 1,
          }}
        >
          <Suspense fallback={null}>
            <Scene3D isMobile={isMobile} />
          </Suspense>
        </motion.div>
      )}

      {/* Overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: isMobile
          ? "linear-gradient(180deg, rgba(3,8,16,0.92) 0%, rgba(3,8,16,0.75) 50%, rgba(3,8,16,0.88) 100%)"
          : "linear-gradient(90deg, rgba(3,8,16,0.95) 0%, rgba(3,8,16,0.85) 38%, rgba(3,8,16,0.4) 60%, rgba(3,8,16,0.1) 100%)",
        zIndex: 2, pointerEvents: "none",
      }} />

      {/* Content */}
      <div
        ref={contentRef}
        style={{
          maxWidth: "1200px", margin: "0 auto",
          padding: isMobile ? "40px 6% 60px" : "clamp(20px, 5vw, 80px) 6%",
          width: "100%", position: "relative", zIndex: 3,
          pointerEvents: "none",
        }}
      >
        <div style={{ maxWidth: isMobile ? "100%" : "580px", pointerEvents: "auto" }}>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              marginBottom: "32px", padding: "8px 18px",
              border: "1px solid rgba(29,158,117,0.4)", borderRadius: "100px",
              background: "rgba(3,8,16,0.7)", backdropFilter: "blur(12px)",
            }}
          >
            <div style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: "#1D9E75", boxShadow: "0 0 10px #1D9E75",
              animation: "pulse 2s infinite",
            }} />
            <span style={{ color: "#4ecba0", fontSize: "11px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase" }}>
              NAAC Grade A++ Certified
            </span>
          </motion.div>

          {/* Heading */}
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: isMobile ? "clamp(40px, 9vw, 64px)" : "clamp(44px, 7vw, 88px)",
            fontWeight: "300", color: "white",
            lineHeight: "1.05", marginBottom: "32px",
            letterSpacing: "-2px", textShadow: "0 4px 30px rgba(0,0,0,0.8)",
          }}>
            <AnimatedText text="Your Academic" />
            <br />
            <AnimatedText text="Edge, " />
            <AnimatedText
              text="Powered"
              style={{
                fontStyle: "italic",
                background: "linear-gradient(135deg, #1D9E75, #4ecba0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            />
            <br />
            <AnimatedText text="by AI" />
          </h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            style={{
              color: "rgba(255,255,255,0.75)",
              fontSize: "clamp(14px, 1.4vw, 17px)",
              lineHeight: "1.7", marginBottom: "48px",
              maxWidth: "520px", fontWeight: "300",
              textShadow: "0 2px 10px rgba(0,0,0,0.6)",
            }}
          >
            Access previous year question papers, get AI-generated practice papers,
            and ace your exams at Sri Guru Teg Bahadur Khalsa College.
          </motion.p>

          {/* ✅ Buttons — auto width on PC, full on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            style={{
              display: "flex", gap: "16px", flexWrap: "wrap",
              marginBottom: "60px",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "stretch" : "flex-start",
            }}
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}
              className="btn-primary hover-target"
              onClick={() => navigate("/register")}
              style={{
                boxShadow: "0 10px 40px rgba(29,158,117,0.4)",
                width: isMobile ? "100%" : "auto",   // ✅ auto on PC
              }}
            >
              <span>Get Started Free</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}
              className="btn-outline hover-target"
              onClick={() => navigate("/login")}
              style={{
                background: "rgba(3,8,16,0.7)",
                backdropFilter: "blur(12px)",
                width: isMobile ? "100%" : "auto",   // ✅ auto on PC
              }}
            >
              Sign In →
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            style={{
              display: "flex", gap: isMobile ? "24px" : "60px",
              paddingTop: "40px", borderTop: "1px solid rgba(255,255,255,0.1)",
              flexWrap: "wrap",
            }}
          >
            {heroStats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 + i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.08, y: -3 }}
                style={{ cursor: "pointer" }}
              >
                <div className="stat-num" style={{ textShadow: "0 0 30px rgba(29,158,117,0.5)" }}>
                  <CountUp value={s.num} suffix={s.num.includes("+") ? "+" : ""} />
                </div>
                <div style={{
                  fontSize: "10px", color: "rgba(255,255,255,0.5)",
                  marginTop: "8px", letterSpacing: "2px", textTransform: "uppercase",
                }}>
                  {s.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Hint */}
      {show3D && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
          transition={{ delay: 2.5, duration: 1 }}
          style={{
            position: "absolute", bottom: "30px", right: "40px",
            fontSize: "10px", color: "rgba(78,203,160,0.7)",
            letterSpacing: "3px", textTransform: "uppercase",
            fontFamily: "'DM Sans', sans-serif",
            pointerEvents: "none", zIndex: 5, textAlign: "right",
          }}
        >
          {isMobile ? "👆 Touch crystal to glow" : "🖱️ Hover crystal to glow"}
          <div style={{ marginTop: "4px", color: "rgba(255,255,255,0.3)" }}>
            SCROLL TO DISCOVER ↓
          </div>
        </motion.div>
      )}
    </section>
  );
}