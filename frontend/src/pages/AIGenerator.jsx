import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API = "https://academiq-jenb.onrender.com";

export default function AIGenerator() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [syllabusPdf, setSyllabusPdf] = useState(null);
  const [pastPapersPdf, setPastPapersPdf] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [comment, setComment] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.backgroundColor = "#030810";
    document.body.style.overflowX = "hidden";
    return () => { document.body.style.margin = ""; };
  }, []);

  const handleGenerate = async () => {
    if (!syllabusPdf) { setError("Please upload syllabus PDF"); return; }
    setLoading(true);
    setError("");
    setResult("");
    setFeedback(null);
    setFeedbackSent(false);

    try {
      const formData = new FormData();
      formData.append("syllabus_pdf", syllabusPdf);
      if (pastPapersPdf) formData.append("past_papers_pdf", pastPapersPdf);

      const res = await fetch(`${API}/ai/generate`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Generation failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setResult(prev => prev + chunk);
      }
    } catch (err) {
      setError(err.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", width: "100%", background: "#030810", 
      fontFamily: "'DM Sans', sans-serif", color: "white",
      display: "flex", flexDirection: "column", position: "relative"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        
        /* Floating Particles Animation */
        .particle {
          position: fixed; background: rgba(29,158,117,0.2);
          border-radius: 50%; pointer-events: none; z-index: 0;
          animation: float up 15s linear infinite;
        }

        @keyframes up {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(-10vh) scale(1); opacity: 0; }
        }

        .orb {
          position: fixed; width: 600px; height: 600px; border-radius: 50%;
          filter: blur(140px); z-index: 0; opacity: 0.1; pointer-events: none;
        }
        .orb-1 { background: #1D9E75; top: -20%; left: -10%; animation: pulse 10s infinite alternate; }
        .orb-2 { background: #0F2A4A; bottom: -10%; right: -5%; }

        @keyframes pulse {
          from { transform: scale(1); opacity: 0.1; }
          to { transform: scale(1.2); opacity: 0.15; }
        }

        .card { 
          background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); 
          padding: 40px; backdrop-filter: blur(30px); margin-bottom: 24px; position: relative; z-index: 1;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .card:hover { border-color: rgba(29,158,117,0.5); transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }

        .btn-generate {
          width: 100%; padding: 20px; border: none; border-radius: 8px; font-size: 14px; 
          font-weight: 700; cursor: pointer; letter-spacing: 2px; text-transform: uppercase;
          transition: all 0.3s; margin-bottom: 30px; position: relative; z-index: 1;
          background: linear-gradient(135deg, #1D9E75, #0d7a5a); color: white;
        }
        .btn-generate:hover:not(:disabled) { transform: scale(1.02); box-shadow: 0 0 25px rgba(29,158,117,0.4); }
        .btn-generate:disabled { background: #1a1a1a; color: #444; cursor: not-allowed; }
      `}</style>

      {/* Floating Particles - 5 Background Dots */}
      <div className="particle" style={{width:'40px', height:'40px', left:'10%', animationDelay:'0s'}}></div>
      <div className="particle" style={{width:'20px', height:'20px', left:'30%', animationDelay:'5s'}}></div>
      <div className="particle" style={{width:'60px', height:'60px', left:'70%', animationDelay:'2s'}}></div>
      <div className="particle" style={{width:'30px', height:'30px', left:'85%', animationDelay:'8s'}}></div>
      <div className="particle" style={{width:'15px', height:'15px', left:'50%', animationDelay:'4s'}}></div>

      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      <nav style={{
        background: "rgba(3,8,16,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)",
        height: "72px", padding: "0 6%", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100
      }}>
        <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
          <div style={{width: "32px", height: "32px", background: "#1D9E75", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "900"}}>Q</div>
          <span style={{fontWeight: "600", fontSize: "16px", letterSpacing: "0.5px"}}>AcademiQ <span style={{color: "#1D9E75"}}>AI</span></span>
        </div>
        <div style={{display: "flex", alignItems: "center", gap: "16px"}}>
          <button onClick={() => navigate("/student")} style={{background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "12px", fontWeight: "600"}}>BACK</button>
          <button onClick={() => { logout(); navigate("/login"); }} style={{background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "12px"}}>Logout</button>
        </div>
      </nav>

      <div style={{maxWidth: "800px", width: "100%", margin: "60px auto", padding: "0 20px", flex: 1, position: "relative", zIndex: 1}}>
        <div className="card">
          <h2 style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", margin: "0 0 10px"}}>📄 Syllabus PDF</h2>
          <p style={{color: "rgba(255,255,255,0.4)", fontSize: "14px", marginBottom: "20px"}}>Upload the PDF to define the AI's knowledge scope.</p>
          <input type="file" accept=".pdf" onChange={(e) => setSyllabusPdf(e.target.files[0])} 
            style={{width: "100%", padding: "20px", border: "1px dashed rgba(255,255,255,0.2)", borderRadius: "8px", background: "rgba(0,0,0,0.2)", color: "white", cursor: "pointer"}} />
          {syllabusPdf && <p style={{color: "#1D9E75", fontSize: "13px", marginTop: "12px"}}>✓ {syllabusPdf.name}</p>}
        </div>

        <div className="card">
          <h2 style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", margin: "0 0 10px"}}>📚 Past Papers <span style={{fontSize: "16px", opacity: 0.3}}>(Optional)</span></h2>
          <p style={{color: "rgba(255,255,255,0.4)", fontSize: "14px", marginBottom: "20px"}}>Upload old papers for pattern matching.</p>
          <input type="file" accept=".pdf" onChange={(e) => setPastPapersPdf(e.target.files[0])} 
            style={{width: "100%", padding: "20px", border: "1px dashed rgba(255,255,255,0.2)", borderRadius: "8px", background: "rgba(0,0,0,0.2)", color: "white", cursor: "pointer"}} />
          {pastPapersPdf && <p style={{color: "#1D9E75", fontSize: "13px", marginTop: "12px"}}>✓ {pastPapersPdf.name}</p>}
        </div>

        {error && <div style={{background: "rgba(239,68,68,0.1)", border: "1px solid #EF4444", color: "#EF4444", padding: "16px", borderRadius: "8px", marginBottom: "24px"}}>{error}</div>}

        <button onClick={handleGenerate} disabled={loading} className="btn-generate">
          {loading ? "⚡ Processing Data..." : "🤖 Generate Practice Paper"}
        </button>

        {(result || loading) && (
          <div className="card">
            <h2 style={{fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", marginBottom: "20px"}}>📝 Predicted Exam Paper</h2>
            <pre style={{whiteSpace: "pre-wrap", color: "rgba(255,255,255,0.9)", fontSize: "15px", background: "rgba(0,0,0,0.4)", padding: "25px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)"}}>{result}</pre>

            {!loading && result && (
              <div style={{marginTop: "30px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px"}}>
                <p style={{fontSize: "14px", color: "rgba(255,255,255,0.5)", marginBottom: "15px"}}>Help us improve:</p>
                <div style={{display: "flex", gap: "10px"}}>
                  <button onClick={() => setFeedback("up")} style={{background: feedback==="up"?"#1D9E75":"transparent", border: "1px solid #1D9E75", color: "white", padding: "8px 20px", borderRadius: "6px", cursor: "pointer"}}>👍 Good</button>
                  <button onClick={() => setFeedback("down")} style={{background: feedback==="down"?"#EF4444":"transparent", border: "1px solid #EF4444", color: "white", padding: "8px 20px", borderRadius: "6px", cursor: "pointer"}}>👎 Bad</button>
                </div>
                {feedback && !feedbackSent && (
                  <div style={{marginTop: "20px"}}>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Feedback..." 
                      style={{width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "12px", borderRadius: "6px", boxSizing: "border-box"}} />
                    <button onClick={() => setFeedbackSent(true)} style={{marginTop: "10px", background: "white", color: "black", padding: "10px 20px", borderRadius: "6px", border: "none", fontWeight: "bold", cursor: "pointer"}}>Submit</button>
                  </div>
                )}
                {feedbackSent && <p style={{color: "#1D9E75", marginTop: "15px"}}>✅ Thanks for the feedback!</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}