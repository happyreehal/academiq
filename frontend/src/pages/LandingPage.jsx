import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});
  const canvasRef = useRef(null);

  const COLLEGE_LOGO = "https://res.cloudinary.com/dshlu0r4n/image/upload/v1777613826/Screenshot_2026-05-01_105739_ffc3be.png";
  const MY_PHOTO = "https://res.cloudinary.com/dshlu0r4n/image/upload/v1777604161/1_qpjnrg.jpg";

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
 
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.1,
    }));
    
    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(29,158,117,${p.opacity})`;
        ctx.fill();
      });
      // Connect nearby particles
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(29,158,117,${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  // Scroll + mouse tracking
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    const onMouse = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("scroll", onScroll);
    window.addEventListener("mousemove", onMouse);
    setTimeout(() => setIsLoaded(true), 100);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("mousemove", onMouse); };
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) setVisibleSections(prev => ({ ...prev, [e.target.id]: true }));
      });
    }, { threshold: 0.15 });
    document.querySelectorAll("[data-animate]").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const isVisible = (id) => visibleSections[id];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#030810", overflowX: "hidden", cursor: "none" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; cursor: none !important; }

        /* Custom Cursor with Glow */
        .cursor-dot {
          width: 8px; height: 8px; background: #1D9E75;
          border-radius: 50%; position: fixed; 
          pointer-events: none;
          z-index: 9999; transition: transform 0.1s ease;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 10px #1D9E75, 0 0 20px #1D9E75;
        }
        .cursor-ring {
          width: 36px; height: 36px;
          border: 1px solid rgba(29,158,117,0.6);
          border-radius: 50%; position: fixed; pointer-events: none;
          z-index: 9998; transition: all 0.15s ease;
          transform: translate(-50%, -50%);
          box-shadow: inset 0 0 10px rgba(29,158,117,0.2);
        }

        /* Elements Hover effect for Cursor */
        a:hover ~ .cursor-ring, button:hover ~ .cursor-ring, .hover-target:hover ~ .cursor-ring {
          width: 50px; height: 50px; background: rgba(29,158,117,0.1); border-color: #1D9E75;
        }

        /* Scroll animations */
        .fade-up { opacity: 0; transform: translateY(60px); transition: all 1s cubic-bezier(0.16,1,0.3,1); }
        .fade-up.visible { opacity: 1; transform: translateY(0); }
        .fade-left { opacity: 0; transform: translateX(-60px); transition: all 1s cubic-bezier(0.16,1,0.3,1); }
        .fade-left.visible { opacity: 1; transform: translateX(0); }
        .fade-right { opacity: 0; transform: translateX(60px); transition: all 1s cubic-bezier(0.16,1,0.3,1); }
        .fade-right.visible { opacity: 1; transform: translateX(0); }

        /* Glassmorphism */
        .glass {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.06);
        }

        /* Buttons with Neon Glow */
        .btn-primary {
          background: linear-gradient(135deg, #1D9E75, #0d7a5a);
          color: white; border: none; padding: 16px 36px;
          border-radius: 4px; font-size: 14px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 2px; text-transform: uppercase;
          transition: all 0.4s ease; position: relative; overflow: hidden;
        }
        .btn-primary::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, #4ecba0, #1D9E75);
          opacity: 0; transition: opacity 0.4s;
        }
        .btn-primary:hover::before { opacity: 1; }
        .btn-primary:hover { 
          transform: translateY(-3px); 
          box-shadow: 0 10px 25px rgba(29,158,117,0.5), 0 0 15px rgba(29,158,117,0.3) inset;
        }
        .btn-primary span { position: relative; z-index: 1; }

        .btn-outline {
          background: transparent; color: rgba(255,255,255,0.8);
          border: 1px solid rgba(255,255,255,0.2); padding: 16px 36px;
          border-radius: 4px; font-size: 14px; font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 2px; text-transform: uppercase;
          transition: all 0.4s ease;
        }
        .btn-outline:hover { 
          border-color: #1D9E75; color: #1D9E75; transform: translateY(-3px); 
          box-shadow: 0 10px 25px rgba(29,158,117,0.2); background: rgba(29,158,117,0.05);
        }

        /* Feature cards */
        .feat-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 2px; padding: 36px 28px;
          transition: all 0.4s ease; position: relative; overflow: hidden;
        }
        .feat-card::before {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0;
          height: 2px; background: linear-gradient(90deg, #1D9E75, transparent);
          transform: scaleX(0); transform-origin: left; transition: transform 0.4s ease;
        }
        .feat-card:hover { 
          background: rgba(29,158,117,0.04); border-color: rgba(29,158,117,0.2); 
          transform: translateY(-8px); box-shadow: 0 15px 30px rgba(0,0,0,0.3);
        }
        .feat-card:hover::before { transform: scaleX(1); }

        /* Interactive Emoji Bounce */
        .emoji { display: inline-block; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .feat-card:hover .emoji, .emoji:hover { transform: scale(1.4) rotate(15deg); text-shadow: 0 0 15px rgba(255,255,255,0.4); }

        /* Logo Glow Hover */
        .hover-glow { transition: all 0.4s ease; }
        .hover-glow:hover { transform: scale(1.08); filter: drop-shadow(0 0 15px rgba(29,158,117,0.6)); }

        /* Floating Animation */
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .floating { animation: float 6s ease-in-out infinite; }

        /* Nav */
        .nav-link {
          color: rgba(255,255,255,0.5); text-decoration: none;
          font-size: 12px; font-weight: 500; letter-spacing: 2px;
          text-transform: uppercase; transition: color 0.3s, transform 0.3s;
          background: none; border: none;
        }
        .nav-link:hover { color: #1D9E75; transform: translateY(-2px); }

        /* Number counter */
        .stat-num { font-family: 'Cormorant Garamond', serif; font-size: 56px; font-weight: 300; color: #1D9E75; line-height: 1; transition: transform 0.4s; }
        div:hover > .stat-num { transform: scale(1.1); }

        /* Divider line */
        .divider { width: 60px; height: 1px; background: #1D9E75; margin: 20px 0; transition: width 0.4s; }
        div:hover > .divider { width: 100px; box-shadow: 0 0 10px #1D9E75; }

        /* Step number */
        .step-num {
          font-family: 'Cormorant Garamond', serif; font-size: 80px; font-weight: 300;
          color: rgba(29,158,117,0.1); line-height: 1;
          position: absolute; top: -10px; right: 20px; transition: color 0.4s, transform 0.4s;
        }
        .step-card:hover .step-num { color: rgba(29,158,117,0.2); transform: scale(1.1) translateX(-10px); }

        /* Mobile */
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-visual { display: none !important; }
          .about-grid { grid-template-columns: 1fr !important; }
          .about-visual { display: none !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .nav-links { display: none !important; }
          .stats-row { gap: 24px !important; }
          .cta-btns { flex-direction: column !important; align-items: flex-start !important; }
          .dev-card { padding: 32px 20px !important; }
          .dev-inner { flex-direction: column !important; text-align: center !important; }
          .feat-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Custom Cursor */}
      <div className="cursor-dot" style={{ left: mousePos.x, top: mousePos.y }} />
      <div className="cursor-ring" style={{ left: mousePos.x, top: mousePos.y }} />

      {/* Particle Canvas */}
      <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, zIndex: 0, pointerEvents: "none" }} />

      {/* NAVBAR */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        padding: "0 6%", height: "72px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrollY > 50 ? "rgba(3,8,16,0.95)" : "transparent",
        backdropFilter: scrollY > 50 ? "blur(20px)" : "none",
        borderBottom: scrollY > 50 ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all 0.4s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <img src={COLLEGE_LOGO} alt="logo" className="hover-glow" style={{ width: "38px", height: "38px", borderRadius: "4px", objectFit: "cover" }} />
          <div>
            <div style={{ color: "white", fontWeight: "600", fontSize: "15px", letterSpacing: "1px" }}>ACADEMIQ</div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px", letterSpacing: "1px" }}>SGTB KHALSA COLLEGE</div>
          </div>
        </div>

        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          <button className="nav-link hover-target" onClick={() => document.getElementById("features").scrollIntoView({ behavior: "smooth" })}>Features</button>
          <button className="nav-link hover-target" onClick={() => document.getElementById("about").scrollIntoView({ behavior: "smooth" })}>About</button>
          <button className="nav-link hover-target" onClick={() => document.getElementById("developer").scrollIntoView({ behavior: "smooth" })}>Developer</button>
        </div>

        <button className="btn-primary hover-target" onClick={() => navigate("/login")} style={{ padding: "10px 24px", fontSize: "11px" }}>
          <span>Login →</span>
        </button>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: "100vh", paddingTop: "72px",
        display: "flex", alignItems: "center",
        position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg, #030810 0%, #06121f 50%, #030810 100%)",
      }}>
        {/* Gradient orbs */}
        <div style={{ position: "absolute", top: "20%", right: "10%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(29,158,117,0.06) 0%, transparent 70%)", borderRadius: "50%", transform: `translate(${(mousePos.x - window.innerWidth / 2) * 0.02}px, ${(mousePos.y - window.innerHeight / 2) * 0.02}px)`, transition: "transform 0.3s ease" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "5%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(45,95,160,0.06) 0%, transparent 70%)", borderRadius: "50%" }} />

        {/* Horizontal line decoration */}
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(29,158,117,0.1), transparent)" }} />

        <div className="hero-grid" style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 6%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center", width: "100%", position: "relative", zIndex: 1 }}>
          <div style={{ opacity: isLoaded ? 1 : 0, transform: isLoaded ? "translateY(0)" : "translateY(40px)", transition: "all 1s cubic-bezier(0.16,1,0.3,1)" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "28px", padding: "6px 16px", border: "1px solid rgba(29,158,117,0.3)", borderRadius: "2px", background:"rgba(29,158,117,0.05)" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#1D9E75", animation: "pulse 2s infinite" }} />
              <span style={{ color: "#1D9E75", fontSize: "11px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase" }}>NAAC Grade A++ Certified</span>
            </div>

            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(42px, 5.5vw, 72px)", fontWeight: "300",
              color: "white", lineHeight: "1.1", marginBottom: "28px",
              letterSpacing: "-1px"
            }}>
              Your Academic<br />
              Edge,{" "}
              <span style={{ fontStyle: "italic", color: "#1D9E75", textShadow: "0 0 20px rgba(29,158,117,0.3)" }}>Powered</span><br />
              by AI
            </h1>

            <div className="divider" />

            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "15px", lineHeight: "1.8", marginBottom: "44px", maxWidth: "420px", fontWeight: "300" }}>
              Access previous year question papers, get AI-generated practice papers, and ace your exams at Sri Guru Teg Bahadur Khalsa College.
            </p>

            <div className="cta-btns" style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "60px" }}>
              <button className="btn-primary hover-target" onClick={() => navigate("/register")}><span>Get Started Free</span></button>
              <button className="btn-outline hover-target" onClick={() => navigate("/login")}>Sign In →</button>
            </div>

            <div className="stats-row" style={{ display: "flex", gap: "48px", paddingTop: "32px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              {[{ num: "10+", label: "Years of Papers" }, { num: "AI", label: "Question Generator" }, { num: "24/7", label: "Access Anywhere" }].map((s, i) => (
                <div key={i} style={{ transition: "all 0.3s" }}>
                  <div className="stat-num">{s.num}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "6px", letterSpacing: "1px", textTransform: "uppercase" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual */}
          <div className="hero-visual floating" style={{ display: "flex", justifyContent: "center", alignItems: "center", opacity: isLoaded ? 1 : 0, transition: "opacity 1.2s ease 0.3s" }}>
            <div style={{ position: "relative", width: "360px", height: "360px" }}>
              {/* Rotating ring */}
              <div style={{ position: "absolute", inset: "-20px", border: "1px solid rgba(29,158,117,0.15)", borderRadius: "50%", animation: "spin 20s linear infinite" }} />
              <div style={{ position: "absolute", inset: "-40px", border: "1px dashed rgba(29,158,117,0.08)", borderRadius: "50%", animation: "spin 30s linear infinite reverse" }} />
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } @keyframes pulse { 0%,100% { opacity:1; box-shadow: 0 0 10px #1D9E75;} 50% { opacity:0.4; box-shadow: none;} }`}</style>

              {/* Center image */}
              <div className="hover-glow" style={{
                width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", border: "1px solid rgba(29,158,117,0.3)",
                boxShadow: "0 0 80px rgba(29,158,117,0.2), inset 0 0 80px rgba(0,0,0,0.5)"
              }}>
                <img src={COLLEGE_LOGO} alt="College" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.9)" }} />
              </div>

              {/* Floating badge */}
              <div style={{
                position: "absolute", bottom: "20px", right: "-20px", background: "#1D9E75", color: "white", padding: "12px 18px", borderRadius: "2px",
                boxShadow: "0 20px 40px rgba(29,158,117,0.5)", transition: "transform 0.3s"
              }} onMouseOver={e => e.currentTarget.style.transform = "scale(1.1)"} onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}>
                <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: "28px", fontWeight: "300", lineHeight: 1 }}>A++</div>
                <div style={{ fontSize: "10px", letterSpacing: "1px", opacity: 0.8 }}>NAAC GRADE</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", letterSpacing: "2px" }}>SCROLL</div>
          <div style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, rgba(29,158,117,0.5), transparent)", animation: "fadeIn 2s infinite" }} />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: "120px 6%", background: "#040b14", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(29,158,117,0.3), transparent)" }} />
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div id="feat-title" data-animate style={{ marginBottom: "80px" }} className={`fade-up ${isVisible("feat-title") ? "visible" : ""}`}>
            <div style={{ fontSize: "11px", color: "#1D9E75", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "20px" }}>— Features</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px,4vw,52px)", fontWeight: "300", color: "white", maxWidth: "500px", lineHeight: "1.2" }}>
              Everything You Need<br /><span style={{ fontStyle: "italic", color: "#1D9E75" }}>to Excel</span>
            </h2>
          </div>

          <div className="feat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1px", background: "rgba(255,255,255,0.04)" }}>
            {[
              { icon: "📚", title: "Question Repository", desc: "10 years of past papers filtered by department, course, semester and subject.", num: "01" },
              { icon: "🤖", title: "AI Paper Generator", desc: "Upload syllabus and get practice papers based on exam patterns.", num: "02" },
              { icon: "🔍", title: "Smart Filters", desc: "Find exactly what you need — results in seconds.", num: "03" },
              { icon: "📱", title: "Mobile First", desc: "Seamless experience on any device, anywhere.", num: "04" },
              { icon: "🔒", title: "Secure Access", desc: "JWT auth with separate admin and student portals.", num: "05" },
              { icon: "⭐", title: "AI Feedback", desc: "Rate papers to continuously improve AI quality.", num: "06" },
            ].map((f, i) => (
              <div key={i} className="feat-card hover-target" style={{ background: "#040b14", animationDelay: `${i * 0.1}s` }}>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", letterSpacing: "2px", marginBottom: "20px" }}>{f.num}</div>
                <div style={{ fontSize: "28px", marginBottom: "16px" }}><span className="emoji">{f.icon}</span></div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: "400", color: "white", marginBottom: "12px" }}>{f.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", lineHeight: "1.8", fontWeight: "300" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: "120px 6%", background: "#030810", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(29,158,117,0.3), transparent)" }} />
        <div className="about-grid" style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "100px", alignItems: "center" }}>
          <div id="about-text" data-animate className={`fade-left ${isVisible("about-text") ? "visible" : ""}`}>
            <div style={{ fontSize: "11px", color: "#1D9E75", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "20px" }}>— About</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: "300", color: "white", marginBottom: "24px", lineHeight: "1.2" }}>
              Sri Guru Teg Bahadur<br /><span style={{ fontStyle: "italic", color: "#1D9E75" }}>Khalsa College</span>
            </h2>
            <div className="divider" />
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", lineHeight: "1.9", marginBottom: "16px", fontWeight: "300" }}>
              A premier institution of higher education in Punjab, India. Established with a vision to provide quality education, accredited with NAAC Grade A++.
            </p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", lineHeight: "1.9", marginBottom: "40px", fontWeight: "300" }}>
              AcademiQ was built to digitize academic resources and empower students with AI-driven learning tools.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "40px" }}>
              {[{ icon: "🏆", label: "NAAC Grade A++" }, { icon: "🎓", label: "Autonomous Body" }, { icon: "📍", label: "Sri Anandpur Sahib" }, { icon: "🌐", label: "sgtbcollege.org.in" }].map((item, i) => (
                <div key={i} className="hover-target" style={{ padding: "14px 16px", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "2px", display: "flex", alignItems: "center", gap: "10px", transition: "all 0.3s" }} onMouseOver={e => {e.currentTarget.style.borderColor="#1D9E75"; e.currentTarget.style.background="rgba(29,158,117,0.05)"}} onMouseOut={e => {e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"; e.currentTarget.style.background="transparent"}}>
                  <span className="emoji" style={{ fontSize: "16px" }}>{item.icon}</span>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.5px" }}>{item.label}</span>
                </div>
              ))}
            </div>
            <a href="https://www.sgtbcollege.org.in/" target="_blank" rel="noreferrer" className="btn-outline hover-target" style={{ display: "inline-block", textDecoration: "none", padding: "12px 28px", fontSize: "11px" }}>
              Visit Website →
            </a>
          </div>

          <div id="about-visual" data-animate className={`about-visual fade-right floating ${isVisible("about-visual") ? "visible" : ""}`} style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", width: "320px", height: "400px" }}>
              <div className="hover-glow" style={{ width: "100%", height: "100%", border: "1px solid rgba(29,158,117,0.4)", borderRadius: "2px", overflow: "hidden", background: "linear-gradient(135deg, #0d2035, #1D9E75)", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
                <img src={COLLEGE_LOGO} alt="College" style={{ width: "100%", height: "100%", objectFit: "contain", padding: "40px" }} />
              </div>
              <div style={{ position: "absolute", top: "-16px", left: "-16px", width: "80px", height: "80px", border: "1px solid rgba(29,158,117,0.5)", borderRadius: "2px" }} />
              <div style={{ position: "absolute", bottom: "-16px", right: "-16px", width: "120px", height: "60px", background: "#1D9E75", borderRadius: "2px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 20px rgba(29,158,117,0.4)" }}>
                <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: "32px", color: "white", fontWeight: "300" }}>A++</div>
                <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.7)", letterSpacing: "1px" }}>NAAC GRADE</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "120px 6%", background: "#040b14", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(29,158,117,0.3), transparent)" }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div id="steps-title" data-animate style={{ textAlign: "center", marginBottom: "80px" }} className={`fade-up ${isVisible("steps-title") ? "visible" : ""}`}>
            <div style={{ fontSize: "11px", color: "#1D9E75", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "20px" }}>— How It Works</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px,4vw,52px)", fontWeight: "300", color: "white" }}>
              Three Simple <span style={{ fontStyle: "italic", color: "#1D9E75" }}>Steps</span>
            </h2>
          </div>
          <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "2px", background: "rgba(255,255,255,0.04)" }}>
            {[
              { step: "01", title: "Register", desc: "Create your student account and wait for admin approval.", icon: "📝" },
              { step: "02", title: "Browse Papers", desc: "Filter by department, course, semester and find your papers.", icon: "🔍" },
              { step: "03", title: "Generate with AI", desc: "Upload syllabus and get AI-powered practice questions.", icon: "🤖" },
            ].map((s, i) => (
              <div key={i} className="step-card hover-target" style={{ background: "#040b14", padding: "48px 36px", position: "relative", overflow: "hidden", borderTop: "2px solid transparent", transition: "all 0.4s" }}
                onMouseEnter={e => {e.currentTarget.style.borderTopColor = "#1D9E75"; e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.4)";}}
                onMouseLeave={e => {e.currentTarget.style.borderTopColor = "transparent"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none";}}>
                <div className="step-num">{s.step}</div>
                <div style={{ fontSize: "32px", marginBottom: "20px" }}><span className="emoji">{s.icon}</span></div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: "400", color: "white", marginBottom: "14px" }}>{s.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", lineHeight: "1.8", fontWeight: "300" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEVELOPER */}
      <section id="developer" style={{ padding: "120px 6%", background: "#030810", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(29,158,117,0.3), transparent)" }} />
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div id="dev-title" data-animate style={{ marginBottom: "60px" }} className={`fade-up ${isVisible("dev-title") ? "visible" : ""}`}>
            <div style={{ fontSize: "11px", color: "#1D9E75", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "20px" }}>— Developer</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px,4vw,52px)", fontWeight: "300", color: "white" }}>
              Meet the <span style={{ fontStyle: "italic", color: "#1D9E75" }}>Developer</span>
            </h2>
          </div>

          <div id="dev-card" data-animate style={{ border: "1px solid rgba(255,255,255,0.06)", padding: "60px", position: "relative", overflow: "hidden", transition: "all 0.4s" }}
            className={`dev-card fade-up hover-target ${isVisible("dev-card") ? "visible" : ""}`}
            onMouseEnter={e => {e.currentTarget.style.borderColor = "rgba(29,158,117,0.3)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";}}
            onMouseLeave={e => {e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.boxShadow = "none";}}>
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "2px", background: "linear-gradient(90deg, #1D9E75, transparent)" }} />
            <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(29,158,117,0.08) 0%, transparent 70%)", borderRadius: "50%" }} />

            <div className="dev-inner" style={{ display: "flex", gap: "48px", alignItems: "center", position: "relative" }}>
              <div style={{ flexShrink: 0 }}>
                <div className="hover-glow" style={{ position: "relative", width: "140px", height: "140px" }}>
                  <img src={MY_PHOTO} alt="Happy Reehal" style={{ width: "100%", height: "100%", borderRadius: "2px", objectFit: "cover", filter: "grayscale(20%)", border: "2px solid rgba(29,158,117,0.5)" }} />
                  <div className="emoji" style={{ position: "absolute", bottom: "-8px", right: "-8px", width: "28px", height: "28px", background: "#1D9E75", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", boxShadow: "0 5px 15px rgba(29,158,117,0.5)" }}>✓</div>
                </div>
              </div>
              <div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "36px", fontWeight: "300", color: "white", marginBottom: "8px" }}>Happy Reehal</h3>
                <div style={{ color: "#1D9E75", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px" }}>M.Sc — AI & Data Science</div>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", marginBottom: "4px" }}>P.G Department of Computer Science</div>
                <div style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px", marginBottom: "24px" }}>SGTB Khalsa College • 2024–2026</div>
                <div className="divider" />
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", lineHeight: "1.8", maxWidth: "400px", marginBottom: "28px", fontWeight: "300" }}>
                  Passionate about AI and building tools that make students' lives easier. Built with React, FastAPI, MongoDB and Groq LLaMA.
                </p>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <a href="https://github.com/happyreehal" target="_blank" rel="noreferrer" className="btn-outline hover-target" style={{ textDecoration: "none", padding: "10px 20px", fontSize: "11px" }}>GitHub</a>
                  <a href="https://www.linkedin.com/in/happy-reehal-7225a4315" target="_blank" rel="noreferrer" className="btn-primary hover-target" style={{ textDecoration: "none", padding: "10px 20px", fontSize: "11px" }}>
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "120px 6%", background: "#040b14", position: "relative", textAlign: "center" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(29,158,117,0.3), transparent)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(29,158,117,0.06) 0%, transparent 70%)" }} />
        <div style={{ maxWidth: "600px", margin: "0 auto", position: "relative" }}>
          <div style={{ fontSize: "11px", color: "#1D9E75", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "24px" }}>— Get Started</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px,5vw,64px)", fontWeight: "300", color: "white", marginBottom: "24px", lineHeight: "1.1" }}>
            Ready to Ace<br /><span style={{ fontStyle: "italic", color: "#1D9E75", textShadow: "0 0 15px rgba(29,158,117,0.3)" }}>Your Exams?</span>
          </h2>
          <div className="divider" style={{ margin: "0 auto 32px" }} />
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px", marginBottom: "48px", lineHeight: "1.8", fontWeight: "300" }}>
            Join AcademiQ and access years of question papers with AI-powered practice tests.
          </p>
          <div className="cta-btns" style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary hover-target" onClick={() => navigate("/register")}><span>Register Now — It's Free</span></button>
            <button className="btn-outline hover-target" onClick={() => navigate("/login")}>Sign In →</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#020609", padding: "40px 6%", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
          <div className="hover-glow hover-target" style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "none" }}>
            <img src={COLLEGE_LOGO} alt="logo" style={{ width: "30px", height: "30px", borderRadius: "3px", objectFit: "cover" }} />
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", letterSpacing: "2px" }}>ACADEMIQ</span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px", textAlign: "center" }}>
            SGTB Khalsa College, Sri Anandpur Sahib • NAAC A++
          </p>
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px" }}>
            Developed by Happy Reehal © 2026
          </p>
        </div>
      </footer>
    </div>
  );
}