export default function AuthLogo({ subtitle = "SIGN IN TO YOUR ACCOUNT" }) {
  return (
    <div className="auth-logo-wrapper">
      <div className="auth-logo-icon">🎓</div>
      <h1 className="auth-logo-title">ACADEMIQ</h1>
      <p className="auth-logo-subtitle">{subtitle}</p>
    </div>
  );
}