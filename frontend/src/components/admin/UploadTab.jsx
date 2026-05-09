import { useState } from "react";
import { SEMESTERS } from "../../data/adminConstants";

const MAX_FILE_SIZE_MB = 10;

export default function UploadTab({ departments, deptCourses, subjects, uploadPaper }) {
  const [form, setForm] = useState({ 
    department: "", course: "", semester: "", 
    subject: "", academic_year: "", file: null 
  });
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [uploadErr, setUploadErr] = useState("");

  const uploadCourses = form.department ? (deptCourses[form.department] || []) : [];
  const uploadSubjects = (form.department && form.course && form.semester)
    ? ((subjects[form.department]?.[form.course]?.[form.semester]) || [])
    : [];

  // ✅ Fix 3 — auto clear messages
  const showMsg = (msg) => {
    setUploadMsg(msg);
    setTimeout(() => setUploadMsg(""), 4000);
  };
  const showErr = (msg) => {
    setUploadErr(msg);
    setTimeout(() => setUploadErr(""), 4000);
  };

  // ✅ Fix 1 — file validation
  const validateFile = (file) => {
    if (!file) return "No file selected";
    if (!file.name.endsWith(".pdf")) return "Only PDF files allowed";
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) return `File too large. Max ${MAX_FILE_SIZE_MB}MB`;
    return null;
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    const fileError = validateFile(form.file);
    if (fileError) { showErr(fileError); return; }

    setUploading(true);
    setUploadMsg(""); 
    setUploadErr("");

    const data = new FormData();
    data.append("department", form.department);
    data.append("class_name", form.course);
    data.append("semester", form.semester);
    data.append("subject", form.subject);
    data.append("academic_year", form.academic_year);
    data.append("file", form.file);

    const result = await uploadPaper(data);
    
    if (result.success) {
      showMsg(result.message);
      setForm({ department: "", course: "", semester: "", subject: "", academic_year: "", file: null });
    } else {
      showErr(result.message);
    }
    
    setUploading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (!f) return;
    const err = validateFile(f);
    if (err) { showErr(err); return; }
    setForm({ ...form, file: f });
  };

  // ✅ Fix 2 — current year dynamic
  const currentYear = new Date().getFullYear();

  return (
    <div className="card">
      <h2 className="card-title">📤 Upload Question Paper</h2>
      
      {uploadMsg && <div className="alert alert-success">✅ {uploadMsg}</div>}
      {uploadErr && <div className="alert alert-error">⚠️ {uploadErr}</div>}
      
      <form onSubmit={handleUpload} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {/* Department */}
          <div>
            <label className="label-text">Department</label>
            <select 
              className="form-input" 
              value={form.department} 
              onChange={e => setForm({ ...form, department: e.target.value, course: "", semester: "", subject: "" })} 
              required
              disabled={uploading}
            >
              <option value="">Select Department</option>
              {departments.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>

          {/* Course */}
          <div>
            <label className="label-text">Course</label>
            <select 
              className="form-input" 
              value={form.course} 
              onChange={e => setForm({ ...form, course: e.target.value, semester: "", subject: "" })} 
              required 
              disabled={!form.department || uploading}
            >
              <option value="">{form.department ? "Select Course" : "Select Dept first"}</option>
              {uploadCourses.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Semester */}
          <div>
            <label className="label-text">Semester</label>
            <select 
              className="form-input" 
              value={form.semester} 
              onChange={e => setForm({ ...form, semester: e.target.value, subject: "" })} 
              required 
              disabled={!form.course || uploading}
            >
              <option value="">{form.course ? "Select Semester" : "Select Course first"}</option>
              {SEMESTERS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Academic Year */}
          <div>
            <label className="label-text">Academic Year</label>
            <input 
              type="number" 
              className="form-input" 
              value={form.academic_year} 
              onChange={e => setForm({ ...form, academic_year: e.target.value })} 
              required 
              placeholder="e.g. 2024" 
              min="2000" 
              max={currentYear + 1}
              disabled={uploading}
            />
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="label-text">Subject</label>
          <select 
            className="form-input" 
            value={form.subject} 
            onChange={e => setForm({ ...form, subject: e.target.value })} 
            required 
            disabled={!form.semester || uploading}
          >
            <option value="">
              {form.semester 
                ? (uploadSubjects.length > 0 ? "Select Subject" : "No subjects — add in Settings") 
                : "Select Semester first"}
            </option>
            {uploadSubjects.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* PDF Drop Zone */}
        <div>
          <label className="label-text">Upload PDF (Max {MAX_FILE_SIZE_MB}MB)</label>
          <div 
            className={`drop-zone ${dragOver ? "active" : ""}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <input 
              id="fileInput" 
              type="file" 
              accept=".pdf" 
              style={{ display: "none" }} 
              onChange={e => {
                const f = e.target.files[0];
                const err = validateFile(f);
                if (err) { showErr(err); return; }
                setForm({ ...form, file: f });
              }} 
            />
            
            {form.file ? (
              <div>
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>📄</div>
                <div style={{ color: "#1D9E75", fontWeight: "500" }}>{form.file.name}</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginTop: "6px" }}>
                  {(form.file.size / 1024 / 1024).toFixed(2)} MB • Click to change
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: "32px", marginBottom: "12px", opacity: 0.7 }}>☁️</div>
                <div style={{ color: "white", fontWeight: "400", letterSpacing: "1px" }}>
                  Drag & drop PDF here
                </div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginTop: "6px" }}>
                  or click to browse
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <button 
          type="submit" 
          disabled={uploading} 
          className="btn-accent" 
          style={{ marginTop: "10px" }}
        >
          {uploading ? "⏳ Uploading..." : "📤 Upload Paper"}
        </button>
      </form>
    </div>
  );
}