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
      minHeight: "100vh",
      background: "linear-gradient(135deg, #030810 0%, #0d2035 50%, #030810 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif", padding: "20px"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes slideUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shake { 0%,100% { transform:translateX(0); } 25% { transform:translateX(-8px); } 75% { transform:translateX(8px); } }
        .input-field {
          width:100%; border:1px solid rgba(255,255,255,0.1); border-radius:8px;
          padding:12px 16px; font-size:14px; outline:none;
          transition:all 0.3s ease; box-sizing:border-box;
          background:rgba(255,255,255,0.05); color:white;
          font-family:'DM Sans',sans-serif;
        }
        .input-field::placeholder { color:rgba(255,255,255,0.25); }
        .input-field:focus { border-color:#1D9E75; background:rgba(255,255,255,0.08); box-shadow:0 0 0 3px rgba(29,158,117,0.15); }
        .login-btn {
          width:100%; padding:14px;
          background:linear-gradient(135deg,#1D9E75,#0d7a5a);
          color:white; border:none; border-radius:8px;
          font-size:14px; font-weight:600; cursor:pointer;
          transition:all 0.3s ease; font-family:'DM Sans',sans-serif;
          letter-spacing:1px;
        }
        .login-btn:hover { transform:translateY(-2px); box-shadow:0 8px 25px rgba(29,158,117,0.3); }
        .login-btn:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
        .role-tab {
          flex:1; padding:10px; border:1px solid rgba(255,255,255,0.1);
          background:rgba(255,255,255,0.03); border-radius:8px; cursor:pointer;
          font-weight:600; font-size:13px; transition:all 0.3s ease;
          color:rgba(255,255,255,0.5); font-family:'DM Sans',sans-serif;
        }
        .role-tab.active { background:#1D9E75; color:white; border-color:#1D9E75; }
        label { display:block; font-size:12px; font-weight:600; color:rgba(255,255,255,0.5); margin-bottom:6px; letter-spacing:1px; text-transform:uppercase; }
      `}</style>

      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "16px", padding: "48px 40px",
        width: "100%", maxWidth: "420px",
        backdropFilter: "blur(20px)",
        animation: "slideUp 0.5s ease",
        position: "relative", overflow: "hidden"
      }}>
        {/* Top accent line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, #1D9E75, transparent)" }} />

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "56px", height: "56px",
            background: "linear-gradient(135deg,#1D9E75,#0d7a5a)",
            borderRadius: "12px", display: "inline-flex",
            alignItems: "center", justifyContent: "center",
            marginBottom: "16px", fontSize: "24px"
          }}>🎓</div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "white", margin: "0 0 4px", letterSpacing: "1px" }}>ACADEMIQ</h1>
          <p style={{ color: "rgba(255,255,255,0.3)", margin: 0, fontSize: "13px", letterSpacing: "1px" }}>SIGN IN TO YOUR ACCOUNT</p>
        </div>

        {/* Role Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          <button className={`role-tab ${form.role === "student" ? "active" : ""}`}
            onClick={() => setForm({ ...form, role: "student" })}>
            👨‍🎓 Student
          </button>
          <button className={`role-tab ${form.role === "admin" ? "active" : ""}`}
            onClick={() => setForm({ ...form, role: "admin" })}>
            👨‍💼 Admin
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)",
            color: "#f87171", padding: "12px 16px", borderRadius: "8px",
            marginBottom: "16px", fontSize: "13px", animation: "shake 0.3s ease"
          }}>⚠️ {error}</div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label>Email Address</label>
            <input type="email" className="input-field" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required placeholder="you@example.com" />
          </div>
          <div>
            <label>Password</label>
            <input type="password" className="input-field" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="login-btn">
            {loading ? "⏳ Signing in..." : "Sign In →"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "13px", color: "rgba(255,255,255,0.3)", marginTop: "24px", marginBottom: 0 }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#1D9E75", fontWeight: "700", textDecoration: "none" }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}