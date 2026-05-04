import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API = "https://academiq-jenb.onrender.com";

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=form, 2=otp
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "student",
    college_id: "", admin_code: "",
  });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
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

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("Please fill all required fields"); return;
    }
    if (form.role === "admin" && !form.admin_code) {
      setError("Admin secret code required"); return;
    }
    setLoading(true); setError(""); setSuccess("");
    try {
      await axios.post(`${API}/auth/send-otp`, {
        email: form.email, name: form.name, role: form.role
      });
      setStep(2);
      setSuccess(`OTP sent to ${form.email}`);
      startTimer();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setLoading(true); setError(""); setSuccess("");
    try {
      await axios.post(`${API}/auth/send-otp`, {
        email: form.email, name: form.name, role: form.role
      });
      setSuccess("OTP resent successfully!");
      startTimer();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) { setError("Enter 6 digit OTP"); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      // Step 1: Verify OTP
      await axios.post(`${API}/auth/verify-otp`, {
        email: form.email, otp, role: form.role
      });
      // Step 2: Register
      await axios.post(`${API}/auth/register`, form);
      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.detail || "Verification failed");
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
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        .input-field {
          width:100%; border:1px solid rgba(255,255,255,0.1); border-radius:8px;
          padding:12px 16px; font-size:14px; outline:none;
          transition:all 0.3s ease; box-sizing:border-box;
          background:rgba(255,255,255,0.05); color:white;
          font-family:'DM Sans',sans-serif;
        }
        .input-field::placeholder { color:rgba(255,255,255,0.25); }
        .input-field:focus { border-color:#1D9E75; background:rgba(255,255,255,0.08); box-shadow:0 0 0 3px rgba(29,158,117,0.15); }
        .reg-btn {
          width:100%; padding:14px;
          background:linear-gradient(135deg,#1D9E75,#0d7a5a);
          color:white; border:none; border-radius:8px;
          font-size:14px; font-weight:600; cursor:pointer;
          transition:all 0.3s ease; font-family:'DM Sans',sans-serif;
          letter-spacing:1px;
        }
        .reg-btn:hover { transform:translateY(-2px); box-shadow:0 8px 25px rgba(29,158,117,0.3); }
        .reg-btn:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
        .role-tab {
          flex:1; padding:10px; border:1px solid rgba(255,255,255,0.1);
          background:rgba(255,255,255,0.03); border-radius:8px; cursor:pointer;
          font-weight:600; font-size:13px; transition:all 0.3s ease;
          color:rgba(255,255,255,0.5); font-family:'DM Sans',sans-serif;
        }
        .role-tab.active { background:#1D9E75; color:white; border-color:#1D9E75; }
        .otp-input {
          width:100%; border:1px solid rgba(29,158,117,0.4); border-radius:8px;
          padding:18px; font-size:28px; outline:none; text-align:center;
          letter-spacing:16px; font-weight:700;
          transition:all 0.3s ease; box-sizing:border-box;
          background:rgba(29,158,117,0.05); color:#1D9E75;
          font-family:'DM Sans',sans-serif;
        }
        .otp-input:focus { border-color:#1D9E75; box-shadow:0 0 0 3px rgba(29,158,117,0.2); }
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
          <p style={{ color: "rgba(255,255,255,0.3)", margin: 0, fontSize: "13px", letterSpacing: "1px" }}>
            {step === 1 ? "CREATE YOUR ACCOUNT" : "VERIFY YOUR EMAIL"}
          </p>
        </div>

        {/* Progress indicator */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "28px" }}>
          <div style={{ flex: 1, height: "3px", borderRadius: "2px", background: "#1D9E75", transition: "all 0.3s" }} />
          <div style={{ flex: 1, height: "3px", borderRadius: "2px", background: step === 2 ? "#1D9E75" : "rgba(255,255,255,0.1)", transition: "all 0.3s" }} />
        </div>

        {/* Messages */}
        {error && (
          <div style={{
            background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)",
            color: "#f87171", padding: "12px 16px", borderRadius: "8px",
            marginBottom: "16px", fontSize: "13px", animation: "shake 0.3s ease"
          }}>⚠️ {error}</div>
        )}
        {success && (
          <div style={{
            background: "rgba(29,158,117,0.1)", border: "1px solid rgba(29,158,117,0.3)",
            color: "#1D9E75", padding: "12px 16px", borderRadius: "8px",
            marginBottom: "16px", fontSize: "13px"
          }}>✅ {success}</div>
        )}

        {/* STEP 1 — Registration Form */}
        {step === 1 && (
          <>
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
              <button className={`role-tab ${form.role === "student" ? "active" : ""}`}
                onClick={() => setForm({ ...form, role: "student", admin_code: "" })}>
                👨‍🎓 Student
              </button>
              <button className={`role-tab ${form.role === "admin" ? "active" : ""}`}
                onClick={() => setForm({ ...form, role: "admin" })}>
                👨‍💼 Admin
              </button>
            </div>

            <form onSubmit={handleSendOtp} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label>Full Name</label>
                <input type="text" className="input-field" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Your full name" />
              </div>

              <div>
                <label>Email Address</label>
                <input type="email" className="input-field" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="you@example.com" />
              </div>

              <div>
                <label>College ID (Optional)</label>
                <input type="text" className="input-field" value={form.college_id}
                  onChange={e => setForm({ ...form, college_id: e.target.value })} placeholder="e.g. CSE2024001" />
              </div>

              <div>
                <label>Password</label>
                <input type="password" className="input-field" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} required placeholder="••••••••" />
              </div>

              {form.role === "admin" && (
                <div style={{ background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.2)", borderRadius: "8px", padding: "16px" }}>
                  <label>🔐 Admin Secret Code</label>
                  <input type="password" className="input-field" value={form.admin_code}
                    onChange={e => setForm({ ...form, admin_code: e.target.value })}
                    required={form.role === "admin"} placeholder="Enter admin secret code" />
                  <p style={{ fontSize: "12px", color: "rgba(234,179,8,0.6)", marginTop: "6px", marginBottom: 0 }}>
                    Contact your institution admin for the secret code
                  </p>
                </div>
              )}

              <button type="submit" disabled={loading} className="reg-btn">
                {loading ? "⏳ Sending OTP..." : "Send Verification OTP →"}
              </button>
            </form>
          </>
        )}

        { /* STEP 2 — OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleVerifyAndRegister} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ textAlign: "center", padding: "16px", background: "rgba(29,158,117,0.05)", border: "1px solid rgba(29,158,117,0.15)", borderRadius: "8px" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>📧</div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", margin: 0 }}>
                OTP sent to<br />
                <strong style={{ color: "white" }}>{form.email}</strong>
              </p>
            </div>

            <div>
              <label style={{ textAlign: "center", display: "block" }}>Enter 6-Digit OTP</label>
              <input
                type="text" className="otp-input"
                value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="------" maxLength={6} required
              />
              <p style={{ textAlign: "center", fontSize: "12px", color: "rgba(255,255,255,0.25)", marginTop: "8px" }}>
                OTP valid for 10 minutes
              </p>
            </div>

            <button type="submit" disabled={loading || otp.length !== 6} className="reg-btn">
              {loading ? "⏳ Verifying..." : "✅ Verify & Create Account"}
            </button>

            <div style={{ textAlign: "center" }}>
              <button type="button" onClick={handleResendOtp} disabled={resendTimer > 0 || loading}
                style={{ background: "none", border: "none", cursor: resendTimer > 0 ? "not-allowed" : "pointer", color: resendTimer > 0 ? "rgba(255,255,255,0.2)" : "#1D9E75", fontSize: "13px", fontFamily: "'DM Sans',sans-serif" }}>
                {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
              </button>
            </div>

            <button type="button" onClick={() => { setStep(1); setOtp(""); setError(""); setSuccess(""); }}
              style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", padding: "10px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontFamily: "'DM Sans',sans-serif" }}>
              ← Change Details
            </button>
          </form>
        )}

        <p style={{ textAlign: "center", fontSize: "13px", color: "rgba(255,255,255,0.3)", marginTop: "24px", marginBottom: 0 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#1D9E75", fontWeight: "700", textDecoration: "none" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}