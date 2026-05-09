export default function PaperCard({ paper, viewUrl, downloadUrl }) {
  return (
    <div className="student-paper-card">
      
      {/* Paper Info */}
      <div>
        <div className="paper-title">
          {paper.subject ?? "Unknown"} — <span className="paper-year">{paper.academic_year ?? "N/A"}</span>
        </div>
        <div className="paper-meta">
          {paper.department ?? "—"} · {paper.class_name ?? "—"} · {paper.semester ?? "—"} Semester
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <a 
          href={viewUrl || "#"} 
          target="_blank" 
          rel="noreferrer" 
          className="btn-view"
        >
          👁️ View
        </a>
        <a 
          href={downloadUrl || "#"} 
          target="_blank" 
          rel="noreferrer" 
          className="btn-download"
        >
          ⬇️ Download
        </a>
      </div>
    </div>
  );
}