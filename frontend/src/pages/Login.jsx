import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API = "https://academiq-jenb.onrender.com";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API}/auth/login`, form);
      login({
        name: res.data.name,
        role: res.data.role,
        is_super: res.data.is_super,
        email: form.email,
      }, res.data.token);
      if (res.data.role === "admin") navigate("/admin");
      else navigate("/student");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 50%, #1e3a5f 100%)",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"'Segoe UI', sans-serif", padding:"20px"
    }}>
      <div style={{
        background:"rgba(255,255,255,0.97)", borderRadius:"24px",
        padding:"48px 40px", width:"100%", maxWidth:"420px",
        boxShadow:"0 25px 60px rgba(0,0,0,0.3)", animation:"slideUp 0.5s ease"
      }}>
        <style>{`
          @keyframes slideUp {
            from { opacity:0; transform:translateY(30px); }
            to { opacity:1; transform:translateY(0); }
          }
          @keyframes shake {
            0%,100% { transform:translateX(0); }
            25% { transform:translateX(-8px); }
            75% { transform:translateX(8px); }
          }
          .input-field {
            width:100%; border:2px solid #e2e8f0; border-radius:12px;
            padding:12px 16px; font-size:15px; outline:none;
            transition:all 0.3s ease; box-sizing:border-box; background:#f8fafc;
          }
          .input-field:focus {
            border-color:#1e3a5f; background:white;
            box-shadow:0 0 0 4px rgba(30,58,95,0.1);
          }
          .login-btn {
            width:100%; padding:14px;
            background:linear-gradient(135deg,#1e3a5f,#2d6a9f);
            color:white; border:none; border-radius:12px;
            font-size:16px; font-weight:600; cursor:pointer; transition:all 0.3s ease;
          }
          .login-btn:hover { transform:translateY(-2px); box-shadow:0 8px 25px rgba(30,58,95,0.4); }
          .login-btn:disabled { opacity:0.7; cursor:not-allowed; transform:none; }
          .role-tab {
            flex:1; padding:10px; border:2px solid #e2e8f0;
            background:#f8fafc; border-radius:10px; cursor:pointer;
            font-weight:600; font-size:14px; transition:all 0.3s ease;
          }
          .role-tab.active { background:#1e3a5f; color:white; border-color:#1e3a5f; }
        `}</style>

        <div style={{textAlign:"center", marginBottom:"32px"}}>
          <div style={{
            width:"64px", height:"64px",
            background:"linear-gradient(135deg,#1e3a5f,#2d6a9f)",
            borderRadius:"16px", display:"inline-flex",
            alignItems:"center", justifyContent:"center",
            marginBottom:"16px", fontSize:"28px"
          }}>🎓</div>
          <h1 style={{fontSize:"28px", fontWeight:"800", color:"#1e3a5f", margin:"0 0 6px"}}>AcademiQ</h1>
          <p style={{color:"#64748b", margin:0, fontSize:"15px"}}>Sign in to your account</p>
        </div>

        <div style={{display:"flex", gap:"10px", marginBottom:"24px"}}>
          <button className={`role-tab ${form.role==="student"?"active":""}`}
            onClick={() => setForm({...form, role:"student"})}>
            👨‍🎓 Student
          </button>
          <button className={`role-tab ${form.role==="admin"?"active":""}`}
            onClick={() => setForm({...form, role:"admin"})}>
            👨‍💼 Admin
          </button>
        </div>

        {error && (
          <div style={{
            background:"#fef2f2", border:"1px solid #fecaca", color:"#dc2626",
            padding:"12px 16px", borderRadius:"10px", marginBottom:"20px",
            fontSize:"14px", animation:"shake 0.3s ease"
          }}>⚠️ {error}</div>
        )}

        <form onSubmit={handleSubmit} style={{display:"flex", flexDirection:"column", gap:"18px"}}>
          <div>
            <label style={{display:"block", fontSize:"13px", fontWeight:"600", color:"#374151", marginBottom:"6px"}}>Email Address</label>
            <input type="email" className="input-field" value={form.email}
              onChange={e => setForm({...form, email:e.target.value})} required placeholder="you@example.com" />
          </div>
          <div>
            <label style={{display:"block", fontSize:"13px", fontWeight:"600", color:"#374151", marginBottom:"6px"}}>Password</label>
            <input type="password" className="input-field" value={form.password}
              onChange={e => setForm({...form, password:e.target.value})} required placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="login-btn">
            {loading ? "⏳ Signing in..." : "Sign In →"}
          </button>
        </form>

        <p style={{textAlign:"center", fontSize:"14px", color:"#64748b", marginTop:"24px", marginBottom:0}}>
          Don't have an account?{" "}
          <Link to="/register" style={{color:"#1e3a5f", fontWeight:"700", textDecoration:"none"}}>Register here</Link>
        </p>
      </div>
    </div>
  );
}