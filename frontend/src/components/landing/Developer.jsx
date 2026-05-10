import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IMAGES } from "../../data/landingData";

gsap.registerPlugin(ScrollTrigger);

export default function Developer() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 80, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="developer" ref={sectionRef} style={{ padding: "120px 6%", background: "#030810", position: "relative" }}>
      
      <div style={{ 
        position: "absolute", top: 0, left: 0, right: 0, height: "1px", 
        background: "linear-gradient(90deg, transparent, rgba(29,158,117,0.3), transparent)" 
      }} />

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div ref={titleRef} style={{ marginBottom: "60px" }}>
          <div style={{ fontSize: "11px", color: "#1D9E75", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "20px" }}>
            — Developer
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px,4vw,52px)", fontWeight: "300", color: "white" }}>
            Meet the{" "}
            <span style={{ fontStyle: "italic", color: "#1D9E75", display: "inline-block" }}>
              Developer
            </span>
          </h2>
        </div>

        <motion.div 
          ref={cardRef}
          whileHover={{ y: -5 }}
          style={{ 
            border: "1px solid rgba(255,255,255,0.06)", padding: "60px", 
            position: "relative", overflow: "hidden", cursor: "pointer",
            transition: "all 0.3s",
          }}
          className="dev-card hover-target"
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "rgba(29,158,117,0.3)"; 
            e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.5)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; 
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div style={{ 
            position: "absolute", top: 0, left: 0, width: "100%", height: "2px", 
            background: "linear-gradient(90deg, #1D9E75, transparent)",
          }} />
          
          <div style={{ 
            position: "absolute", top: "-100px", right: "-100px", 
            width: "300px", height: "300px", 
            background: "radial-gradient(circle, rgba(29,158,117,0.08) 0%, transparent 70%)", 
            borderRadius: "50%" 
          }} />

          <div className="dev-inner" style={{ display: "flex", gap: "48px", alignItems: "center", position: "relative" }}>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              style={{ flexShrink: 0 }}
            >
              <div className="hover-glow" style={{ position: "relative", width: "140px", height: "140px" }}>
                <img 
                  src={IMAGES.MY_PHOTO} alt="Happy Reehal" 
                  style={{ 
                    width: "100%", height: "100%", borderRadius: "2px", 
                    objectFit: "cover", filter: "grayscale(20%)", 
                    border: "2px solid rgba(29,158,117,0.5)" 
                  }} 
                />
                <div className="emoji" style={{ 
                  position: "absolute", bottom: "-8px", right: "-8px", 
                  width: "28px", height: "28px", background: "#1D9E75", 
                  borderRadius: "2px", display: "flex", 
                  alignItems: "center", justifyContent: "center", 
                  fontSize: "14px", boxShadow: "0 5px 15px rgba(29,158,117,0.5)" 
                }}>✓</div>
              </div>
            </motion.div>

            <div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "36px", fontWeight: "300", color: "white", marginBottom: "8px" }}>
                Happy Reehal
              </h3>
              <div style={{ color: "#1D9E75", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px" }}>
                M.Sc — AI & Data Science
              </div>
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", marginBottom: "4px" }}>
                P.G Department of Computer Science
              </div>
              <div style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px", marginBottom: "24px" }}>
                SGTB Khalsa College • 2024–2026
              </div>
              <div style={{ height: "1px", background: "#1D9E75", margin: "20px 0", width: "60px" }} />
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", lineHeight: "1.8", maxWidth: "400px", marginBottom: "28px", fontWeight: "300" }}>
                Passionate about AI and building tools that make students' lives easier. 
                Built with React, FastAPI, MongoDB and Groq LLaMA.
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <motion.a 
                  whileHover={{ scale: 1.1, y: -3 }} whileTap={{ scale: 0.95 }}
                  href="https://github.com/happyreehal" target="_blank" rel="noreferrer" 
                  className="btn-outline hover-target" 
                  style={{ textDecoration: "none", padding: "10px 20px", fontSize: "11px" }}
                >GitHub</motion.a>
                <motion.a 
                  whileHover={{ scale: 1.1, y: -3 }} whileTap={{ scale: 0.95 }}
                  href="https://www.linkedin.com/in/happy-reehal-7225a4315" target="_blank" rel="noreferrer" 
                  className="btn-primary hover-target" 
                  style={{ textDecoration: "none", padding: "10px 20px", fontSize: "11px" }}
                ><span>LinkedIn</span></motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}