export default function RegisterForm({ form, setForm, loading, onSubmit }) {
  return (
    <>
      {/* Role Tabs */}
      <div className="role-tabs">
        <button 
          className={`role-tab ${form.role === "student" ? "active" : ""}`}
          onClick={() => setForm({ ...form, role: "student", admin_code: "" })}
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

      {/* Form */}
      <form 
        onSubmit={onSubmit} 
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <div>
          <label className="auth-label">Full Name</label>
          <input 
            type="text" 
            className="auth-input" 
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} 
            required 
            placeholder="Your full name" 
          />
        </div>

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
          <label className="auth-label">College ID (Optional)</label>
          <input 
            type="text" 
            className="auth-input" 
            value={form.college_id}
            onChange={e => setForm({ ...form, college_id: e.target.value })} 
            placeholder="e.g. CSE2024001" 
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

        {/* Admin Code (only if admin selected) */}
        {form.role === "admin" && (
          <div className="admin-code-box">
            <label className="auth-label">🔐 Admin Secret Code</label>
            <input 
              type="password" 
              className="auth-input" 
              value={form.admin_code}
              onChange={e => setForm({ ...form, admin_code: e.target.value })}
              required={form.role === "admin"} 
              placeholder="Enter admin secret code" 
            />
            <p className="admin-code-hint">
              Contact your institution admin for the secret code
            </p>
          </div>
        )}

        <button type="submit" disabled={loading} className="auth-btn">
          {loading ? "⏳ Sending OTP..." : "Send Verification OTP →"}
        </button>
      </form>
    </>
  );
}