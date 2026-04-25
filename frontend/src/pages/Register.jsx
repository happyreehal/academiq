import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student", college_id: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("https://academiq-jenb.onrender.com/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 50%, #1e3a5f 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif", padding: "20px"
    }}>
      <div style={{
        background: "rgba(255,255,255,0.97)", borderRadius: "24px",
        padding: "48px 40px", width: "100%", maxWidth: "420px",
        boxShadow: "0 25px 60px rgba(0,0,0,0.3)", animation: "slideUp 0.5s ease"
      }}>
        <style>{`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes shake {
            0%,100% { transform: translateX(0); }
            25% { transform: translateX(-8px); }
            75% { transform: translateX(8px); }
          }
          .input-field {
            width: 100%; border: 2px solid #e2e8f0; border-radius: 12px;
            padding: 12px 16px; font-size: 15px; outline: none;
            transition: all 0.3s ease; box-sizing: border-box; background: #f8fafc;
          }
          .input-field:focus {
            border-color: #1e3a5f; background: white;
            box-shadow: 0 0 0 4px rgba(30,58,95,0.1);
          }
          .reg-btn {
            width: 100%; padding: 14px;
            background: linear-gradient(135deg, #1e3a5f, #2d6a9f);
            color: white; border: none; border-radius: 12px;
            font-size: 16px; font-weight: 600; cursor: pointer;
            transition: all 0.3s ease;
          }
          .reg-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(30,58,95,0.4); }
          .reg-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
          .role-tab {
            flex: 1; padding: 10px; border: 2px solid #e2e8f0;
            background: #f8fafc; border-radius: 10px; cursor: pointer;
            font-weight: 600; font-size: 14px; transition: all 0.3s ease;
          }
          .role-tab.active { background: #1e3a5f; color: white; border-color: #1e3a5f; }
        `}</style>

        <div style={{textAlign:"center", marginBottom:"28px"}}>
          <div style={{
            width:"64px", height:"64px",
            background:"linear-gradient(135deg,#1e3a5f,#2d6a9f)",
            borderRadius:"16px", display:"inline-flex",
            alignItems:"center", justifyContent:"center",
            marginBottom:"16px", fontSize:"28px"
          }}>🎓</div>
          <h1 style={{fontSize:"28px", fontWeight:"800", color:"#1e3a5f", margin:"0 0 6px"}}>AcademiQ</h1>
          <p style={{color:"#64748b", margin:0, fontSize:"15px"}}>Create your account</p>
        </div>

        <div style={{display:"flex", gap:"10px", marginBottom:"20px"}}>
          <button className={`role-tab ${form.role === "student" ? "active" : ""}`}
            onClick={() => setForm({...form, role:"student"})}>👨‍🎓 Student</button>
          <button className={`role-tab ${form.role === "admin" ? "active" : ""}`}
            onClick={() => setForm({...form, role:"admin"})}>👨‍💼 Admin</button>
        </div>

        {error && (
          <div style={{
            background:"#fef2f2", border:"1px solid #fecaca", color:"#dc2626",
            padding:"12px 16px", borderRadius:"10px", marginBottom:"16px",
            fontSize:"14px", animation:"shake 0.3s ease"
          }}>⚠️ {error}</div>
        )}

        <form onSubmit={handleSubmit} style={{display:"flex", flexDirection:"column", gap:"16px"}}>
          <div>
            <label style={{display:"block", fontSize:"13px", fontWeight:"600", color:"#374151", marginBottom:"6px"}}>Full Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required
              className="input-field" placeholder="Your full name" />
          </div>
          <div>
            <label style={{display:"block", fontSize:"13px", fontWeight:"600", color:"#374151", marginBottom:"6px"}}>Email Address</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required
              className="input-field" placeholder="you@example.com" />
          </div>
          <div>
            <label style={{display:"block", fontSize:"13px", fontWeight:"600", color:"#374151", marginBottom:"6px"}}>College ID (optional)</label>
            <input type="text" name="college_id" value={form.college_id} onChange={handleChange}
              className="input-field" placeholder="e.g. CSE2024001" />
          </div>
          <div>
            <label style={{display:"block", fontSize:"13px", fontWeight:"600", color:"#374151", marginBottom:"6px"}}>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required
              className="input-field" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="reg-btn">
            {loading ? "⏳ Creating account..." : "Create Account →"}
          </button>
        </form>

        <p style={{textAlign:"center", fontSize:"14px", color:"#64748b", marginTop:"20px", marginBottom:0}}>
          Already have an account?{" "}
          <Link to="/login" style={{color:"#1e3a5f", fontWeight:"700", textDecoration:"none"}}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
