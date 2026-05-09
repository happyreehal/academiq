import { useState } from "react";

export default function SuperAdminTab({ currentSecret, updateSecret }) {
  const [newSecret, setNewSecret] = useState("");

  const handleUpdate = async () => {
    const success = await updateSecret(newSecret);
    if (success) {
      setNewSecret("");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* Change Secret Key Card */}
      <div 
        className="card" 
        style={{ 
          borderColor: "rgba(139,92,246,0.3)", 
          background: "linear-gradient(135deg, rgba(139,92,246,0.02), transparent)" 
        }}
      >
        <h2 className="card-title" style={{ color: "#A78BFA", marginBottom: "8px" }}>
          🔐 Change Admin Secret Key
        </h2>
        <p style={{ 
          color: "rgba(255,255,255,0.5)", 
          fontSize: "13px", 
          margin: "0 0 28px", 
          fontWeight: "300" 
        }}>
          Yeh key admin registration ke waqt required hogi.
        </p>

        {/* Current Secret Display */}
        <div style={{ 
          background: "rgba(139,92,246,0.05)", 
          border: "1px solid rgba(139,92,246,0.2)", 
          borderRadius: "4px", 
          padding: "20px", 
          marginBottom: "28px" 
        }}>
          <div style={{ 
            fontSize: "11px", 
            fontWeight: "600", 
            color: "rgba(167,139,250,0.8)", 
            marginBottom: "8px", 
            letterSpacing: "1px", 
            textTransform: "uppercase" 
          }}>
            Current Secret Key:
          </div>
          <div style={{ 
            fontFamily: "monospace", 
            fontSize: "18px", 
            color: "white", 
            letterSpacing: "2px" 
          }}>
            {currentSecret || "Loading..."}
          </div>
        </div>

        {/* Update Secret Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label className="label-text">New Secret Key (min 8 characters)</label>
            <input 
              type="text" 
              className="form-input" 
              value={newSecret} 
              onChange={e => setNewSecret(e.target.value)} 
              placeholder="Enter new secret key" 
            />
          </div>
          <button 
            className="btn-purple" 
            onClick={handleUpdate} 
            style={{ alignSelf: "flex-start", marginTop: "8px" }}
          >
            🔄 Update Secret Key
          </button>
        </div>
      </div>

      {/* Warning Box */}
      <div style={{ 
        background: "rgba(239,68,68,0.05)", 
        borderRadius: "4px", 
        border: "1px solid rgba(239,68,68,0.2)", 
        padding: "24px" 
      }}>
        <h3 style={{ 
          color: "#EF4444", 
          fontSize: "14px", 
          fontWeight: "600", 
          margin: "0 0 10px", 
          letterSpacing: "1px", 
          textTransform: "uppercase" 
        }}>
          ⚠️ Important
        </h3>
        <p style={{ 
          color: "rgba(239,68,68,0.8)", 
          fontSize: "13px", 
          margin: 0, 
          lineHeight: "1.6", 
          fontWeight: "300" 
        }}>
          Key change karne ke baad existing admins affect nahi honge. Sirf nayi registrations ke liye nayi key required hogi.
        </p>
      </div>
    </div>
  );
}