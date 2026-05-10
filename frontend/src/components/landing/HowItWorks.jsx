import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { steps } from "../../data/landingData";

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const stepsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title fade up
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

      // Steps stagger reveal
      const cards = stepsRef.current?.querySelectorAll(".step-card");
      if (cards) {
        gsap.fromTo(cards,
          { opacity: 0, y: 80, scale: 0.85 },
          {
            opacity: 1, y: 0, scale: 1, duration: 1, stagger: 0.2, ease: "power3.out",
            scrollTrigger: {
              trigger: stepsRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{ padding: "120px 6%", background: "#040b14", position: "relative" }}>
      
      <div style={{ 
        position: "absolute", top: 0, left: 0, right: 0, height: "1px", 
        background: "linear-gradient(90deg, transparent, rgba(29,158,117,0.3), transparent)" 
      }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
        <div ref={titleRef} style={{ textAlign: "center", marginBottom: "80px" }}>
          <div style={{ fontSize: "11px", color: "#1D9E75", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "20px" }}>
            — How It Works
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px,4vw,52px)", fontWeight: "300", color: "white" }}>
            Three Simple{" "}
            <span style={{ fontStyle: "italic", color: "#1D9E75", display: "inline-block" }}>
              Steps
            </span>
          </h2>
        </div>

        <div 
          ref={stepsRef}
          className="steps-grid" 
          style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "2px", background: "rgba(255,255,255,0.04)" }}
        >
          {steps.map((s) => (
            <div 
              key={s.step}
              className="step-card hover-target" 
              style={{ 
                background: "#040b14", padding: "48px 36px", 
                position: "relative", overflow: "hidden", 
                borderTop: "2px solid transparent", cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderTopColor = "#1D9E75"; 
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.4)";
                e.currentTarget.style.transform = "translateY(-10px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderTopColor = "transparent"; 
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div className="step-num">{s.step}</div>
              
              <motion.div 
                whileHover={{ scale: 1.4, rotate: 15 }}
                style={{ fontSize: "32px", marginBottom: "20px", display: "inline-block" }}
              >
                {s.icon}
              </motion.div>
              
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: "400", color: "white", marginBottom: "14px" }}>
                {s.title}
              </h3>
              
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", lineHeight: "1.8", fontWeight: "300" }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}