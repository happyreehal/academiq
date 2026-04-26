import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API = "https://academiq-jenb.onrender.com";
const SEMESTERS = ["1st","2nd","3rd","4th","5th","6th","7th","8th"];
const token = () => localStorage.getItem("academiq_token");
const authH = () => ({ Authorization: `Bearer ${token()}` });

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upload");

  // Upload state
  const [form, setForm] = useState({ department:"", class_name:"", semester:"", subject:"", academic_year:"", file:null });
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [uploadErr, setUploadErr] = useState("");

  // Settings state
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState({});
  const [deptClasses, setDeptClasses] = useState({});
  const [newDept, setNewDept] = useState("");
  const [newClass, setNewClass] = useState("");
  const [newSubjDept, setNewSubjDept] = useState("");
  const [newSubj, setNewSubj] = useState("");
  const [mapDept, setMapDept] = useState("");
  const [mapClass, setMapClass] = useState("");
  const [settingsMsg, setSettingsMsg] = useState("");

  // Students state
  const [students, setStudents] = useState([]);
  const [studentsLoaded, setStudentsLoaded] = useState(false);

  // Papers state
  const [papers, setPapers] = useState([]);
  const [papersLoaded, setPapersLoaded] = useState(false);
  const [papersMsg, setPapersMsg] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterSem, setFilterSem] = useState("");

  useEffect(() => { fetchSettings(); }, []);
  useEffect(() => { if (activeTab === "students" && !studentsLoaded) fetchStudents(); }, [activeTab]);
  useEffect(() => { if (activeTab === "papers") fetchPapers(); }, [activeTab]);

  async function fetchSettings() {
    try {
      const [d, c, s, dc] = await Promise.all([
        axios.get(`${API}/settings/departments`),
        axios.get(`${API}/settings/classes`),
        axios.get(`${API}/settings/subjects`),
        axios.get(`${API}/settings/dept-classes`),
      ]);
      setDepartments(d.data.departments);
      setClasses(c.data.classes);
      setSubjects(s.data.subjects);
      setDeptClasses(dc.data.dept_classes);
    } catch (_) {}
  }

  async function fetchStudents() {
    try {
      const res = await axios.get(`${API}/settings/students`, { headers: authH() });
      setStudents(res.data.students);
      setStudentsLoaded(true);
    } catch (_) {}
  }

  async function fetchPapers() {
    try {
      const res = await axios.get(`${API}/papers/all`, { headers: authH() });
      setPapers(res.data.papers);
      setPapersLoaded(true);
    } catch (_) {}
  }

  async function deletePaper(public_id) {
    if (!window.confirm("Delete this paper permanently?")) return;
    try {
      await axios.delete(`${API}/papers/delete/${encodeURIComponent(public_id)}`, { headers: authH() });
      setPapers(prev => prev.filter(p => p.public_id !== public_id));
      flashPapers("🗑️ Paper deleted successfully");
    } catch (err) {
      flashPapers("⚠️ " + (err.response?.data?.detail || "Delete failed"));
    }
  }

  const flash = (msg) => { setSettingsMsg(msg); setTimeout(() => setSettingsMsg(""), 3000); };
  const flashPapers = (msg) => { setPapersMsg(msg); setTimeout(() => setPapersMsg(""), 3000); };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true); setUploadMsg(""); setUploadErr("");
    const data = new FormData();
    Object.entries(form).forEach(([k,v]) => { if (k !== "file") data.append(k, v); });
    data.append("file", form.file);
    try {
      await axios.post(`${API}/papers/upload`, data, {
        headers: { ...authH(), "Content-Type": "multipart/form-data" },
      });
      setUploadMsg("Paper uploaded successfully!");
      setForm({ department:"", class_name:"", semester:"", subject:"", academic_year:"", file:null });
      setPapersLoaded(false);
    } catch (err) {
      setUploadErr(err.response?.data?.detail || "Upload failed");
    } finally { setUploading(false); }
  };

  async function addDept() {
    if (!newDept.trim()) return;
    try {
      const res = await axios.post(`${API}/settings/departments`, { value: newDept }, { headers: authH() });
      setDepartments(res.data.departments); setNewDept(""); flash("✅ Department added");
    } catch (err) { flash("⚠️ " + (err.response?.data?.detail || "Error")); }
  }

  async function removeDept(name) {
    if (!window.confirm(`Remove "${name}"?`)) return;
    try {
      const res = await axios.delete(`${API}/settings/departments/${encodeURIComponent(name)}`, { headers: authH() });
      setDepartments(res.data.departments); fetchSettings(); flash("🗑️ Removed");
    } catch (err) { flash("⚠️ " + (err.response?.data?.detail || "Error")); }
  }

  async function addClass() {
    if (!newClass.trim()) return;
    try {
      const res = await axios.post(`${API}/settings/classes`, { value: newClass }, { headers: authH() });
      setClasses(res.data.classes); setNewClass(""); flash("✅ Class added");
    } catch (err) { flash("⚠️ " + (err.response?.data?.detail || "Error")); }
  }

  async function removeClass(name) {
    if (!window.confirm(`Remove class "${name}"?`)) return;
    try {
      const res = await axios.delete(`${API}/settings/classes/${encodeURIComponent(name)}`, { headers: authH() });
      setClasses(res.data.classes); flash("🗑️ Removed");
    } catch (err) { flash("⚠️ " + (err.response?.data?.detail || "Error")); }
  }

  async function addSubject() {
    if (!newSubjDept || !newSubj.trim()) return;
    try {
      const res = await axios.post(`${API}/settings/subjects`, { department: newSubjDept, subject: newSubj }, { headers: authH() });
      setSubjects(res.data.subjects); setNewSubj(""); flash("✅ Subject added");
    } catch (err) { flash("⚠️ " + (err.response?.data?.detail || "Error")); }
  }

  async function removeSubject(dept, subj) {
    try {
      const res = await axios.delete(`${API}/settings/subjects/${encodeURIComponent(dept)}/${encodeURIComponent(subj)}`, { headers: authH() });
      setSubjects(res.data.subjects); flash("🗑️ Removed");
    } catch (err) { flash("⚠️ " + (err.response?.data?.detail || "Error")); }
  }

  async function addDeptClass() {
    if (!mapDept || !mapClass) return;
    try {
      const res = await axios.post(`${API}/settings/dept-classes`, { department: mapDept, class_name: mapClass }, { headers: authH() });
      setDeptClasses(res.data.dept_classes); setMapClass(""); flash("✅ Class linked");
    } catch (err) { flash("⚠️ " + (err.response?.data?.detail || "Error")); }
  }

  async function removeDeptClass(dept, cls) {
    try {
      const res = await axios.delete(`${API}/settings/dept-classes/${encodeURIComponent(dept)}/${encodeURIComponent(cls)}`, { headers: authH() });
      setDeptClasses(res.data.dept_classes); flash("🗑️ Removed");
    } catch (err) { flash("⚠️ " + (err.response?.data?.detail || "Error")); }
  }

  async function removeStudent(email) {
    if (!window.confirm(`Remove student "${email}"?`)) return;
    try {
      await axios.delete(`${API}/settings/students/${encodeURIComponent(email)}`, { headers: authH() });
      setStudents(prev => prev.filter(s => s.email !== email)); flash("🗑️ Student removed");
    } catch (err) { flash("⚠️ " + (err.response?.data?.detail || "Error")); }
  }

  const uploadClasses = form.department ? (deptClasses[form.department] || []) : [];
  const uploadSubjects = form.department ? (subjects[form.department] || []) : [];

  const filteredPapers = papers.filter(p => {
    if (filterDept && p.department !== filterDept) return false;
    if (filterSem && p.semester !== filterSem) return false;
    return true;
  });

  return (
    <div style={{minHeight:"100vh", background:"#F4F7FB", fontFamily:"'DM Sans', sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');
        .adm-tab { flex:1; padding:11px; border:none; border-radius:10px; cursor:pointer; font-size:13px; font-weight:500; font-family:'DM Sans',sans-serif; color:#4A6080; background:transparent; transition:all 0.2s; }
        .adm-tab.active { background:#0F2A4A; color:white; }
        .adm-tab:hover:not(.active) { background:#F4F7FB; }
        .form-input { width:100%; padding:11px 14px; border:1px solid rgba(15,42,74,0.12); border-radius:8px; font-size:14px; font-family:'DM Sans',sans-serif; color:#0F2A4A; background:#F4F7FB; outline:none; transition:border-color 0.2s; box-sizing:border-box; }
        .form-input:focus { border-color:#2D5FA0; background:white; }
        .btn-navy { background:#0F2A4A; color:white; border:none; padding:10px 20px; border-radius:8px; font-size:14px; font-weight:500; cursor:pointer; font-family:'DM Sans',sans-serif; white-space:nowrap; }
        .btn-navy:hover { opacity:0.85; }
        .btn-accent { background:#1D9E75; color:white; border:none; padding:10px 20px; border-radius:8px; font-size:14px; font-weight:500; cursor:pointer; font-family:'DM Sans',sans-serif; white-space:nowrap; }
        .btn-accent:hover { opacity:0.85; }
        .btn-accent:disabled { opacity:0.6; cursor:not-allowed; }
        .btn-danger { background:#fef2f2; color:#dc2626; border:1px solid #fecaca; padding:5px 12px; border-radius:6px; font-size:12px; cursor:pointer; font-family:'DM Sans',sans-serif; }
        .btn-danger:hover { background:#fee2e2; }
        .tag { display:inline-flex; align-items:center; gap:6px; background:white; border:1px solid rgba(15,42,74,0.12); border-radius:20px; padding:5px 12px; font-size:13px; color:#0F2A4A; font-weight:500; margin:4px; }
        .tag button { background:none; border:none; cursor:pointer; color:#4A6080; font-size:15px; line-height:1; padding:0; }
        .tag button:hover { color:#dc2626; }
        .drop-zone { border:2px dashed rgba(15,42,74,0.2); border-radius:10px; padding:28px; text-align:center; cursor:pointer; transition:all 0.2s; background:#F4F7FB; }
        .drop-zone.active { border-color:#1D9E75; background:#E1F5EE; }
        .paper-card { background:white; border:1px solid rgba(15,42,74,0.1); border-radius:12px; padding:16px 20px; display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; transition:box-shadow 0.2s; }
        .paper-card:hover { box-shadow:0 4px 15px rgba(0,0,0,0.08); }
      `}</style>

      {/* Navbar */}
      <nav style={{background:"#0F2A4A", height:"64px", padding:"0 32px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100}}>
        <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
          <div style={{width:"36px", height:"36px", background:"#1D9E75", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:"700", fontSize:"18px"}}>Q</div>
          <span style={{color:"white", fontWeight:"600", fontSize:"15px"}}>AcademiQ <span style={{color:"#1D9E75"}}>Admin</span></span>
        </div>
        <div style={{display:"flex", alignItems:"center", gap:"14px"}}>
          <span style={{color:"rgba(255,255,255,0.7)", fontSize:"14px"}}>👋 {user?.name}</span>
          <button onClick={() => { logout(); navigate("/login"); }} style={{background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.25)", color:"white", padding:"8px 18px", borderRadius:"8px", cursor:"pointer", fontSize:"14px"}}>Logout</button>
        </div>
      </nav>

      <div style={{maxWidth:"900px", margin:"0 auto", padding:"36px 20px"}}>

        {/* Tabs */}
        <div style={{display:"flex", gap:"6px", marginBottom:"28px", background:"white", padding:"6px", borderRadius:"14px", border:"1px solid rgba(15,42,74,0.12)"}}>
          <button className={`adm-tab ${activeTab==="upload"?"active":""}`} onClick={() => setActiveTab("upload")}>📤 Upload Paper</button>
          <button className={`adm-tab ${activeTab==="papers"?"active":""}`} onClick={() => setActiveTab("papers")}>📋 Manage Papers</button>
          <button className={`adm-tab ${activeTab==="settings"?"active":""}`} onClick={() => setActiveTab("settings")}>⚙️ Settings</button>
          <button className={`adm-tab ${activeTab==="students"?"active":""}`} onClick={() => setActiveTab("students")}>👨‍🎓 Students</button>
        </div>

        {settingsMsg && <div style={{background:"#E1F5EE", border:"1px solid rgba(29,158,117,0.3)", color:"#0f7a5a", padding:"10px 16px", borderRadius:"10px", fontSize:"14px", fontWeight:"500", marginBottom:"20px"}}>{settingsMsg}</div>}
        {papersMsg && <div style={{background:"#E1F5EE", border:"1px solid rgba(29,158,117,0.3)", color:"#0f7a5a", padding:"10px 16px", borderRadius:"10px", fontSize:"14px", fontWeight:"500", marginBottom:"20px"}}>{papersMsg}</div>}

        {/* TAB 1: UPLOAD */}
        {activeTab === "upload" && (
          <div style={{background:"white", borderRadius:"16px", border:"1px solid rgba(15,42,74,0.12)", padding:"28px"}}>
            <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:"20px", color:"#0F2A4A", margin:"0 0 20px"}}>Upload Question Paper</h2>
            {uploadMsg && <div style={{background:"#f0fdf4", border:"1px solid #86efac", color:"#15803d", padding:"12px 16px", borderRadius:"10px", fontSize:"14px", marginBottom:"16px"}}>✅ {uploadMsg}</div>}
            {uploadErr && <div style={{background:"#fef2f2", border:"1px solid #fecaca", color:"#dc2626", padding:"12px 16px", borderRadius:"10px", fontSize:"14px", marginBottom:"16px"}}>⚠️ {uploadErr}</div>}
            <form onSubmit={handleUpload} style={{display:"flex", flexDirection:"column", gap:"16px"}}>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px"}}>
                <div>
                  <label style={{display:"block", fontSize:"13px", fontWeight:"600", color:"#374151", marginBottom:"6px"}}>Department</label>
                  <select className="form-input" value={form.department} onChange={e => setForm({...form, department:e.target.value, class_name:"", subject:""})} required>
                    <option value="">Select Department</option>
                    {departments.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{display:"block", fontSize:"13px", fontWeight:"600", color:"#374151", marginBottom:"6px"}}>Class</label>
                  <select className="form-input" value={form.class_name} onChange={e => setForm({...form, class_name:e.target.value})} required disabled={!form.department}>
                    <option value="">{form.department ? "Select Class" : "Select Department first"}</option>
                    {uploadClasses.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{display:"block", fontSize:"13px", fontWeight:"600", color:"#374151", marginBottom:"6px"}}>Semester</label>
                  <select className="form-input" value={form.semester} onChange={e => setForm({...form, semester:e.target.value})} required>
                    <option value="">Select Semester</option>
                    {SEMESTERS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{display:"block", fontSize:"13px", fontWeight:"600", color:"#374151", marginBottom:"6px"}}>Academic Year</label>
                  <input type="number" className="form-input" value={form.academic_year} onChange={e => setForm({...form, academic_year:e.target.value})} required placeholder="e.g. 2024" min="2000" max="2030" />
                </div>
              </div>
              <div>
                <label style={{display:"block", fontSize:"13px", fontWeight:"600", color:"#374151", marginBottom:"6px"}}>Subject</label>
                <select className="form-input" value={form.subject} onChange={e => setForm({...form, subject:e.target.value})} required disabled={!form.department}>
                  <option value="">{form.department ? "Select Subject" : "Select Department first"}</option>
                  {uploadSubjects.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{display:"block", fontSize:"13px", fontWeight:"600", color:"#374151", marginBottom:"6px"}}>Upload PDF</label>
                <div className={`drop-zone ${dragOver?"active":""}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); const f=e.dataTransfer.files[0]; if(f?.name.endsWith(".pdf")) setForm({...form,file:f}); }}
                  onClick={() => document.getElementById("fileInput").click()}>
                  <input id="fileInput" type="file" accept=".pdf" style={{display:"none"}} onChange={e => setForm({...form, file:e.target.files[0]})} />
                  {form.file ? (
                    <div><div style={{fontSize:"28px"}}>📄</div><div style={{color:"#15803d", fontWeight:"600", marginTop:"6px"}}>{form.file.name}</div><div style={{color:"#94a3b8", fontSize:"13px"}}>Click to change</div></div>
                  ) : (
                    <div><div style={{fontSize:"28px"}}>☁️</div><div style={{color:"#0F2A4A", fontWeight:"600", marginTop:"6px"}}>Drag & drop PDF here</div><div style={{color:"#94a3b8", fontSize:"13px"}}>or click to browse</div></div>
                  )}
                </div>
              </div>
              <button type="submit" disabled={uploading} className="btn-accent" style={{padding:"13px", fontSize:"15px"}}>
                {uploading ? "⏳ Uploading..." : "📤 Upload Paper"}
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: MANAGE PAPERS */}
        {activeTab === "papers" && (
          <div style={{background:"white", borderRadius:"16px", border:"1px solid rgba(15,42,74,0.12)", padding:"28px"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px"}}>
              <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:"20px", color:"#0F2A4A", margin:0}}>📋 Manage Papers</h2>
              <span style={{background:"#E1F5EE", color:"#1D9E75", borderRadius:"20px", padding:"4px 12px", fontSize:"13px", fontWeight:"600"}}>{filteredPapers.length} papers</span>
            </div>

            {/* Filters */}
            <div style={{display:"flex", gap:"12px", marginBottom:"20px"}}>
              <select className="form-input" value={filterDept} onChange={e => setFilterDept(e.target.value)}>
                <option value="">All Departments</option>
                {departments.map(d => <option key={d}>{d}</option>)}
              </select>
              <select className="form-input" value={filterSem} onChange={e => setFilterSem(e.target.value)}>
                <option value="">All Semesters</option>
                {SEMESTERS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            {filteredPapers.length === 0 ? (
              <div style={{textAlign:"center", padding:"40px", color:"#94a3b8"}}>
                <div style={{fontSize:"32px", marginBottom:"8px"}}>📭</div>
                <div>No papers found</div>
              </div>
            ) : (
              filteredPapers.map((paper, idx) => (
                <div key={idx} className="paper-card">
                  <div>
                    <div style={{fontWeight:"600", color:"#0F2A4A", fontSize:"15px"}}>{paper.subject} — {paper.academic_year}</div>
                    <div style={{color:"#4A6080", fontSize:"13px", marginTop:"4px"}}>{paper.department} | {paper.class_name} | {paper.semester} Semester</div>
                    <div style={{color:"#94a3b8", fontSize:"12px", marginTop:"2px"}}>Uploaded by: {paper.uploaded_by}</div>
                  </div>
                  <div style={{display:"flex", gap:"8px"}}>
                    <a href={paper.file_url} target="_blank" rel="noreferrer"
                      style={{padding:"7px 14px", background:"#E1F5EE", color:"#1D9E75", borderRadius:"8px", fontSize:"13px", fontWeight:"500", textDecoration:"none", border:"1px solid rgba(29,158,117,0.3)"}}>
                      👁️ View
                    </a>
                    <button className="btn-danger" onClick={() => deletePaper(paper.public_id)}>
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: SETTINGS */}
        {activeTab === "settings" && (
          <div style={{display:"flex", flexDirection:"column", gap:"20px"}}>
            <div style={{background:"white", borderRadius:"16px", border:"1px solid rgba(15,42,74,0.12)", padding:"28px"}}>
              <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:"20px", color:"#0F2A4A", margin:"0 0 16px"}}>🏛️ Departments</h2>
              <div style={{display:"flex", gap:"10px"}}>
                <input className="form-input" placeholder="e.g. CSE" value={newDept} onChange={e => setNewDept(e.target.value)} onKeyDown={e => e.key==="Enter" && addDept()} />
                <button className="btn-navy" onClick={addDept}>Add</button>
              </div>
              <div style={{marginTop:"14px"}}>
                {departments.length === 0 && <span style={{color:"#94a3b8", fontSize:"14px"}}>No departments yet</span>}
                {departments.map(d => <span key={d} className="tag">{d}<button onClick={() => removeDept(d)}>×</button></span>)}
              </div>
            </div>

            <div style={{background:"white", borderRadius:"16px", border:"1px solid rgba(15,42,74,0.12)", padding:"28px"}}>
              <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:"20px", color:"#0F2A4A", margin:"0 0 16px"}}>🎓 Classes</h2>
              <div style={{display:"flex", gap:"10px"}}>
                <input className="form-input" placeholder="e.g. B.Tech" value={newClass} onChange={e => setNewClass(e.target.value)} onKeyDown={e => e.key==="Enter" && addClass()} />
                <button className="btn-navy" onClick={addClass}>Add</button>
              </div>
              <div style={{marginTop:"14px"}}>
                {classes.length === 0 && <span style={{color:"#94a3b8", fontSize:"14px"}}>No classes yet</span>}
                {classes.map(c => <span key={c} className="tag">{c}<button onClick={() => removeClass(c)}>×</button></span>)}
              </div>
            </div>

            <div style={{background:"white", borderRadius:"16px", border:"1px solid rgba(15,42,74,0.12)", padding:"28px"}}>
              <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:"20px", color:"#0F2A4A", margin:"0 0 4px"}}>🔗 Department → Class Mapping</h2>
              <p style={{color:"#4A6080", fontSize:"13px", margin:"0 0 16px"}}>Student ko department choose karne ke baad sirf linked classes dikhegi</p>
              <div style={{display:"flex", gap:"10px"}}>
                <select className="form-input" value={mapDept} onChange={e => setMapDept(e.target.value)}>
                  <option value="">Select Department</option>
                  {departments.map(d => <option key={d}>{d}</option>)}
                </select>
                <select className="form-input" value={mapClass} onChange={e => setMapClass(e.target.value)}>
                  <option value="">Select Class</option>
                  {classes.map(c => <option key={c}>{c}</option>)}
                </select>
                <button className="btn-navy" onClick={addDeptClass}>Link</button>
              </div>
              <div style={{marginTop:"16px"}}>
                {departments.map(d => (
                  <div key={d} style={{marginBottom:"12px"}}>
                    <div style={{fontSize:"12px", fontWeight:"600", color:"#4A6080", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"6px"}}>{d}</div>
                    {(deptClasses[d] || []).length === 0
                      ? <span style={{color:"#94a3b8", fontSize:"13px"}}>No classes linked yet</span>
                      : (deptClasses[d] || []).map(c => <span key={c} className="tag">{c}<button onClick={() => removeDeptClass(d, c)}>×</button></span>)
                    }
                  </div>
                ))}
              </div>
            </div>

            <div style={{background:"white", borderRadius:"16px", border:"1px solid rgba(15,42,74,0.12)", padding:"28px"}}>
              <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:"20px", color:"#0F2A4A", margin:"0 0 16px"}}>📚 Subjects</h2>
              <div style={{display:"flex", gap:"10px"}}>
                <select className="form-input" value={newSubjDept} onChange={e => setNewSubjDept(e.target.value)} style={{maxWidth:"200px"}}>
                  <option value="">Select Dept</option>
                  {departments.map(d => <option key={d}>{d}</option>)}
                </select>
                <input className="form-input" placeholder="e.g. Data Structures" value={newSubj} onChange={e => setNewSubj(e.target.value)} onKeyDown={e => e.key==="Enter" && addSubject()} />
                <button className="btn-navy" onClick={addSubject}>Add</button>
              </div>
              <div style={{marginTop:"16px"}}>
                {departments.map(d => (
                  <div key={d} style={{marginBottom:"14px"}}>
                    <div style={{fontSize:"12px", fontWeight:"600", color:"#4A6080", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"6px"}}>{d}</div>
                    {(subjects[d] || []).length === 0
                      ? <span style={{color:"#94a3b8", fontSize:"13px"}}>No subjects yet</span>
                      : (subjects[d] || []).map(s => <span key={s} className="tag">{s}<button onClick={() => removeSubject(d, s)}>×</button></span>)
                    }
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: STUDENTS */}
        {activeTab === "students" && (
          <div style={{background:"white", borderRadius:"16px", border:"1px solid rgba(15,42,74,0.12)", padding:"28px"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px"}}>
              <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:"20px", color:"#0F2A4A", margin:0}}>👨‍🎓 Registered Students</h2>
              <span style={{background:"#E1F5EE", color:"#1D9E75", borderRadius:"20px", padding:"4px 12px", fontSize:"13px", fontWeight:"600"}}>{students.length} total</span>
            </div>
            {students.length === 0 ? (
              <div style={{textAlign:"center", padding:"40px", color:"#94a3b8"}}>
                <div style={{fontSize:"32px", marginBottom:"8px"}}>👤</div>
                <div>No students registered yet</div>
              </div>
            ) : (
              <table style={{width:"100%", borderCollapse:"collapse", fontSize:"14px"}}>
                <thead>
                  <tr>
                    {["Name","Email","College ID","Action"].map(h => (
                      <th key={h} style={{textAlign:"left", padding:"10px 14px", fontSize:"12px", fontWeight:"600", color:"#4A6080", textTransform:"uppercase", letterSpacing:"0.5px", borderBottom:"2px solid rgba(15,42,74,0.12)"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.email}>
                      <td style={{padding:"12px 14px", borderBottom:"1px solid rgba(15,42,74,0.08)", color:"#0F2A4A", fontWeight:"500"}}>{s.name}</td>
                      <td style={{padding:"12px 14px", borderBottom:"1px solid rgba(15,42,74,0.08)", color:"#4A6080"}}>{s.email}</td>
                      <td style={{padding:"12px 14px", borderBottom:"1px solid rgba(15,42,74,0.08)", color:"#4A6080"}}>{s.college_id || "—"}</td>
                      <td style={{padding:"12px 14px", borderBottom:"1px solid rgba(15,42,74,0.08)"}}><button className="btn-danger" onClick={() => removeStudent(s.email)}>Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}