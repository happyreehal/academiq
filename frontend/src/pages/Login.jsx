import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { API } from "../data/adminConstants";
import AuthLogo from "../components/auth/AuthLogo";
import "../styles/auth.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ 
    email: "", password: "", role: "student" 
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      setError(err.response?.data?.detail || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ position: "relative", overflow: "hidden" }}>

      {/* Background Glows */}
      <div style={{
        position: "absolute", top: "-200px", left: "-200px",
        width: "600px", height: "600px",
        background: "radial-gradient(circle, rgba(29,158,117,0.08) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-200px", right: "-200px",
        width: "500px", height: "500px",
        background: "radial-gradient(circle, rgba(29,158,117,0.06) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />

      {/* Floating Icons */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", top: "10%", left: "8%", fontSize: "50px", opacity: 0.06, pointerEvents: "none" }}
      >📚</motion.div>
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", bottom: "10%", right: "8%", fontSize: "50px", opacity: 0.06, pointerEvents: "none" }}
      >🎓</motion.div>
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", top: "50%", right: "5%", fontSize: "40px", opacity: 0.04, pointerEvents: "none" }}
      >📝</motion.div>

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="auth-card"
      >
        <div className="auth-card-accent" />
        <AuthLogo subtitle="SIGN IN TO YOUR ACCOUNT" />

        {/* Role Tabs */}
        <div className="role-tabs">
          <button className={`role-tab ${form.role === "student" ? "active" : ""}`} onClick={() => setForm({ ...form, role: "student" })}>
            👨‍🎓 Student
          </button>
          <button className={`role-tab ${form.role === "admin" ? "active" : ""}`} onClick={() => setForm({ ...form, role: "admin" })}>
            👨‍💼 Admin
          </button>
        </div>

        {/* Error */}
        {error && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="auth-error">
            ⚠️ {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Email */}
          <div>
            <label className="auth-label">Email Address</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "15px" }}>✉️</span>
              <input 
                type="email" className="auth-input" 
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required placeholder="you@example.com"
                style={{ paddingLeft: "40px" }}
              />
            </div>
          </div>
          
          {/* Password */}
          <div>
            <label className="auth-label">Password</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "15px" }}>🔒</span>
              <input 
                type={showPassword ? "text" : "password"}
                className="auth-input" 
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required placeholder="••••••••"
                style={{ paddingLeft: "40px", paddingRight: "44px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute", right: "14px", top: "50%",
                  transform: "translateY(-50%)", background: "none",
                  border: "none", cursor: "pointer", fontSize: "16px",
                  color: "rgba(255,255,255,0.3)", padding: 0,
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div style={{ textAlign: "right", marginTop: "-8px" }}>
            <Link to="/forgot-password" className="auth-link" style={{ fontSize: "12px" }}>
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            type="submit" disabled={loading} className="auth-btn"
            style={{ marginTop: "4px" }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <span style={{
                  width: "14px", height: "14px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "white", borderRadius: "50%",
                  display: "inline-block", animation: "spin 0.8s linear infinite",
                }} />
                Signing in...
              </span>
            ) : "Sign In →"}
          </motion.button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0 4px" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px", letterSpacing: "1px" }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
        </div>

        {/* ✅ Spam Note */}
        <p style={{ 
          textAlign: "center", fontSize: "11px", 
          color: "rgba(255,255,255,0.2)", marginTop: "12px" 
        }}>
          📧 Also check OTP in email spam folder
        </p>

        {/* Footer */}
        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">Register here</Link>
        </p>
      </motion.div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}