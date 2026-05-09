export default function PdfUploadCard({ 
  icon, 
  title, 
  subtitle, 
  optional = false, 
  file, 
  onFileChange 
}) {
  return (
    <div className="ai-card">
      
      {/* Title */}
      <h2 className="ai-card-title">
        {icon} {title}
        {optional && (
          <span className="ai-card-optional"> (Optional)</span>
        )}
      </h2>

      {/* Subtitle */}
      <p className="ai-card-subtitle">{subtitle}</p>

      {/* File Input */}
      <input 
        type="file" 
        accept=".pdf" 
        onChange={(e) => onFileChange(e.target.files[0])} 
        className="ai-file-input"
      />

      {/* Success Message */}
      {file && (
        <p className="ai-file-success">
          ✓ {file.name}
        </p>
      )}
    </div>
  );
}