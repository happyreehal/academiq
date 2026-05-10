import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { API } from "../data/adminConstants";
import AuthLogo from "../components/auth/AuthLogo";
import OtpInput from "../components/auth/OtpInput";
import "../styles/auth.css";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const startTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  // ============ STEP 1: Send OTP ============
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess("");
    try {
      await axios.post(`${API}/auth/forgot-password`, { email, role });
      setStep(2);
      setSuccess("OTP sent to your email!");
      startTimer();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ============ STEP 2: Verify OTP ============
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) { setError("Enter 6 digit OTP"); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      // ✅ type: "reset" add kiya
      await axios.post(`${API}/auth/verify-otp`, { 
        email, otp, role, type: "reset" 
      });
      setStep(3);
      setSuccess("OTP verified! Set your new password.");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // ============ STEP 3: Reset Password ============
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) { setError("Min 8 characters required"); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      await axios.post(`${API}/auth/reset-password`, {
        email, otp, role, new_password: newPassword
      });
      setSuccess("Password reset successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.detail || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  // ============ RESEND OTP ============
  const handleResend = async () => {
    if (resendTimer > 0) return;
    setLoading(true); setError(""); setSuccess("");
    try {
      await axios.post(`${API}/auth/forgot-password`, { email, role });
      setSuccess("OTP resent!");
      startTimer();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to resend");
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
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", top: "10%", left: "8%", fontSize: "50px", opacity: 0.06, pointerEvents: "none" }}
      >🔒</motion.div>
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", bottom: "10%", right: "8%", fontSize: "50px", opacity: 0.06, pointerEvents: "none" }}
      >🔑</motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="auth-card"
      >
        <div className="auth-card-accent" />

        <AuthLogo subtitle={
          step === 1 ? "RESET YOUR PASSWORD" :
          step === 2 ? "VERIFY YOUR EMAIL" :
          "SET NEW PASSWORD"
        } />

        {/* Progress */}
        <div className="progress-bar">
          <div className="progress-step active" />
          <div className={`progress-step ${step >= 2 ? "active" : ""}`} />
          <div className={`progress-step ${step === 3 ? "active" : ""}`} />
        </div>

        {/* Error / Success */}
        {error && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="auth-error">
            ⚠️ {error}
          </motion.div>
        )}
        {success && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="auth-success">
            ✅ {success}
          </motion.div>
        )}

        {/* STEP 1 — Email */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="role-tabs">
              <button type="button" className={`role-tab ${role === "student" ? "active" : ""}`} onClick={() => setRole("student")}>
                👨‍🎓 Student
              </button>
              <button type="button" className={`role-tab ${role === "admin" ? "active" : ""}`} onClick={() => setRole("admin")}>
                👨‍💼 Admin
              </button>
            </div>

            <div>
              <label className="auth-label">Registered Email</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "15px" }}>✉️</span>
                <input
                  type="email" className="auth-input"
                  value={email} onChange={e => setEmail(e.target.value)}
                  required placeholder="you@example.com"
                  style={{ paddingLeft: "40px" }}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit" disabled={loading} className="auth-btn"
            >
              {loading ? "⏳ Sending OTP..." : "Send Reset OTP →"}
            </motion.button>
          </form>
        )}

        {/* STEP 2 — OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="otp-email-box">
              <div className="otp-email-icon">📧</div>
              <p className="otp-email-text">
                OTP sent to<br />
                <strong style={{ color: "white" }}>
                  {email?.replace(/(.{2})(.*)(@.*)/, "$1***$3")}
                </strong>
              </p>
            </div>

            <div>
              <label className="auth-label" style={{ textAlign: "center", display: "block" }}>
                Enter 6-Digit OTP
              </label>
              <OtpInput length={6} value={otp} onChange={setOtp} />
              <p style={{ textAlign: "center", fontSize: "12px", color: "rgba(255,255,255,0.25)", marginTop: "8px" }}>
                OTP valid for 10 minutes
              </p>
            </div>

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              type="submit" disabled={loading || otp.length !== 6} className="auth-btn"
            >
              {loading ? "⏳ Verifying..." : "✅ Verify OTP"}
            </motion.button>

            <div style={{ textAlign: "center" }}>
              <button type="button" onClick={handleResend} disabled={resendTimer > 0 || loading} className="btn-resend">
                {resendTimer > 0 ? `🔄 Resend in ${resendTimer}s` : "🔄 Resend OTP"}
              </button>
            </div>

            <button type="button" onClick={() => { setStep(1); setOtp(""); setError(""); }} className="btn-back-step">
              ← Change Email
            </button>
          </form>
        )}

        {/* STEP 3 — New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label className="auth-label">New Password</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "15px" }}>🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="auth-input"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required minLength={8}
                  placeholder="Min 8 characters"
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
              {newPassword.length > 0 && newPassword.length < 8 && (
                <p style={{ color: "#EF4444", fontSize: "11px", marginTop: "6px" }}>
                  {8 - newPassword.length} more characters needed
                </p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit" disabled={loading || newPassword.length < 8} className="auth-btn"
            >
              {loading ? "⏳ Resetting..." : "🔒 Reset Password"}
            </motion.button>
          </form>
        )}

        <p className="auth-footer">
          Yaad aa gaya?{" "}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
        <p className="auth-footer">Also check OTP in spam folder </p>
      </motion.div>
    </div>
  );
}