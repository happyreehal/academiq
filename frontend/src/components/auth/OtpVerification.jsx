import OtpInput from "./OtpInput"; // ← ADD THIS

export default function OtpVerification({ 
  email, 
  otp, 
  setOtp, 
  loading, 
  resendTimer,
  onSubmit, 
  onResend, 
  onBack 
}) {
  return (
    <form 
      onSubmit={onSubmit} 
      style={{ display: "flex", flexDirection: "column", gap: "20px" }}
    >
      {/* Email Display */}
      <div className="otp-email-box">
        <div className="otp-email-icon">📧</div>
        <p className="otp-email-text">
          OTP sent to<br />
          {/* Masked email for privacy */}
          <strong style={{ color: "white" }}>
            {email?.replace(/(.{2})(.*)(@.*)/, "$1***$3")}
          </strong>
        </p>
      </div>

      {/* ✅ OTP Input - 6 boxes (REPLACED single input) */}
      <div>
        <label className="auth-label" style={{ textAlign: "center", display: "block" }}>
          Enter 6-Digit OTP
        </label>

        <OtpInput
          length={6}
          value={otp}
          onChange={(val) => setOtp(val)}
        />

        <p style={{ 
          textAlign: "center", 
          fontSize: "12px", 
          color: "rgba(255,255,255,0.25)", 
          marginTop: "8px" 
        }}>
          OTP valid for 10 minutes
        </p>
      </div>

      {/* Verify Button */}
      <button 
        type="submit" 
        disabled={loading || otp.length !== 6} 
        className="auth-btn"
      >
        {loading ? "⏳ Verifying..." : "✅ Verify & Create Account"}
      </button>

      {/* Resend Button */}
      <div style={{ textAlign: "center" }}>
        <button 
          type="button" 
          onClick={onResend} 
          disabled={resendTimer > 0 || loading}
          className="btn-resend"
        >
          {resendTimer > 0 ? `🔄 Resend OTP in ${resendTimer}s` : "🔄 Resend OTP"}
        </button>
      </div>

      {/* Back Button */}
      <button 
        type="button" 
        onClick={onBack}
        className="btn-back-step"
      >
        ← Change Details
      </button>
    </form>
  );
}