import { useState } from "react";
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

      // FIX: fetch with streaming instead of axios
      const res = await fetch(`${API}/ai/generate`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Generation failed");
      }

      // FIX: read stream chunk by chunk — words appear as they generate
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setResult(prev => prev + chunk);  // append each chunk as it arrives
      }

    } catch (err) {
      setError(err.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight:"100vh", background:"#030810", fontFamily:"'DM Sans', sans-serif", color:"white"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        
        .card { 
          background:rgba(255,255,255,0.02); border-radius:4px; border:1px solid rgba(255,255,255,0.06); 
          padding:36px; backdrop-filter: blur(20px); margin-bottom: 24px; transition: all 0.3s;
        }
        .card:hover { border-color: rgba(29,158,117,0.3); background: rgba(29,158,117,0.02); transform: translateY(-2px); }

        .card-title { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 400; color: white; margin: 0 0 8px; }
        .card-desc { color: rgba(255,255,255,0.4); font-size: 13px; margin: 0 0 20px; font-weight: 300; }

        .file-drop {
          width: 100%; padding: 20px 14px; border: 1px dashed rgba(255,255,255,0.2); 
          border-radius: 4px; font-size: 14px; background: rgba(255,255,255,0.02); 
          cursor: pointer; box-sizing: border-box; color: white; transition: all 0.3s;
        }
        .file-drop:hover { border-color: #1D9E75; background: rgba(29,158,117,0.05); }

        .btn-generate {
          width: 100%; padding: 16px; border: none; border-radius: 4px; font-size: 15px; 
          font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; letter-spacing: 1px;
          transition: all 0.3s; margin-bottom: 24px; text-transform: uppercase;
        }
        .btn-generate.active {
          background: linear-gradient(135deg, #1D9E75, #0d7a5a); color: white;
        }
        .btn-generate.active:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(29,158,117,0.3); }
        .btn-generate.disabled {
          background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.3); cursor: not-allowed; border: 1px solid rgba(255,255,255,0.1);
        }

        .feedback-btn {
          padding: 10px 24px; border-radius: 4px; font-size: 13px; cursor: pointer; transition: all 0.3s; font-weight: 500;
        }
        .feedback-up { border: 1px solid rgba(29,158,117,0.3); background: rgba(29,158,117,0.1); color: #1D9E75; }
        .feedback-up:hover { background: rgba(29,158,117,0.2); }
        .feedback-down { border: 1px solid rgba(239,68,68,0.3); background: rgba(239,68,68,0.1); color: #EF4444; }
        .feedback-down:hover { background: rgba(239,68,68,0.2); }
        .feedback-neutral { border: 1px solid rgba(255,255,255,0.2); background: transparent; color: rgba(255,255,255,0.6); }
        .feedback-neutral:hover { background: rgba(255,255,255,0.05); color: white; }

        .form-textarea {
          width: 100%; padding: 14px; border: 1px solid rgba(255,255,255,0.1); 
          border-radius: 4px; font-size: 14px; font-family: 'DM Sans', sans-serif; 
          resize: vertical; outline: none; box-sizing: border-box;
          background: rgba(255,255,255,0.03); color: white; transition: border-color 0.3s;
        }
        .form-textarea:focus { border-color: #1D9E75; background: rgba(255,255,255,0.06); }
      `}</style>

      {/* Navbar */}
      <nav style={{
        background:"rgba(3,8,16,0.95)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.06)",
        height:"72px", padding:"0 6%", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100
      }}>
        <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
          <div style={{width:"32px", height:"32px", background:"#1D9E75", borderRadius:"4px", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:"700", fontSize:"16px"}}>Q</div>
          <span style={{color:"white", fontWeight:"600", fontSize:"15px"}}>AcademiQ <span style={{color:"#1D9E75"}}>AI Generator</span></span>
        </div>
        <div style={{display:"flex", alignItems:"center", gap:"16px"}}>
          <button onClick={() => navigate("/student")} style={{background:"none", border:"none", color:"rgba(255,255,255,0.5)", cursor:"pointer", fontSize:"13px", letterSpacing:"1px", transition:"color 0.3s"}} onMouseOver={e => e.currentTarget.style.color="#1D9E75"} onMouseOut={e => e.currentTarget.style.color="rgba(255,255,255,0.5)"}>← Back</button>
          <span style={{color:"rgba(255,255,255,0.5)", fontSize:"13px", letterSpacing:"1px"}}>👋 {user?.name}</span>
          <button onClick={() => { logout(); navigate("/login"); }} style={{background:"transparent", border:"1px solid rgba(255,255,255,0.2)", color:"rgba(255,255,255,0.8)", padding:"8px 16px", borderRadius:"4px", cursor:"pointer", fontSize:"12px", transition:"all 0.3s"}} onMouseOver={e => {e.currentTarget.style.borderColor="white"; e.currentTarget.style.color="white"}} onMouseOut={e => {e.currentTarget.style.borderColor="rgba(255,255,255,0.2)"; e.currentTarget.style.color="rgba(255,255,255,0.8)"}}>Logout</button>
        </div>
      </nav>

      <div style={{maxWidth:"800px", margin:"60px auto", padding:"0 20px"}}>

        {/* Step 1 */}
        <div className="card">
          <h2 className="card-title">📄 Step 1 — Upload Syllabus PDF</h2>
          <p className="card-desc">Upload your latest course syllabus in PDF format to give AI the right context.</p>
          <input type="file" accept=".pdf" onChange={(e) => setSyllabusPdf(e.target.files[0])} className="file-drop" />
          {syllabusPdf && <p style={{color:"#1D9E75", fontSize:"13px", marginTop:"12px", fontWeight:"500", letterSpacing:"0.5px"}}>✓ {syllabusPdf.name}</p>}
        </div>

        {/* Step 2 */}
        <div className="card">
          <h2 className="card-title">
            📚 Step 2 — Upload Past Papers 
            <span style={{color:"rgba(255,255,255,0.3)", fontWeight:"300", fontSize:"16px", marginLeft:"8px", fontFamily:"'DM Sans'"}}>(Optional)</span>
          </h2>
          <p className="card-desc">Upload previous year question papers so the AI can mimic the exact exam pattern.</p>
          <input type="file" accept=".pdf" onChange={(e) => setPastPapersPdf(e.target.files[0])} className="file-drop" />
          {pastPapersPdf && <p style={{color:"#1D9E75", fontSize:"13px", marginTop:"12px", fontWeight:"500", letterSpacing:"0.5px"}}>✓ {pastPapersPdf.name}</p>}
        </div>

        {/* Error */}
        {error && (
          <div style={{background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", color:"#EF4444", padding:"16px", borderRadius:"4px", fontSize:"14px", marginBottom:"24px", backdropFilter:"blur(10px)"}}>
            ⚠️ {error}
          </div>
        )}

        {/* Generate Button */}
        <button onClick={handleGenerate} disabled={loading} className={`btn-generate ${loading ? "disabled" : "active"}`}>
          {loading ? "⏳ Generating..." : "🤖 Generate AI Practice Paper"}
        </button>

        {/* Result — shows while streaming */}
        {(result || loading) && (
          <div className="card" style={{borderColor: loading ? "rgba(29,158,117,0.5)" : "rgba(255,255,255,0.06)", boxShadow: loading ? "0 0 20px rgba(29,158,117,0.1)" : "none"}}>
            <h2 className="card-title" style={{display:"flex", alignItems:"center"}}>
              📝 Generated Practice Paper
              {loading && <span style={{fontSize:"11px", fontWeight:"600", color:"#1D9E75", marginLeft:"16px", letterSpacing:"2px", fontFamily:"'DM Sans'", animation:"pulse 1.5s infinite", textTransform:"uppercase"}}>● Generating</span>}
            </h2>
            
            <pre style={{
              whiteSpace:"pre-wrap", color:"rgba(255,255,255,0.8)", fontSize:"15px", lineHeight:"1.8", 
              fontFamily:"'DM Sans',sans-serif", background:"rgba(0,0,0,0.3)", padding:"24px", 
              borderRadius:"4px", border:"1px solid rgba(255,255,255,0.05)", marginTop:"20px", fontWeight:"300"
            }}>
              {result}
            </pre>

            {/* Feedback — only show when done */}
            {!loading && result && (
              <div style={{marginTop:"32px", paddingTop:"24px", borderTop:"1px solid rgba(255,255,255,0.06)"}}>
                <p style={{fontWeight:"500", color:"white", marginBottom:"16px", fontSize:"15px"}}>Rate this generated paper:</p>
                <div style={{display:"flex", gap:"16px", marginBottom:"20px"}}>
                  <button onClick={() => setFeedback("up")} className={`feedback-btn ${feedback === "up" ? "feedback-up" : "feedback-neutral"}`}>
                    👍 Helpful
                  </button>
                  <button onClick={() => setFeedback("down")} className={`feedback-btn ${feedback === "down" ? "feedback-down" : "feedback-neutral"}`}>
                    👎 Not Helpful
                  </button>
                </div>

                {feedback && !feedbackSent && (
                  <div style={{display:"flex", flexDirection:"column", gap:"16px", animation:"fade-up 0.4s ease forwards"}}>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} className="form-textarea" placeholder="Any comments or suggestions to improve the AI? (optional)" />
                    <button onClick={() => setFeedbackSent(true)}
                      style={{alignSelf:"flex-start", padding:"12px 28px", background:"rgba(255,255,255,0.05)", color:"white", border:"1px solid rgba(255,255,255,0.2)", borderRadius:"4px", fontSize:"13px", fontWeight:"600", cursor:"pointer", transition:"all 0.3s", letterSpacing:"1px", textTransform:"uppercase"}}
                      onMouseOver={e => {e.currentTarget.style.background="white"; e.currentTarget.style.color="#030810"}}
                      onMouseOut={e => {e.currentTarget.style.background="rgba(255,255,255,0.05)"; e.currentTarget.style.color="white"}}>
                      Submit Feedback
                    </button>
                  </div>
                )}

                {feedbackSent && (
                  <p style={{color:"#1D9E75", fontWeight:"500", marginTop:"16px", letterSpacing:"0.5px", background:"rgba(29,158,117,0.1)", display:"inline-block", padding:"8px 16px", borderRadius:"4px", border:"1px solid rgba(29,158,117,0.3)"}}>
                    ✅ Thank you for your feedback! It helps improve the AI.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}