import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { API } from "../data/adminConstants";
import AuthLogo from "../components/auth/AuthLogo";
import RegisterForm from "../components/auth/RegisterForm";
import OtpVerification from "../components/auth/OtpVerification";
import "../styles/auth.css";

export default function Register() {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", 
    email: "", 
    password: "", 
    role: "student",
    college_id: "", 
    admin_code: "",
  });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // ============ TIMER ============
  const startTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  // ============ STEP 1: SEND OTP ============
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

  // ============ RESEND OTP ============
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

  // ============ STEP 2: VERIFY & REGISTER ============
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) { setError("Enter 6 digit OTP"); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      await axios.post(`${API}/auth/verify-otp`, {
        email: form.email, otp, role: form.role
      });
      await axios.post(`${API}/auth/register`, form);
      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.detail || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // ============ BACK TO STEP 1 ============
  const handleBackToForm = () => {
    setStep(1); setOtp(""); setError(""); setSuccess("");
  };

  return (
    <div className="auth-page" style={{ position: "relative", overflow: "hidden" }}>

      {/* Background Glow Top Right */}
      <div style={{
        position: "absolute", top: "-200px", right: "-200px",
        width: "600px", height: "600px",
        background: "radial-gradient(circle, rgba(29,158,117,0.08) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />

      {/* Background Glow Bottom Left */}
      <div style={{
        position: "absolute", bottom: "-200px", left: "-200px",
        width: "500px", height: "500px",
        background: "radial-gradient(circle, rgba(29,158,117,0.06) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />

      {/* Floating Icons */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", top: "10%", right: "8%",
          fontSize: "50px", opacity: 0.06, pointerEvents: "none",
        }}
      >🎓</motion.div>

      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", bottom: "10%", left: "8%",
          fontSize: "50px", opacity: 0.06, pointerEvents: "none",
        }}
      >📚</motion.div>

      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", top: "50%", left: "5%",
          fontSize: "40px", opacity: 0.04, pointerEvents: "none",
        }}
      >✏️</motion.div>

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="auth-card"
      >
        {/* Top Accent Line */}
        <div className="auth-card-accent" />

        {/* Logo Header */}
        <AuthLogo 
          subtitle={step === 1 ? "CREATE YOUR ACCOUNT" : "VERIFY YOUR EMAIL"} 
        />

        {/* Progress Indicator */}
        <div className="progress-bar">
          <div className="progress-step active" />
          <div className={`progress-step ${step === 2 ? "active" : ""}`} />
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="auth-error"
          >
            ⚠️ {error}
          </motion.div>
        )}
        
        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="auth-success"
          >
            ✅ {success}
          </motion.div>
        )}

        {/* Step 1: Registration Form */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <RegisterForm 
              form={form}
              setForm={setForm}
              loading={loading}
              onSubmit={handleSendOtp}
            />
          </motion.div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <OtpVerification 
              email={form.email}
              otp={otp}
              setOtp={setOtp}
              loading={loading}
              resendTimer={resendTimer}
              onSubmit={handleVerifyAndRegister}
              onResend={handleResendOtp}
              onBack={handleBackToForm}
            />
          </motion.div>
        )}

        {/* Footer Link */}
        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}