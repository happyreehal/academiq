import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { API } from "../data/adminConstants";
import AuthLogo from "../components/auth/AuthLogo";
import "../styles/auth.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ 
    email: "", 
    password: "", 
    role: "student" 
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await axios.post(`${API}/auth/login`, form);
      
      // Save user info
      login({
        name: res.data.name,
        role: res.data.role,
        is_super: res.data.is_super,
        email: form.email,
      }, res.data.token);
      
      // Redirect based on role
      if (res.data.role === "admin") navigate("/admin");
      else navigate("/student");
      
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        
        {/* Top Accent Line */}
        <div className="auth-card-accent" />

        {/* Logo Header */}
        <AuthLogo subtitle="SIGN IN TO YOUR ACCOUNT" />

        {/* Role Tabs */}
        <div className="role-tabs">
          <button 
            className={`role-tab ${form.role === "student" ? "active" : ""}`}
            onClick={() => setForm({ ...form, role: "student" })}
          >
            👨‍🎓 Student
          </button>
          <button 
            className={`role-tab ${form.role === "admin" ? "active" : ""}`}
            onClick={() => setForm({ ...form, role: "admin" })}
          >
            👨‍💼 Admin
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="auth-error">
            ⚠️ {error}
          </div>
        )}

        {/* Login Form */}
        <form 
          onSubmit={handleSubmit} 
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <div>
            <label className="auth-label">Email Address</label>
            <input 
              type="email" 
              className="auth-input" 
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required 
              placeholder="you@example.com" 
            />
          </div>
          
          <div>
            <label className="auth-label">Password</label>
            <input 
              type="password" 
              className="auth-input" 
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required 
              placeholder="••••••••" 
            />
          </div>
          
          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? "⏳ Signing in..." : "Sign In →"}
          </button>
        </form>

        {/* Footer */}
        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">Register here</Link>
        </p>
      </div>
    </div>
  );
}