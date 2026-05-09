import { useRef, useState, useEffect } from "react";

export default function OtpInput({ length = 6, value = "", onChange }) {
  const inputsRef = useRef([]);
  const [otp, setOtp] = useState(new Array(length).fill(""));

  // Parent se reset handle karo (e.g resend OTP pe)
  useEffect(() => {
    if (value === "") {
      setOtp(new Array(length).fill(""));
      inputsRef.current[0]?.focus();
    }
  }, [value]);

  const focusInput = (index) => {
    inputsRef.current[index]?.focus();
  };

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return; // sirf numbers

    const newOtp = [...otp];
    newOtp[index] = val.slice(-1); // last char lo (overwrite support)
    setOtp(newOtp);
    onChange(newOtp.join(""));

    // Auto next box
    if (val && index < length - 1) focusInput(index + 1);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
        onChange(newOtp.join(""));
      } else if (index > 0) {
        newOtp[index - 1] = "";
        setOtp(newOtp);
        onChange(newOtp.join(""));
        focusInput(index - 1);
      }
    }
    if (e.key === "ArrowLeft" && index > 0) focusInput(index - 1);
    if (e.key === "ArrowRight" && index < length - 1) focusInput(index + 1);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!pasted) return;

    const newOtp = new Array(length).fill("");
    for (let i = 0; i < pasted.length; i++) newOtp[i] = pasted[i];
    setOtp(newOtp);
    onChange(newOtp.join(""));
    focusInput(Math.min(pasted.length, length - 1));
  };

  return (
    <div className="otp-boxes-container">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={`otp-box ${digit ? "otp-box--filled" : ""}`}
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
}