import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API } from "../data/adminConstants";
import AuthLogo from "../components/auth/AuthLogo";
import RegisterForm from "../components/auth/RegisterForm";
import OtpVerification from "../components/auth/OtpVerification";
import "../styles/auth.css";

export default function Register() {
  const navigate = useNavigate();
  
  // States
  const [step, setStep] = useState(1);  // 1=form, 2=otp
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
        if (prev <= 1) { 
          clearInterval(interval); 
          return 0; 
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ============ STEP 1: SEND OTP ============
  
  const handleSendOtp = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.email || !form.password) {
      setError("Please fill all required fields"); 
      return;
    }
    if (form.role === "admin" && !form.admin_code) {
      setError("Admin secret code required"); 
      return;
    }
    
    setLoading(true); 
    setError(""); 
    setSuccess("");
    
    try {
      await axios.post(`${API}/auth/send-otp`, {
        email: form.email, 
        name: form.name, 
        role: form.role
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
    
    setLoading(true); 
    setError(""); 
    setSuccess("");
    
    try {
      await axios.post(`${API}/auth/send-otp`, {
        email: form.email, 
        name: form.name, 
        role: form.role
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
    
    if (otp.length !== 6) { 
      setError("Enter 6 digit OTP"); 
      return; 
    }
    
    setLoading(true); 
    setError(""); 
    setSuccess("");
    
    try {
      // Verify OTP
      await axios.post(`${API}/auth/verify-otp`, {
        email: form.email, 
        otp, 
        role: form.role
      });
      // Register
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
    setStep(1); 
    setOtp(""); 
    setError(""); 
    setSuccess("");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        
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
        {error && <div className="auth-error">⚠️ {error}</div>}
        
        {/* Success Message */}
        {success && <div className="auth-success">✅ {success}</div>}

        {/* Step 1: Registration Form */}
        {step === 1 && (
          <RegisterForm 
            form={form}
            setForm={setForm}
            loading={loading}
            onSubmit={handleSendOtp}
          />
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
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
        )}

        {/* Footer Link */}
        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}