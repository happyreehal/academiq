import { useState } from "react";
import { API, SEMESTERS } from "../../data/adminConstants";

export default function PapersTab({ papers, departments, deletePaper }) {
  const [filterDept, setFilterDept] = useState("");
  const [filterSem, setFilterSem] = useState("");

  // Filter papers based on selections
  const filteredPapers = papers.filter(p => {
    if (filterDept && p.department !== filterDept) return false;
    if (filterSem && p.semester !== filterSem) return false;
    return true;
  });

  // URL Helpers
  const viewUrl = (url) => {
    const cleanUrl = url
      .replace("/image/upload/fl_attachment/", "/raw/upload/")
      .replace("/image/upload/", "/raw/upload/");
    return `https://docs.google.com/viewer?url=${encodeURIComponent(cleanUrl)}`;
  };

  const downloadUrl = (url) => {
    return `${API}/papers/download?url=${encodeURIComponent(url)}`;
  };

  return (
    <div className="card">
      {/* Header */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "24px" 
      }}>
        <h2 className="card-title" style={{ margin: 0 }}>📋 Manage Papers</h2>
        <span style={{ 
          background: "rgba(29,158,117,0.1)", 
          border: "1px solid rgba(29,158,117,0.3)", 
          color: "#1D9E75", 
          borderRadius: "2px", 
          padding: "6px 14px", 
          fontSize: "12px", 
          fontWeight: "500", 
          letterSpacing: "1px" 
        }}>
          {filteredPapers.length} PAPERS
        </span>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "28px" }}>
        <select 
          className="form-input" 
          value={filterDept} 
          onChange={e => setFilterDept(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map(d => <option key={d}>{d}</option>)}
        </select>
        <select 
          className="form-input" 
          value={filterSem} 
          onChange={e => setFilterSem(e.target.value)}
        >
          <option value="">All Semesters</option>
          {SEMESTERS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Papers List */}
      {filteredPapers.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "60px", 
          color: "rgba(255,255,255,0.3)" 
        }}>
          <div style={{ fontSize: "40px", opacity: 0.5, marginBottom: "12px" }}>📭</div>
          <div style={{ fontWeight: "300", letterSpacing: "1px" }}>No papers found</div>
        </div>
      ) : (
        filteredPapers.map((paper, idx) => (
          <div key={idx} className="paper-card">
            {/* Paper Info */}
            <div>
              <div style={{ 
                fontWeight: "500", 
                color: "white", 
                fontSize: "15px", 
                marginBottom: "6px" 
              }}>
                {paper.subject} — <span style={{ color: "#1D9E75" }}>{paper.academic_year}</span>
              </div>
              <div style={{ 
                color: "rgba(255,255,255,0.5)", 
                fontSize: "12px", 
                marginBottom: "4px", 
                letterSpacing: "0.5px" 
              }}>
                {paper.department} | {paper.class_name} | {paper.semester} Semester
              </div>
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>
                By: {paper.uploaded_by}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "12px" }}>
              <a 
                href={viewUrl(paper.file_url)} 
                target="_blank" 
                rel="noreferrer"
                style={{
                  padding: "8px 16px", 
                  background: "rgba(29,158,117,0.1)", 
                  color: "#1D9E75", 
                  borderRadius: "4px", 
                  fontSize: "12px", 
                  fontWeight: "500", 
                  textDecoration: "none", 
                  border: "1px solid rgba(29,158,117,0.3)", 
                  transition: "all 0.3s"
                }}
              >
                👁️ View
              </a>
              
              <a 
                href={downloadUrl(paper.file_url)} 
                target="_blank" 
                rel="noreferrer"
                style={{
                  padding: "8px 16px", 
                  background: "linear-gradient(135deg, #1D9E75, #0d7a5a)", 
                  color: "white", 
                  borderRadius: "4px", 
                  fontSize: "12px", 
                  fontWeight: "500", 
                  textDecoration: "none", 
                  border: "none", 
                  transition: "all 0.3s"
                }}
              >
                ⬇️ Download
              </a>
              
              <button 
                className="btn-danger" 
                onClick={() => deletePaper(paper.public_id)}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}