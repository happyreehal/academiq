import { useRef } from "react";

const MAX_SIZE_MB = 10;

export default function PdfUploadCard({ 
  icon, title, subtitle, 
  optional = false, 
  file, onFileChange 
}) {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    // ✅ Fix 1 — file size validation
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`File too large. Max ${MAX_SIZE_MB}MB allowed.`);
      e.target.value = "";
      return;
    }
    onFileChange(f);
  };

  // ✅ Fix 2 — file clear hone pe input reset
  const handleClear = () => {
    onFileChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="ai-card">
      
      {/* Title */}
      <h2 className="ai-card-title">
        {icon} {title}
        {optional && <span className="ai-card-optional"> (Optional)</span>}
      </h2>

      {/* Subtitle */}
      <p className="ai-card-subtitle">{subtitle}</p>

      {/* File Input */}
      <input 
        ref={inputRef}
        type="file" 
        accept=".pdf" 
        onChange={handleChange} 
        className="ai-file-input"
      />

      {/* Success Message + Clear */}
      {file && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "8px" }}>
          <p className="ai-file-success" style={{ margin: 0 }}>
            ✓ {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
          <button
            onClick={handleClear}
            style={{
              background: "none", border: "none",
              color: "rgba(255,255,255,0.3)", cursor: "pointer",
              fontSize: "16px", padding: 0,
              transition: "color 0.2s",
            }}
            onMouseOver={e => e.target.style.color = "#EF4444"}
            onMouseOut={e => e.target.style.color = "rgba(255,255,255,0.3)"}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}