import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API = "https://academiq-jenb.onrender.com";

export default function AIGenerator() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // --- Content Check: All your original states are here ---
  const [syllabusPdf, setSyllabusPdf] = useState(null);
  const [pastPapersPdf, setPastPapersPdf] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [comment, setComment] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  // White line fix & body background
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.backgroundColor = "#030810";
    document.body.style.overflowX = "hidden";
    return () => { document.body.style.margin = ""; };
  }, []);

  // --- Content Check: Your exact handleGenerate logic ---
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
        setResult(prev => prev + chunk); // Streaming words one by one
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
        
        /* The Animated Orbs */
        .orb {
          position: fixed; width: 600px; height: 600px; border-radius: 50%;
          filter: blur(120px); z-index: 0; opacity: 0.12; pointer-events: none;
        }
        .orb-1 { background: #1D9E75; top: -15%; left: -10%; animation: move 20s infinite alternate; }
        .orb-2 { background: #0F2A4A; bottom: -10%; right: -5%; animation: move 25s infinite alternate-reverse; }

        @keyframes move {
          from { transform: translate(0, 0); }
          to { transform: translate(150px, 100px); }
        }

        .card { 
          background: rgba(255,255,255,0.02); border-radius: 8px; border: 1px solid rgba(255,255,255,0.06); 
          padding: 36px; backdrop-filter: blur(25px); margin-bottom: 24px; position: relative; z-index: 1;
          transition: all 0.4s ease;
        }
        .card:hover { border-color: rgba(29,158,117,0.3); transform: translateY(-4px); }

        .card-title { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 400; margin: 0 0 8px; }
        .card-desc { color: rgba(255,255,255,0.4); font-size: 13px; margin: 0 0 20px; }

        .file-drop {
          width: 100%; padding: 20px; border: 1px dashed rgba(255,255,255,0.2); 
          border-radius: 4px; background: rgba(255,255,255,0.01); color: white; cursor: pointer;
        }

        .btn-generate {
          width: 100%; padding: 16px; border: none; border-radius: 4px; font-size: 14px; 
          font-weight: 600; cursor: pointer; letter-spacing: 1.5px; text-transform: uppercase;
          transition: all 0.3s; margin-bottom: 24px; position: relative; z-index: 1;
        }
        .btn-generate.active { background: #1D9E75; color: white; }
        .btn-generate.active:hover { background: #24b88a; box-shadow: 0 0 20px rgba(29,158,117,0.3); }
        .btn-generate.disabled { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.3); cursor: not-allowed; }

        pre { background: rgba(0,0,0,0.3); padding: 24px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.05); line-height: 1.8; }
      `}</style>

      {/* Orbs Background */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      {/* Navbar - Your original content */}
      <nav style={{
        background: "rgba(3,8,16,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)",
        height: "72px", padding: "0 6%", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100
      }}>
        <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
          <div style={{width: "32px", height: "32px", background: "#1D9E75", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700"}}>Q</div>
          <span style={{fontWeight: "600", fontSize: "15px"}}>AcademiQ <span style={{color: "#1D9E75"}}>AI</span></span>
        </div>
        <div style={{display: "flex", alignItems: "center", gap: "16px"}}>
          <button onClick={() => navigate("/student")} style={{background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "13px"}}>← Back</button>
          <span style={{color: "rgba(255,255,255,0.5)", fontSize: "13px"}}>👋 {user?.name}</span>
          <button onClick={() => { logout(); navigate("/login"); }} style={{background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "white", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", fontSize: "12px"}}>Logout</button>
        </div>
      </nav>

      <div style={{maxWidth: "800px", width: "100%", margin: "60px auto", padding: "0 20px", flex: 1, position: "relative", zIndex: 1}}>
        {/* Step 1 - Content Check: Original Wording */}
        <div className="card">
          <h2 className="card-title">📄 Step 1 — Upload Syllabus PDF</h2>
          <p className="card-desc">Upload your latest course syllabus in PDF format.</p>
          <input type="file" accept=".pdf" onChange={(e) => setSyllabusPdf(e.target.files[0])} className="file-drop" />
          {syllabusPdf && <p style={{color: "#1D9E75", fontSize: "13px", marginTop: "12px"}}>✓ {syllabusPdf.name}</p>}
        </div>

        {/* Step 2 - Content Check: Original Wording */}
        <div className="card">
          <h2 className="card-title">📚 Step 2 — Past Papers <span style={{fontSize: "16px", color: "rgba(255,255,255,0.3)"}}>(Optional)</span></h2>
          <p className="card-desc">Upload previous year papers for better predictions.</p>
          <input type="file" accept=".pdf" onChange={(e) => setPastPapersPdf(e.target.files[0])} className="file-drop" />
          {pastPapersPdf && <p style={{color: "#1D9E75", fontSize: "13px", marginTop: "12px"}}>✓ {pastPapersPdf.name}</p>}
        </div>

        {error && <div style={{background: "rgba(239,68,68,0.1)", border: "1px solid #EF4444", color: "#EF4444", padding: "16px", borderRadius: "4px", marginBottom: "24px"}}>{error}</div>}

        <button onClick={handleGenerate} disabled={loading} className={`btn-generate ${loading ? "disabled" : "active"}`}>
          {loading ? "⏳ Generating..." : "🤖 Generate AI Practice Paper"}
        </button>

        {/* Result Area - Content Check: Exact Logic */}
        {(result || loading) && (
          <div className="card">
            <h2 className="card-title" style={{display: "flex", alignItems: "center"}}>
              📝 Practice Paper
              {loading && <span style={{fontSize: "11px", color: "#1D9E75", marginLeft: "16px"}}>● GENERATING...</span>}
            </h2>
            <pre style={{whiteSpace: "pre-wrap", color: "rgba(255,255,255,0.8)", fontSize: "15px", marginTop: "20px"}}>{result}</pre>

            {!loading && result && (
              <div style={{marginTop: "32px", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.06)"}}>
                <p style={{marginBottom: "16px", fontSize: "14px", color: "rgba(255,255,255,0.6)"}}>Rate this paper:</p>
                <div style={{display: "flex", gap: "12px"}}>
                  <button onClick={() => setFeedback("up")} style={{background: feedback==="up"?"#1D9E75":"transparent", color: "white", border: "1px solid #1D9E75", padding: "8px 16px", borderRadius: "4px", cursor: "pointer"}}>👍 Helpful</button>
                  <button onClick={() => setFeedback("down")} style={{background: feedback==="down"?"#EF4444":"transparent", color: "white", border: "1px solid #EF4444", padding: "8px 16px", borderRadius: "4px", cursor: "pointer"}}>👎 Not Helpful</button>
                </div>
                {feedback && !feedbackSent && (
                  <div style={{marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px"}}>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Any comments..." style={{background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", color: "white", padding: "12px"}} />
                    <button onClick={() => setFeedbackSent(true)} style={{background: "white", color: "black", border: "none", padding: "10px", borderRadius: "4px", cursor: "pointer", fontWeight: "600"}}>Submit Feedback</button>
                  </div>
                )}
                {feedbackSent && <p style={{color: "#1D9E75", marginTop: "16px"}}>✅ Thanks for feedback!</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}