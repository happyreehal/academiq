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
    <div style={{minHeight:"100vh", background:"#F4F7FB", fontFamily:"'DM Sans',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>

      {/* Navbar */}
      <nav style={{background:"#0F2A4A", height:"64px", padding:"0 32px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100}}>
        <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
          <div style={{width:"36px", height:"36px", background:"#1D9E75", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:"700", fontSize:"18px"}}>Q</div>
          <span style={{color:"white", fontWeight:"600", fontSize:"15px"}}>AcademiQ <span style={{color:"#1D9E75"}}>AI Generator</span></span>
        </div>
        <div style={{display:"flex", alignItems:"center", gap:"12px"}}>
          <button onClick={() => navigate("/student")} style={{background:"none", border:"none", color:"rgba(255,255,255,0.7)", cursor:"pointer", fontSize:"14px", textDecoration:"underline"}}>← Back</button>
          <span style={{color:"rgba(255,255,255,0.7)", fontSize:"14px"}}>👋 {user?.name}</span>
          <button onClick={() => { logout(); navigate("/login"); }} style={{background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.25)", color:"white", padding:"8px 18px", borderRadius:"8px", cursor:"pointer", fontSize:"14px"}}>Logout</button>
        </div>
      </nav>

      <div style={{maxWidth:"800px", margin:"40px auto", padding:"0 20px"}}>

        {/* Step 1 */}
        <div style={{background:"white", borderRadius:"16px", border:"1px solid rgba(15,42,74,0.12)", padding:"28px", marginBottom:"20px"}}>
          <h2 style={{fontSize:"18px", fontWeight:"700", color:"#0F2A4A", margin:"0 0 6px"}}>📄 Step 1 — Upload Syllabus PDF</h2>
          <p style={{color:"#4A6080", fontSize:"14px", margin:"0 0 14px"}}>Upload your latest course syllabus in PDF format</p>
          <input type="file" accept=".pdf" onChange={(e) => setSyllabusPdf(e.target.files[0])}
            style={{width:"100%", padding:"10px 14px", border:"2px dashed rgba(15,42,74,0.2)", borderRadius:"10px", fontSize:"14px", background:"#F4F7FB", cursor:"pointer", boxSizing:"border-box"}} />
          {syllabusPdf && <p style={{color:"#1D9E75", fontSize:"13px", marginTop:"8px", fontWeight:"600"}}>✓ {syllabusPdf.name}</p>}
        </div>

        {/* Step 2 */}
        <div style={{background:"white", borderRadius:"16px", border:"1px solid rgba(15,42,74,0.12)", padding:"28px", marginBottom:"20px"}}>
          <h2 style={{fontSize:"18px", fontWeight:"700", color:"#0F2A4A", margin:"0 0 6px"}}>
            📚 Step 2 — Upload Past Year Papers PDF{" "}
            <span style={{color:"#4A6080", fontWeight:"400", fontSize:"14px"}}>(Optional)</span>
          </h2>
          <p style={{color:"#4A6080", fontSize:"14px", margin:"0 0 14px"}}>Upload previous year question papers for better predictions</p>
          <input type="file" accept=".pdf" onChange={(e) => setPastPapersPdf(e.target.files[0])}
            style={{width:"100%", padding:"10px 14px", border:"2px dashed rgba(15,42,74,0.2)", borderRadius:"10px", fontSize:"14px", background:"#F4F7FB", cursor:"pointer", boxSizing:"border-box"}} />
          {pastPapersPdf && <p style={{color:"#1D9E75", fontSize:"13px", marginTop:"8px", fontWeight:"600"}}>✓ {pastPapersPdf.name}</p>}
        </div>

        {/* Error */}
        {error && (
          <div style={{background:"#fef2f2", border:"1px solid #fecaca", color:"#dc2626", padding:"12px 16px", borderRadius:"10px", fontSize:"14px", marginBottom:"20px"}}>
            ⚠️ {error}
          </div>
        )}

        {/* Generate Button */}
        <button onClick={handleGenerate} disabled={loading}
          style={{width:"100%", padding:"15px", background:loading?"#94a3b8":"linear-gradient(135deg,#0F2A4A,#1D5FA0)", color:"white", border:"none", borderRadius:"12px", fontSize:"16px", fontWeight:"600", cursor:loading?"not-allowed":"pointer", fontFamily:"'DM Sans',sans-serif", marginBottom:"20px"}}>
          {loading ? "⏳ Generating... (words will appear below)" : "🤖 Generate AI Practice Paper"}
        </button>

        {/* Result — shows while streaming */}
        {(result || loading) && (
          <div style={{background:"white", borderRadius:"16px", border:"1px solid rgba(15,42,74,0.12)", padding:"28px", marginBottom:"40px"}}>
            <h2 style={{fontSize:"18px", fontWeight:"700", color:"#0F2A4A", margin:"0 0 16px"}}>
              📝 Generated Practice Paper
              {loading && <span style={{fontSize:"13px", fontWeight:"400", color:"#1D9E75", marginLeft:"12px"}}>● generating...</span>}
            </h2>
            <pre style={{whiteSpace:"pre-wrap", color:"#374151", fontSize:"14px", lineHeight:"1.7", fontFamily:"'DM Sans',sans-serif"}}>{result}</pre>

            {/* Feedback — only show when done */}
            {!loading && result && (
              <div style={{marginTop:"24px", paddingTop:"20px", borderTop:"1px solid rgba(15,42,74,0.1)"}}>
                <p style={{fontWeight:"600", color:"#0F2A4A", marginBottom:"12px"}}>Rate this generated paper:</p>
                <div style={{display:"flex", gap:"12px", marginBottom:"16px"}}>
                  <button onClick={() => setFeedback("up")}
                    style={{padding:"10px 20px", borderRadius:"10px", border:`1px solid ${feedback==="up"?"#1D9E75":"rgba(15,42,74,0.2)"}`, fontSize:"15px", cursor:"pointer", background:feedback==="up"?"#E1F5EE":"white"}}>
                    👍 Helpful
                  </button>
                  <button onClick={() => setFeedback("down")}
                    style={{padding:"10px 20px", borderRadius:"10px", border:`1px solid ${feedback==="down"?"#dc2626":"rgba(15,42,74,0.2)"}`, fontSize:"15px", cursor:"pointer", background:feedback==="down"?"#fef2f2":"white"}}>
                    👎 Not Helpful
                  </button>
                </div>

                {feedback && !feedbackSent && (
                  <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3}
                      style={{width:"100%", padding:"12px 14px", border:"1px solid rgba(15,42,74,0.15)", borderRadius:"10px", fontSize:"14px", fontFamily:"'DM Sans',sans-serif", resize:"vertical", outline:"none", boxSizing:"border-box"}}
                      placeholder="Any comments? (optional)" />
                    <button onClick={() => setFeedbackSent(true)}
                      style={{alignSelf:"flex-start", padding:"10px 20px", background:"#0F2A4A", color:"white", border:"none", borderRadius:"8px", fontSize:"14px", fontWeight:"500", cursor:"pointer"}}>
                      Submit Feedback
                    </button>
                  </div>
                )}

                {feedbackSent && (
                  <p style={{color:"#1D9E75", fontWeight:"600"}}>✅ Thank you for your feedback!</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}