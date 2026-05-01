import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  const COLLEGE_LOGO = "https://res.cloudinary.com/dshlu0r4n/image/upload/v1777613826/Screenshot_2026-05-01_105739_ffc3be.png";
  const MY_PHOTO = "https://res.cloudinary.com/dshlu0r4n/image/upload/v1777604161/1_qpjnrg.jpg";

  return (
    <div style={{fontFamily:"'DM Sans', sans-serif", background:"#fff", overflowX:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
        @keyframes shimmer { 0% { background-position:−200% center; } 100% { background-position:200% center; } }
        .hero-btn-primary {
          background:linear-gradient(135deg,#1D9E75,#16875f);
          color:white; border:none; padding:16px 36px; border-radius:50px;
          font-size:16px; font-weight:600; cursor:pointer;
          font-family:'DM Sans',sans-serif; transition:all 0.3s ease;
          box-shadow:0 8px 25px rgba(29,158,117,0.4);
        }
        .hero-btn-primary:hover { transform:translateY(-3px); box-shadow:0 12px 35px rgba(29,158,117,0.5); }
        .hero-btn-secondary {
          background:transparent; color:white;
          border:2px solid rgba(255,255,255,0.5); padding:16px 36px;
          border-radius:50px; font-size:16px; font-weight:600;
          cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.3s ease;
        }
        .hero-btn-secondary:hover { background:rgba(255,255,255,0.1); border-color:white; transform:translateY(-3px); }
        .feature-card {
          background:white; border-radius:20px; padding:32px 28px;
          box-shadow:0 4px 30px rgba(15,42,74,0.08);
          border:1px solid rgba(15,42,74,0.06);
          transition:all 0.3s ease; text-align:center;
        }
        .feature-card:hover { transform:translateY(-8px); box-shadow:0 20px 50px rgba(15,42,74,0.15); }
        .nav-link {
          color:rgba(255,255,255,0.8); text-decoration:none;
          font-size:14px; font-weight:500; transition:color 0.2s;
          cursor:pointer; background:none; border:none;
        }
        .nav-link:hover { color:white; }
        .stat-item { text-align:center; }
        .section-tag {
          display:inline-block; background:rgba(29,158,117,0.1);
          color:#1D9E75; padding:6px 16px; border-radius:50px;
          font-size:13px; font-weight:600; margin-bottom:16px;
          border:1px solid rgba(29,158,117,0.2);
        }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:1000,
        background:"rgba(15,42,74,0.95)", backdropFilter:"blur(20px)",
        padding:"0 5%", height:"70px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        borderBottom:"1px solid rgba(255,255,255,0.1)"
      }}>
        <div style={{display:"flex", alignItems:"center", gap:"12px"}}>
          <img src={COLLEGE_LOGO} alt="logo" style={{width:"42px", height:"42px", borderRadius:"8px", objectFit:"cover"}} />
          <div>
            <div style={{color:"white", fontWeight:"700", fontSize:"16px", lineHeight:"1.2"}}>AcademiQ</div>
            <div style={{color:"rgba(255,255,255,0.5)", fontSize:"11px"}}>SGTB Khalsa College</div>
          </div>
        </div>
        <div style={{display:"flex", alignItems:"center", gap:"32px"}}>
          <button className="nav-link" onClick={() => document.getElementById("features").scrollIntoView({behavior:"smooth"})}>Features</button>
          <button className="nav-link" onClick={() => document.getElementById("about").scrollIntoView({behavior:"smooth"})}>About</button>
          <button className="nav-link" onClick={() => document.getElementById("developer").scrollIntoView({behavior:"smooth"})}>Developer</button>
          <button onClick={() => navigate("/login")} style={{
            background:"#1D9E75", color:"white", border:"none",
            padding:"10px 24px", borderRadius:"50px", fontSize:"14px",
            fontWeight:"600", cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
            transition:"all 0.3s ease"
          }}>Login →</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section style={{
        minHeight:"100vh", paddingTop:"70px",
        background:"linear-gradient(135deg, #0F2A4A 0%, #1a3d6b 40%, #0F2A4A 100%)",
        display:"flex", alignItems:"center", justifyContent:"center",
        position:"relative", overflow:"hidden"
      }}>
        {/* Background decorations */}
        <div style={{position:"absolute", top:"10%", right:"5%", width:"400px", height:"400px", background:"rgba(29,158,117,0.08)", borderRadius:"50%", filter:"blur(80px)"}} />
        <div style={{position:"absolute", bottom:"10%", left:"5%", width:"300px", height:"300px", background:"rgba(45,95,160,0.1)", borderRadius:"50%", filter:"blur(60px)"}} />

        <div style={{maxWidth:"1100px", margin:"0 auto", padding:"60px 5%", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"60px", alignItems:"center"}}>
          <div style={{animation:"fadeUp 0.8s ease"}}>
            <div className="section-tag">🎓 NAAC Grade A++ Certified</div>
            <h1 style={{
              fontFamily:"'Playfair Display',serif",
              fontSize:"clamp(36px,5vw,58px)", fontWeight:"800",
              color:"white", lineHeight:"1.15", marginBottom:"20px"
            }}>
              Your Academic Edge,<br/>
              <span style={{
                background:"linear-gradient(135deg,#1D9E75,#4ecba0)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"
              }}>Powered by AI</span>
            </h1>
            <p style={{color:"rgba(255,255,255,0.7)", fontSize:"17px", lineHeight:"1.7", marginBottom:"36px", maxWidth:"480px"}}>
              Access previous year question papers, get AI-generated practice papers, and ace your exams at Sri Guru Teg Bahadur Khalsa College, Sri Anandpur Sahib.
            </p>
            <div style={{display:"flex", gap:"16px", flexWrap:"wrap"}}>
              <button className="hero-btn-primary" onClick={() => navigate("/register")}>
                Get Started Free
              </button>
              <button className="hero-btn-secondary" onClick={() => navigate("/login")}>
                Sign In →
              </button>
            </div>

            {/* Stats */}
            <div style={{display:"flex", gap:"40px", marginTop:"48px", paddingTop:"32px", borderTop:"1px solid rgba(255,255,255,0.1)"}}>
              {[
                {num:"10+", label:"Years of Papers"},
                {num:"AI", label:"Question Generator"},
                {num:"24/7", label:"Access Anywhere"},
              ].map((s,i) => (
                <div key={i} className="stat-item">
                  <div style={{fontSize:"28px", fontWeight:"800", color:"#1D9E75"}}>{s.num}</div>
                  <div style={{fontSize:"13px", color:"rgba(255,255,255,0.5)", marginTop:"4px"}}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Right — College Logo */}
          <div style={{display:"flex", justifyContent:"center", animation:"float 4s ease-in-out infinite"}}>
            <div style={{
              position:"relative", width:"320px", height:"320px",
              display:"flex", alignItems:"center", justifyContent:"center"
            }}>
              <div style={{
                position:"absolute", inset:0, borderRadius:"50%",
                background:"linear-gradient(135deg,rgba(29,158,117,0.2),rgba(45,95,160,0.2))",
                filter:"blur(20px)"
              }} />
              <img src={COLLEGE_LOGO} alt="SGTB Khalsa College"
                style={{width:"280px", height:"280px", borderRadius:"50%", objectFit:"cover",
                  border:"4px solid rgba(29,158,117,0.4)",
                  boxShadow:"0 20px 60px rgba(0,0,0,0.4)"}} />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" style={{padding:"100px 5%", background:"#F4F7FB"}}>
        <div style={{maxWidth:"1100px", margin:"0 auto"}}>
          <div style={{textAlign:"center", marginBottom:"60px"}}>
            <div className="section-tag">✨ Features</div>
            <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,4vw,42px)", fontWeight:"700", color:"#0F2A4A", marginBottom:"16px"}}>
              Everything You Need to Excel
            </h2>
            <p style={{color:"#4A6080", fontSize:"16px", maxWidth:"500px", margin:"0 auto"}}>
              Designed specifically for students of SGTB Khalsa College
            </p>
          </div>

          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:"24px"}}>
            {[
              {icon:"📚", title:"Question Paper Repository", desc:"Access last 10 years of previous year question papers — filtered by department, class, semester and subject.", color:"#1D9E75"},
              {icon:"🤖", title:"AI Practice Paper Generator", desc:"Upload your syllabus PDF and get AI-generated practice questions based on exam patterns and topic frequency.", color:"#2D5FA0"},
              {icon:"🔍", title:"Smart Filter System", desc:"Find exactly what you need with department, class, semester and subject filters — results in seconds.", color:"#8B5CF6"},
              {icon:"📱", title:"Mobile Friendly", desc:"Access AcademiQ from any device — desktop, tablet or mobile. Study anytime, anywhere.", color:"#F59E0B"},
              {icon:"🔒", title:"Secure & Role-Based", desc:"Separate admin and student portals with JWT authentication. Your data is always safe.", color:"#EF4444"},
              {icon:"⭐", title:"AI Feedback System", desc:"Rate and review AI-generated papers to help improve question quality for everyone.", color:"#10B981"},
            ].map((f,i) => (
              <div key={i} className="feature-card" style={{animationDelay:`${i*0.1}s`}}>
                <div style={{fontSize:"40px", marginBottom:"16px"}}>{f.icon}</div>
                <h3 style={{fontFamily:"'Playfair Display',serif", fontSize:"18px", fontWeight:"700", color:"#0F2A4A", marginBottom:"12px"}}>{f.title}</h3>
                <p style={{color:"#4A6080", fontSize:"14px", lineHeight:"1.7"}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT COLLEGE SECTION */}
      <section id="about" style={{padding:"100px 5%", background:"white"}}>
        <div style={{maxWidth:"1100px", margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"80px", alignItems:"center"}}>
          <div>
            <div className="section-tag">🏛️ About</div>
            <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,4vw,40px)", fontWeight:"700", color:"#0F2A4A", marginBottom:"20px", lineHeight:"1.2"}}>
              Sri Guru Teg Bahadur Khalsa College
            </h2>
            <p style={{color:"#4A6080", fontSize:"15px", lineHeight:"1.8", marginBottom:"16px"}}>
              Sri Guru Teg Bahadur Khalsa College, Sri Anandpur Sahib is a premier institution of higher education in Punjab, India. Established with a vision to provide quality education, the college has grown into a center of academic excellence.
            </p>
            <p style={{color:"#4A6080", fontSize:"15px", lineHeight:"1.8", marginBottom:"32px"}}>
              As an Autonomous Body accredited with <strong style={{color:"#1D9E75"}}>NAAC Grade A++</strong>, the college upholds the highest standards of academic quality and innovation.
            </p>

            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"32px"}}>
              {[
                {icon:"🏆", label:"NAAC Grade A++"},
                {icon:"🎓", label:"Autonomous Body"},
                {icon:"📍", label:"Sri Anandpur Sahib"},
                {icon:"🌐", label:"sgtbcollege.org.in"},
              ].map((item,i) => (
                <div key={i} style={{display:"flex", alignItems:"center", gap:"10px", padding:"12px 16px", background:"#F4F7FB", borderRadius:"10px"}}>
                  <span style={{fontSize:"20px"}}>{item.icon}</span>
                  <span style={{fontSize:"13px", fontWeight:"600", color:"#0F2A4A"}}>{item.label}</span>
                </div>
              ))}
            </div>

            <a href="https://www.sgtbcollege.org.in/" target="_blank" rel="noreferrer"
              style={{display:"inline-flex", alignItems:"center", gap:"8px", background:"#0F2A4A", color:"white", padding:"12px 24px", borderRadius:"50px", textDecoration:"none", fontSize:"14px", fontWeight:"600"}}>
              Visit College Website →
            </a>
          </div>

          <div style={{display:"flex", justifyContent:"center"}}>
            <div style={{position:"relative"}}>
              <div style={{
                width:"300px", height:"300px", borderRadius:"30px",
                background:"linear-gradient(135deg,#0F2A4A,#1D9E75)",
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:"0 30px 80px rgba(15,42,74,0.3)"
              }}>
                <img src={COLLEGE_LOGO} alt="College Logo"
                  style={{width:"240px", height:"240px", objectFit:"contain"}} />
              </div>
              <div style={{
                position:"absolute", bottom:"-20px", right:"-20px",
                background:"#1D9E75", color:"white", padding:"16px 20px",
                borderRadius:"16px", boxShadow:"0 10px 30px rgba(29,158,117,0.4)"
              }}>
                <div style={{fontSize:"24px", fontWeight:"800"}}>A++</div>
                <div style={{fontSize:"11px", opacity:0.9}}>NAAC Grade</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{padding:"100px 5%", background:"#F4F7FB"}}>
        <div style={{maxWidth:"900px", margin:"0 auto"}}>
          <div style={{textAlign:"center", marginBottom:"60px"}}>
            <div className="section-tag">🚀 How It Works</div>
            <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,4vw,42px)", fontWeight:"700", color:"#0F2A4A"}}>
              Get Started in 3 Simple Steps
            </h2>
          </div>
          <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"32px"}}>
            {[
              {step:"01", title:"Register", desc:"Create your student account and wait for admin approval.", icon:"📝"},
              {step:"02", title:"Browse Papers", desc:"Filter by department, class, semester and find your papers.", icon:"🔍"},
              {step:"03", title:"Generate with AI", desc:"Upload syllabus and get AI-powered practice questions.", icon:"🤖"},
            ].map((s,i) => (
              <div key={i} style={{textAlign:"center", padding:"32px 20px", background:"white", borderRadius:"20px", boxShadow:"0 4px 20px rgba(0,0,0,0.06)"}}>
                <div style={{fontSize:"12px", fontWeight:"800", color:"#1D9E75", letterSpacing:"2px", marginBottom:"12px"}}>{s.step}</div>
                <div style={{fontSize:"36px", marginBottom:"16px"}}>{s.icon}</div>
                <h3 style={{fontFamily:"'Playfair Display',serif", fontSize:"18px", fontWeight:"700", color:"#0F2A4A", marginBottom:"10px"}}>{s.title}</h3>
                <p style={{color:"#4A6080", fontSize:"14px", lineHeight:"1.6"}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEVELOPER SECTION */}
      <section id="developer" style={{padding:"100px 5%", background:"white"}}>
        <div style={{maxWidth:"800px", margin:"0 auto", textAlign:"center"}}>
          <div className="section-tag">👨‍💻 Developer</div>
          <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,4vw,42px)", fontWeight:"700", color:"#0F2A4A", marginBottom:"48px"}}>
            Meet the Developer
          </h2>

          <div style={{
            background:"linear-gradient(135deg,#0F2A4A,#1a3d6b)",
            borderRadius:"30px", padding:"48px 40px",
            boxShadow:"0 30px 80px rgba(15,42,74,0.2)",
            display:"flex", flexDirection:"column", alignItems:"center", gap:"24px"
          }}>
            <div style={{position:"relative"}}>
              <img src={MY_PHOTO} alt="Happy Reehal"
                style={{width:"130px", height:"130px", borderRadius:"50%", objectFit:"cover",
                  border:"4px solid #1D9E75", boxShadow:"0 10px 40px rgba(0,0,0,0.3)"}} />
              <div style={{
                position:"absolute", bottom:"4px", right:"4px",
                width:"24px", height:"24px", background:"#1D9E75",
                borderRadius:"50%", border:"2px solid white",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"12px"
              }}>✓</div>
            </div>

            <div>
              <h3 style={{fontFamily:"'Playfair Display',serif", fontSize:"28px", fontWeight:"700", color:"white", marginBottom:"8px"}}>Happy Reehal</h3>
              <p style={{color:"#1D9E75", fontSize:"15px", fontWeight:"600", marginBottom:"6px"}}>M.Sc — Artificial Intelligence & Data Science</p>
              <p style={{color:"rgba(255,255,255,0.6)", fontSize:"14px", marginBottom:"4px"}}>P.G Department of Computer Science and Applications</p>
              <p style={{color:"rgba(255,255,255,0.5)", fontSize:"13px"}}>Sri Guru Teg Bahadur Khalsa College • 2024–2026</p>
            </div>

            <p style={{color:"rgba(255,255,255,0.7)", fontSize:"15px", lineHeight:"1.7", maxWidth:"500px"}}>
              Passionate about AI and building tools that make students' lives easier. AcademiQ is built with React, FastAPI, MongoDB, and powered by Groq's LLaMA AI model.
            </p>

            <div style={{display:"flex", gap:"16px"}}>
              <a href="https://github.com/happyreehal" target="_blank" rel="noreferrer"
                style={{display:"flex", alignItems:"center", gap:"8px", background:"rgba(255,255,255,0.1)", color:"white", padding:"12px 24px", borderRadius:"50px", textDecoration:"none", fontSize:"14px", fontWeight:"600", border:"1px solid rgba(255,255,255,0.2)", transition:"all 0.3s"}}>
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/happy-reehal-7225a4315" target="_blank" rel="noreferrer"
                style={{display:"flex", alignItems:"center", gap:"8px", background:"#0A66C2", color:"white", padding:"12px 24px", borderRadius:"50px", textDecoration:"none", fontSize:"14px", fontWeight:"600", transition:"all 0.3s"}}>
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{
        padding:"100px 5%",
        background:"linear-gradient(135deg,#0F2A4A,#1a3d6b)",
        textAlign:"center"
      }}>
        <div style={{maxWidth:"600px", margin:"0 auto"}}>
          <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,4vw,42px)", fontWeight:"700", color:"white", marginBottom:"20px"}}>
            Ready to Ace Your Exams?
          </h2>
          <p style={{color:"rgba(255,255,255,0.7)", fontSize:"16px", marginBottom:"36px", lineHeight:"1.7"}}>
            Join AcademiQ today and get access to years of question papers and AI-powered practice tests.
          </p>
          <div style={{display:"flex", gap:"16px", justifyContent:"center", flexWrap:"wrap"}}>
            <button className="hero-btn-primary" onClick={() => navigate("/register")}>
              Register Now — It's Free
            </button>
            <button className="hero-btn-secondary" onClick={() => navigate("/login")}>
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:"#060f1a", padding:"40px 5%", textAlign:"center"}}>
        <div style={{display:"flex", alignItems:"center", justifyContent:"center", gap:"10px", marginBottom:"16px"}}>
          <img src={COLLEGE_LOGO} alt="logo" style={{width:"32px", height:"32px", borderRadius:"6px", objectFit:"cover"}} />
          <span style={{color:"white", fontWeight:"700", fontSize:"16px"}}>AcademiQ</span>
        </div>
        <p style={{color:"rgba(255,255,255,0.4)", fontSize:"13px", marginBottom:"8px"}}>
          Sri Guru Teg Bahadur Khalsa College, Sri Anandpur Sahib (An Autonomous Body) • NAAC Grade A++
        </p>
        <p style={{color:"rgba(255,255,255,0.3)", fontSize:"12px"}}>
          Developed by Happy Reehal • M.Sc AI & Data Science • 2024–2026
        </p>
      </footer>
    </div>
  );
}