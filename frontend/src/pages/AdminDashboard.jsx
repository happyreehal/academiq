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
  const isSuperAdmin = user?.is_super;
  const [activeTab, setActiveTab] = useState("upload");

  // Upload state
  const [form, setForm] = useState({ department:"", course:"", semester:"", subject:"", academic_year:"", file:null });
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [uploadErr, setUploadErr] = useState("");

  // Settings state
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState({});
  const [deptCourses, setDeptCourses] = useState({});
  const [newDept, setNewDept] = useState("");
  const [newCourse, setNewCourse] = useState("");
  const [newSubjDept, setNewSubjDept] = useState("");
  const [newSubjCourse, setNewSubjCourse] = useState("");
  const [newSubjSem, setNewSubjSem] = useState("");
  const [newSubj, setNewSubj] = useState("");
  const [mapDept, setMapDept] = useState("");
  const [mapCourse, setMapCourse] = useState("");
  const [settingsMsg, setSettingsMsg] = useState("");

  // Students state
  const [students, setStudents] = useState([]);

  // Papers state
  const [papers, setPapers] = useState([]);
  const [papersMsg, setPapersMsg] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterSem, setFilterSem] = useState("");

  // Super admin state
  const [admins, setAdmins] = useState([]);
  const [newSecret, setNewSecret] = useState("");
  const [currentSecret, setCurrentSecret] = useState("");
  const [superMsg, setSuperMsg] = useState("");

  useEffect(() => { fetchSettings(); }, []);
  useEffect(() => { if (activeTab === "students") fetchStudents(); }, [activeTab]);
  useEffect(() => { if (activeTab === "papers") fetchPapers(); }, [activeTab]);
  useEffect(() => { if (activeTab === "admins" && isSuperAdmin) fetchAdmins(); }, [activeTab]);
  useEffect(() => { if (activeTab === "superadmin" && isSuperAdmin) fetchSecret(); }, [activeTab]);

  async function fetchSettings() {
    try {
      const [d, c, s, dc] = await Promise.all([
        axios.get(`${API}/settings/departments`),
        axios.get(`${API}/settings/courses`),
        axios.get(`${API}/settings/subjects`),
        axios.get(`${API}/settings/dept-courses`),
      ]);
      setDepartments(d.data.departments);
      setCourses(c.data.courses);
      setSubjects(s.data.subjects);
      setDeptCourses(dc.data.dept_courses);
    } catch (_) {}
  }

  async function fetchStudents() {
    try {
      const res = await axios.get(`${API}/settings/students`, { headers: authH() });
      setStudents(res.data.students);
    } catch (_) {}
  }

  async function fetchPapers() {
    try {
      const res = await axios.get(`${API}/papers/all`, { headers: authH() });
      setPapers(res.data.papers);
    } catch (_) {}
  }

  async function fetchAdmins() {
    try {
      const res = await axios.get(`${API}/settings/admins`, { headers: authH() });
      setAdmins(res.data.admins);
    } catch (_) {}
  }

  async function fetchSecret() {
    try {
      const res = await axios.get(`${API}/settings/admin-secret`, { headers: authH() });
      setCurrentSecret(res.data.secret);
    } catch (_) {}
  }

  const flash = (msg) => { setSettingsMsg(msg); setTimeout(() => setSettingsMsg(""), 3000); };
  const flashPapers = (msg) => { setPapersMsg(msg); setTimeout(() => setPapersMsg(""), 3000); };
  const flashSuper = (msg) => { setSuperMsg(msg); setTimeout(() => setSuperMsg(""), 3000); };

  // Upload
  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true); setUploadMsg(""); setUploadErr("");
    const data = new FormData();
    data.append("department", form.department);
    data.append("class_name", form.course);
    data.append("semester", form.semester);
    data.append("subject", form.subject);
    data.append("academic_year", form.academic_year);
    data.append("file", form.file);
    try {
      await axios.post(`${API}/papers/upload`, data, {
        headers: { ...authH(), "Content-Type": "multipart/form-data" },
      });
      setUploadMsg("Paper uploaded successfully!");
      setForm({ department:"", course:"", semester:"", subject:"", academic_year:"", file:null });
    } catch (err) {
      setUploadErr(err.response?.data?.detail || "Upload failed");
    } finally { setUploading(false); }
  };

  async function deletePaper(public_id) {
    if (!window.confirm("Delete this paper permanently?")) return;
    try {
      await axios.delete(`${API}/papers/delete/${encodeURIComponent(public_id)}`, { headers: authH() });
      setPapers(prev => prev.filter(p => p.public_id !== public_id));
      flashPapers("🗑️ Paper deleted");
    } catch (err) { flashPapers("⚠️ " + (err.response?.data?.detail || "Error")); }
  }

  async function approveStudent(email) {
    try {
      await axios.post(`${API}/settings/students/${encodeURIComponent(email)}/approve`, {}, { headers: authH() });
      setStudents(prev => prev.map(s => s.email === email ? {...s, status:"active"} : s));
      flash("✅ Student approved");
    } catch (err) { flash("⚠️ Error"); }
  }

  async function rejectStudent(email) {
    try {
      await axios.post(`${API}/settings/students/${encodeURIComponent(email)}/reject`, {}, { headers: authH() });
      setStudents(prev => prev.map(s => s.email === email ? {...s, status:"rejected"} : s));
      flash("❌ Student rejected");
    } catch (err) { flash("⚠️ Error"); }
  }

  async function removeStudent(email) {
    if (!window.confirm(`Remove "${email}"?`)) return;
    try {
      await axios.delete(`${API}/settings/students/${encodeURIComponent(email)}`, { headers: authH() });
      setStudents(prev => prev.filter(s => s.email !== email));
      flash("🗑️ Removed");
    } catch (err) { flash("⚠️ Error"); }
  }

  async function approveAdmin(email) {
    try {
      await axios.post(`${API}/settings/admins/${encodeURIComponent(email)}/approve`, {}, { headers: authH() });
      setAdmins(prev => prev.map(a => a.email === email ? {...a, status:"active"} : a));
      flashSuper("✅ Admin approved");
    } catch (err) { flashSuper("⚠️ Error"); }
  }

  async function rejectAdmin(email) {
    try {
      await axios.post(`${API}/settings/admins/${encodeURIComponent(email)}/reject`, {}, { headers: authH() });
      setAdmins(prev => prev.map(a => a.email === email ? {...a, status:"rejected"} : a));
      flashSuper("❌ Admin rejected");
    } catch (err) { flashSuper("⚠️ Error"); }
  }

  async function removeAdmin(email) {
    if (!window.confirm(`Remove "${email}"?`)) return;
    try {
      await axios.delete(`${API}/settings/admins/${encodeURIComponent(email)}`, { headers: authH() });
      setAdmins(prev => prev.filter(a => a.email !== email));
      flashSuper("🗑️ Removed");
    } catch (err) { flashSuper("⚠️ Error"); }
  }

  async function updateSecret() {
    if (newSecret.length < 8) { flashSuper("⚠️ Min 8 characters"); return; }
    try {
      await axios.post(`${API}/settings/admin-secret`, { new_secret: newSecret }, { headers: authH() });
      setCurrentSecret(newSecret); setNewSecret("");
      flashSuper("✅ Secret updated");
    } catch (err) { flashSuper("⚠️ Error"); }
  }

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
    } catch (err) { flash("⚠️ Error"); }
  }

  async function addCourse() {
    if (!newCourse.trim()) return;
    try {
      const res = await axios.post(`${API}/settings/courses`, { value: newCourse }, { headers: authH() });
      setCourses(res.data.courses); setNewCourse(""); flash("✅ Course added");
    } catch (err) { flash("⚠️ " + (err.response?.data?.detail || "Error")); }
  }

  async function removeCourse(name) {
    if (!window.confirm(`Remove "${name}"?`)) return;
    try {
      const res = await axios.delete(`${API}/settings/courses/${encodeURIComponent(name)}`, { headers: authH() });
      setCourses(res.data.courses); flash("🗑️ Removed");
    } catch (err) { flash("⚠️ Error"); }
  }

  async function addSubject() {
    if (!newSubjDept || !newSubjCourse || !newSubjSem || !newSubj.trim()) {
      flash("⚠️ All fields required for subject"); return;
    }
    try {
      const res = await axios.post(`${API}/settings/subjects`, {
        department: newSubjDept, course: newSubjCourse,
        semester: newSubjSem, subject: newSubj
      }, { headers: authH() });
      setSubjects(res.data.subjects); setNewSubj(""); flash("✅ Subject added");
    } catch (err) { flash("⚠️ " + (err.response?.data?.detail || "Error")); }
  }

  async function removeSubject(dept, course, sem, subj) {
    try {
      const res = await axios.delete(
        `${API}/settings/subjects/${encodeURIComponent(dept)}/${encodeURIComponent(course)}/${encodeURIComponent(sem)}/${encodeURIComponent(subj)}`,
        { headers: authH() }
      );
      setSubjects(res.data.subjects); flash("🗑️ Removed");
    } catch (err) { flash("⚠️ Error"); }
  }

  async function addDeptCourse() {
    if (!mapDept || !mapCourse) return;
    try {
      const res = await axios.post(`${API}/settings/dept-courses`, { department: mapDept, course: mapCourse }, { headers: authH() });
      setDeptCourses(res.data.dept_courses); setMapCourse(""); flash("✅ Course linked");
    } catch (err) { flash("⚠️ " + (err.response?.data?.detail || "Error")); }
  }

  async function removeDeptCourse(dept, course) {
    try {
      const res = await axios.delete(`${API}/settings/dept-courses/${encodeURIComponent(dept)}/${encodeURIComponent(course)}`, { headers: authH() });
      setDeptCourses(res.data.dept_courses); flash("🗑️ Removed");
    } catch (err) { flash("⚠️ Error"); }
  }

  // Upload form dropdowns
  const uploadCourses = form.department ? (deptCourses[form.department] || []) : [];
  const uploadSubjects = (form.department && form.course && form.semester)
    ? ((subjects[form.department]?.[form.course]?.[form.semester]) || [])
    : [];

  const filteredPapers = papers.filter(p => {
    if (filterDept && p.department !== filterDept) return false;
    if (filterSem && p.semester !== filterSem) return false;
    return true;
  });

  const pendingStudents = students.filter(s => s.status === "pending");
  const activeStudents = students.filter(s => s.status === "active");
  const rejectedStudents = students.filter(s => s.status === "rejected");
  const pendingAdmins = admins.filter(a => a.status === "pending");
  const activeAdmins = admins.filter(a => a.status === "active");

  return (
    <div style={{minHeight:"100vh", background:"#F4F7FB", fontFamily:"'DM Sans', sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');
        .adm-tab { flex:1; padding:10px 8px; border:none; border-radius:10px; cursor:pointer; font-size:12px; font-weight:500; font-family:'DM Sans',sans-serif; color:#4A6080; background:transparent; transition:all 0.2s; white-space:nowrap; }
        .adm-tab.active { background:#0F2A4A; color:white; }
        .adm-tab.super-tab.active { background:linear-gradient(135deg,#7C3AED,#5B21B6); }
        .adm-tab:hover:not(.active) { background:#F4F7FB; }
        .form-input { width:100%; padding:11px 14px; border:1px solid rgba(15,42,74,0.12); border-radius:8px; font-size:14px; font-family:'DM Sans',sans-serif; color:#0F2A4A; background:#F4F7FB; outline:none; transition:border-color 0.2s; box-sizing:border-box; }
        .form-input:focus { border-color:#2D5FA0; background:white; }
        .btn-navy { background:#0F2A4A; color:white; border:none; padding:10px 20px; border-radius:8px; font-size:14px; font-weight:500; cursor:pointer; font-family:'DM Sans',sans-serif; white-space:nowrap; }
        .btn-navy:hover { opacity:0.85; }
        .btn-accent { background:#1D9E75; color:white; border:none; padding:10px 20px; border-radius:8px; font-size:14px; font-weight:500; cursor:pointer; font-family:'DM Sans',sans-serif; white-space:nowrap; }
        .btn-accent:hover { opacity:0.85; }
        .btn-accent:disabled { opacity:0.6; cursor:not-allowed; }
        .btn-danger { background:#fef2f2; color:#dc2626; border:1px solid #fecaca; padding:5px 12px; border-radius:6px; font-size:12px; cursor:pointer; }
        .btn-danger:hover { background:#fee2e2; }
        .btn-approve { background:#E1F5EE; color:#1D9E75; border:1px solid rgba(29,158,117,0.3); padding:5px 12px; border-radius:6px; font-size:12px; cursor:pointer; }
        .btn-approve:hover { background:#C6EFE0; }
        .btn-reject { background:#FEF9C3; color:#92400E; border:1px solid #FDE68A; padding:5px 12px; border-radius:6px; font-size:12px; cursor:pointer; }
        .btn-reject:hover { background:#FEF08A; }
        .btn-purple { background:linear-gradient(135deg,#7C3AED,#5B21B6); color:white; border:none; padding:10px 20px; border-radius:8px; font-size:14px; font-weight:500; cursor:pointer; }
        .btn-purple:hover { opacity:0.85; }
        .tag { display:inline-flex; align-items:center; gap:6px; background:white; border:1px solid rgba(15,42,74,0.12); border-radius:20px; padding:5px 12px; font-size:13px; color:#0F2A4A; font-weight:500; margin:4px; }
        .tag button { background:none; border:none; cursor:pointer; color:#4A6080; font-size:15px; line-height:1; padding:0; }
        .tag button:hover { color:#dc2626; }
        .drop-zone { border:2px dashed rgba(15,42,74,0.2); border-radius:10px; padding:28px; text-align:center; cursor:pointer; transition:all 0.2s; background:#F4F7FB; }
        .drop-zone.active { border-color:#1D9E75; background:#E1F5EE; }
        .paper-card { background:white; border:1px solid rgba(15,42,74,0.1); border-radius:12px; padding:16px 20px; display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
        .paper-card:hover { box-shadow:0 4px 15px rgba(0,0,0,0.08); }
        .card { background:white; borderRadius:16px; border:1px solid rgba(15,42,74,0.12); padding:28px; }
      `}</style>

      {/* Navbar */}
      <nav style={{background:"#0F2A4A", height:"64px", padding:"0 32px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100}}>
        <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
          <div style={{width:"36px", height:"36px", background:"#1D9E75", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:"700", fontSize:"18px"}}>Q</div>
          <span style={{color:"white", fontWeight:"600", fontSize:"15px"}}>
            AcademiQ <span style={{color:"#1D9E75"}}>Admin</span>
            {isSuperAdmin && <span style={{background:"linear-gradient(135deg,#7C3AED,#5B21B6)", color:"white", fontSize:"11px", padding:"2px 8px", borderRadius:"20px", marginLeft:"8px"}}>SUPER</span>}
          </span>
        </div>
        <div style={{display:"flex", alignItems:"center", gap:"14px"}}>
          <span style={{color:"rgba(255,255,255,0.7)", fontSize:"14px"}}>👋 {user?.name}</span>
          <button onClick={() => { logout(); navigate("/login"); }} style={{background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.25)", color:"white", padding:"8px 18px", borderRadius:"8px", cursor:"pointer", fontSize:"14px"}}>Logout</button>
        </div>
      </nav>

      <div style={{maxWidth:"960px", margin:"0 auto", padding:"36px 20px"}}>

        {/* Tabs */}
        <div style={{display:"flex", gap:"6px", marginBottom:"28px", background:"white", padding:"6px", borderRadius:"14px", border:"1px solid rgba(15,42,74,0.12)", flexWrap:"wrap"}}>
          <button className={`adm-tab ${activeTab==="upload"?"active":""}`} onClick={() => setActiveTab("upload")}>📤 Upload</button>
          <button className={`adm-tab ${activeTab==="papers"?"active":""}`} onClick={() => setActiveTab("papers")}>📋 Papers</button>
          <button className={`adm-tab ${activeTab==="students"?"active":""}`} onClick={() => setActiveTab("students")}>
            👨‍🎓 Students {pendingStudents.length > 0 && <span style={{background:"#EF4444", color:"white", borderRadius:"50%", padding:"1px 6px", fontSize:"11px", marginLeft:"4px"}}>{pendingStudents.length}</span>}
          </button>
          <button className={`adm-tab ${activeTab==="settings"?"active":""}`} onClick={() => setActiveTab("settings")}>⚙️ Settings</button>
          {isSuperAdmin && <>
            <button className={`adm-tab super-tab ${activeTab==="admins"?"active":""}`} onClick={() => setActiveTab("admins")}>
              👑 Admins {pendingAdmins.length > 0 && <span style={{background:"#EF4444", color:"white", borderRadius:"50%", padding:"1px 6px", fontSize:"11px", marginLeft:"4px"}}>{pendingAdmins.length}</span>}
            </button>
            <button className={`adm-tab super-tab ${activeTab==="superadmin"?"active":""}`} onClick={() => setActiveTab("superadmin")}>🔐 Super</button>
          </>}
        </div>

        {settingsMsg && <div style={{background:"#E1F5EE", border:"1px solid rgba(29,158,117,0.3)", color:"#0f7a5a", padding:"10px 16px", borderRadius:"10px", fontSize:"14px", marginBottom:"20px"}}>{settingsMsg}</div>}
        {papersMsg && <div style={{background:"#E1F5EE", border:"1px solid rgba(29,158,117,0.3)", color:"#0f7a5a", padding:"10px 16px", borderRadius:"10px", fontSize:"14px", marginBottom:"20px"}}>{papersMsg}</div>}
        {superMsg && <div style={{background:"#F3E8FF", border:"1px solid #C4B5FD", color:"#5B21B6", padding:"10px 16px", borderRadius:"10px", fontSize:"14px", marginBottom:"20px"}}>{superMsg}</div>}

        {/* TAB 1: UPLOAD */}
        {activeTab === "upload" && (
          <div style={{background:"white", borderRadius:"16px", border:"1px solid rgba(15,42,74,0.12)", padding:"28px"}}>
            <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:"20px", color:"#0F2A4A", margin:"0 0 20px"}}>📤 Upload Question Paper</h2>
            {uploadMsg && <div style={{background:"#f0fdf4", border:"1px solid #86efac", color:"#15803d", padding:"12px 16px", borderRadius:"10px", fontSize:"14px", marginBottom:"16px"}}>✅ {uploadMsg}</div>}
            {uploadErr && <div style={{background:"#fef2f2", border:"1px solid #fecaca", color:"#dc2626", padding:"12px 16px", borderRadius:"10px", fontSize:"14px", marginBottom:"16px"}}>⚠️ {uploadErr}</div>}
            <form onSubmit={handleUpload} style={{display:"flex", flexDirection:"column", gap:"16px"}}>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px"}}>
                <div>
                  <label style={{display:"block", fontSize:"13px", fontWeight:"600", color:"#374151", marginBottom:"6px"}}>Department</label>
                  <select className="form-input" value={form.department} onChange={e => setForm({...form, department:e.target.value, course:"", semester:"", subject:""})} required>
                    <option value="">Select Department</option>
                    {departments.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{display:"block", fontSize:"13px", fontWeight:"600", color:"#374151", marginBottom:"6px"}}>Course</label>
                  <select className="form-input" value={form.course} onChange={e => setForm({...form, course:e.target.value, semester:"", subject:""})} required disabled={!form.department}>
                    <option value="">{form.department ? "Select Course" : "Select Dept first"}</option>
                    {uploadCourses.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{display:"block", fontSize:"13px", fontWeight:"600", color:"#374151", marginBottom:"6px"}}>Semester</label>
                  <select className="form-input" value={form.semester} onChange={e => setForm({...form, semester:e.target.value, subject:""})} required disabled={!form.course}>
                    <option value="">{form.course ? "Select Semester" : "Select Course first"}</option>
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
                <select className="form-input" value={form.subject} onChange={e => setForm({...form, subject:e.target.value})} required disabled={!form.semester}>
                  <option value="">{form.semester ? (uploadSubjects.length > 0 ? "Select Subject" : "No subjects for this semester — add in Settings") : "Select Semester first"}</option>
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

        {/* TAB 2: PAPERS */}
        {activeTab === "papers" && (
          <div style={{background:"white", borderRadius:"16px", border:"1px solid rgba(15,42,74,0.12)", padding:"28px"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px"}}>
              <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:"20px", color:"#0F2A4A", margin:0}}>📋 Manage Papers</h2>
              <span style={{background:"#E1F5EE", color:"#1D9E75", borderRadius:"20px", padding:"4px 12px", fontSize:"13px", fontWeight:"600"}}>{filteredPapers.length} papers</span>
            </div>
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
              <div style={{textAlign:"center", padding:"40px", color:"#94a3b8"}}><div style={{fontSize:"32px"}}>📭</div><div style={{marginTop:"8px"}}>No papers found</div></div>
            ) : filteredPapers.map((paper, idx) => (
              <div key={idx} className="paper-card">
                <div>
                  <div style={{fontWeight:"600", color:"#0F2A4A"}}>{paper.subject} — {paper.academic_year}</div>
                  <div style={{color:"#4A6080", fontSize:"13px", marginTop:"4px"}}>{paper.department} | {paper.class_name} | {paper.semester} Semester</div>
                  <div style={{color:"#94a3b8", fontSize:"12px"}}>By: {paper.uploaded_by}</div>
                </div>
                <div style={{display:"flex", gap:"8px"}}>
                  <a href={paper.file_url} target="_blank" rel="noreferrer"
                    style={{padding:"7px 14px", background:"#E1F5EE", color:"#1D9E75", borderRadius:"8px", fontSize:"13px", fontWeight:"500", textDecoration:"none", border:"1px solid rgba(29,158,117,0.3)"}}>
                    👁️ View
                  </a>
                  <button className="btn-danger" onClick={() => deletePaper(paper.public_id)}>🗑️ Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: STUDENTS */}
        {activeTab === "students" && (
          <div style={{display:"flex", flexDirection:"column", gap:"20px"}}>
            {/* Pending */}
            <div style={{background:"white", borderRadius:"16px", border:"1px solid rgba(15,42,74,0.12)", padding:"28px"}}>
              <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:"18px", color:"#0F2A4A", margin:"0 0 16px"}}>
                ⏳ Pending Requests <span style={{background:"#FEF9C3", color:"#92400E", borderRadius:"20px", padding:"3px 10px", fontSize:"13px", marginLeft:"8px"}}>{pendingStudents.length}</span>
              </h2>
              {pendingStudents.length === 0 ? <p style={{color:"#94a3b8", fontSize:"14px"}}>No pending requests</p>
              : pendingStudents.map(s => (
                <div key={s.email} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:"1px solid rgba(15,42,74,0.06)"}}>
                  <div>
                    <div style={{fontWeight:"600", color:"#0F2A4A"}}>{s.name}</div>
                    <div style={{color:"#4A6080", fontSize:"13px"}}>{s.email} {s.college_id && `• ${s.college_id}`}</div>
                  </div>
                  <div style={{display:"flex", gap:"8px"}}>
                    <button className="btn-approve" onClick={() => approveStudent(s.email)}>✅ Approve</button>
                    <button className="btn-reject" onClick={() => rejectStudent(s.email)}>❌ Reject</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Active */}
            <div style={{background:"white", borderRadius:"16px", border:"1px solid rgba(15,42,74,0.12)", padding:"28px"}}>
              <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:"18px", color:"#0F2A4A", margin:"0 0 16px"}}>
                ✅ Active Students <span style={{background:"#E1F5EE", color:"#1D9E75", borderRadius:"20px", padding:"3px 10px", fontSize:"13px", marginLeft:"8px"}}>{activeStudents.length}</span>
              </h2>
              {activeStudents.length === 0 ? <p style={{color:"#94a3b8", fontSize:"14px"}}>No active students</p>
              : activeStudents.map(s => (
                <div key={s.email} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:"1px solid rgba(15,42,74,0.06)"}}>
                  <div>
                    <div style={{fontWeight:"600", color:"#0F2A4A"}}>{s.name}</div>
                    <div style={{color:"#4A6080", fontSize:"13px"}}>{s.email} {s.college_id && `• ${s.college_id}`}</div>
                  </div>
                  <button className="btn-danger" onClick={() => removeStudent(s.email)}>🗑️ Remove</button>
                </div>
              ))}
            </div>

            {/* Rejected */}
            {rejectedStudents.length > 0 && (
              <div style={{background:"white", borderRadius:"16px", border:"1px solid rgba(15,42,74,0.12)", padding:"28px"}}>
                <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:"18px", color:"#0F2A4A", margin:"0 0 16px"}}>
                  ❌ Rejected <span style={{background:"#FEF2F2", color:"#DC2626", borderRadius:"20px", padding:"3px 10px", fontSize:"13px", marginLeft:"8px"}}>{rejectedStudents.length}</span>
                </h2>
                {rejectedStudents.map(s => (
                  <div key={s.email} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:"1px solid rgba(15,42,74,0.06)"}}>
                    <div>
                      <div style={{fontWeight:"600", color:"#0F2A4A"}}>{s.name}</div>
                      <div style={{color:"#4A6080", fontSize:"13px"}}>{s.email}</div>
                    </div>
                    <div style={{display:"flex", gap:"8px"}}>
                      <button className="btn-approve" onClick={() => approveStudent(s.email)}>✅ Approve</button>
                      <button className="btn-danger" onClick={() => removeStudent(s.email)}>🗑️ Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SETTINGS */}
        {activeTab === "settings" && (
          <div style={{display:"flex", flexDirection:"column", gap:"20px"}}>

            {/* Departments */}
            <div style={{background:"white", borderRadius:"16px", border:"1px solid rgba(15,42,74,0.12)", padding:"28px"}}>
              <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:"20px", color:"#0F2A4A", margin:"0 0 16px"}}>🏛️ Departments</h2>
              <div style={{display:"flex", gap:"10px"}}>
                <input className="form-input" placeholder="e.g. Computer Science" value={newDept} onChange={e => setNewDept(e.target.value)} onKeyDown={e => e.key==="Enter" && addDept()} />
                <button className="btn-navy" onClick={addDept}>Add</button>
              </div>
              <div style={{marginTop:"14px"}}>
                {departments.length === 0 && <span style={{color:"#94a3b8", fontSize:"14px"}}>No departments yet</span>}
                {departments.map(d => <span key={d} className="tag">{d}<button onClick={() => removeDept(d)}>×</button></span>)}
              </div>
            </div>

            {/* Courses */}
            <div style={{background:"white", borderRadius:"16px", border:"1px solid rgba(15,42,74,0.12)", padding:"28px"}}>
              <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:"20px", color:"#0F2A4A", margin:"0 0 16px"}}>🎓 Courses</h2>
              <div style={{display:"flex", gap:"10px"}}>
                <input className="form-input" placeholder="e.g. B.Tech, MCA, M.Sc" value={newCourse} onChange={e => setNewCourse(e.target.value)} onKeyDown={e => e.key==="Enter" && addCourse()} />
                <button className="btn-navy" onClick={addCourse}>Add</button>
              </div>
              <div style={{marginTop:"14px"}}>
                {courses.length === 0 && <span style={{color:"#94a3b8", fontSize:"14px"}}>No courses yet</span>}
                {courses.map(c => <span key={c} className="tag">{c}<button onClick={() => removeCourse(c)}>×</button></span>)}
              </div>
            </div>

            {/* Dept-Course Mapping */}
            <div style={{background:"white", borderRadius:"16px", border:"1px solid rgba(15,42,74,0.12)", padding:"28px"}}>
              <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:"20px", color:"#0F2A4A", margin:"0 0 4px"}}>🔗 Department → Course Mapping</h2>
              <p style={{color:"#4A6080", fontSize:"13px", margin:"0 0 16px"}}>Har department ke saath linked courses dikhenge</p>
              <div style={{display:"flex", gap:"10px"}}>
                <select className="form-input" value={mapDept} onChange={e => setMapDept(e.target.value)}>
                  <option value="">Select Department</option>
                  {departments.map(d => <option key={d}>{d}</option>)}
                </select>
                <select className="form-input" value={mapCourse} onChange={e => setMapCourse(e.target.value)}>
                  <option value="">Select Course</option>
                  {courses.map(c => <option key={c}>{c}</option>)}
                </select>
                <button className="btn-navy" onClick={addDeptCourse}>Link</button>
              </div>
              <div style={{marginTop:"16px"}}>
                {departments.map(d => (
                  <div key={d} style={{marginBottom:"12px"}}>
                    <div style={{fontSize:"12px", fontWeight:"600", color:"#4A6080", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"6px"}}>{d}</div>
                    {(deptCourses[d] || []).length === 0
                      ? <span style={{color:"#94a3b8", fontSize:"13px"}}>No courses linked</span>
                      : (deptCourses[d] || []).map(c => <span key={c} className="tag">{c}<button onClick={() => removeDeptCourse(d, c)}>×</button></span>)
                    }
                  </div>
                ))}
              </div>
            </div>

            {/* Subjects */}
            <div style={{background:"white", borderRadius:"16px", border:"1px solid rgba(15,42,74,0.12)", padding:"28px"}}>
              <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:"20px", color:"#0F2A4A", margin:"0 0 4px"}}>📚 Subjects</h2>
              <p style={{color:"#4A6080", fontSize:"13px", margin:"0 0 16px"}}>Department → Course → Semester ke hisaab se subjects add karo</p>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"10px"}}>
                <select className="form-input" value={newSubjDept} onChange={e => setNewSubjDept(e.target.value)}>
                  <option value="">Select Department</option>
                  {departments.map(d => <option key={d}>{d}</option>)}
                </select>
                <select className="form-input" value={newSubjCourse} onChange={e => setNewSubjCourse(e.target.value)} disabled={!newSubjDept}>
                  <option value="">{newSubjDept ? "Select Course" : "Select Dept first"}</option>
                  {(deptCourses[newSubjDept] || []).map(c => <option key={c}>{c}</option>)}
                </select>
                <select className="form-input" value={newSubjSem} onChange={e => setNewSubjSem(e.target.value)} disabled={!newSubjCourse}>
                  <option value="">{newSubjCourse ? "Select Semester" : "Select Course first"}</option>
                  {SEMESTERS.map(s => <option key={s}>{s}</option>)}
                </select>
                <div style={{display:"flex", gap:"8px"}}>
                  <input className="form-input" placeholder="Subject name" value={newSubj} onChange={e => setNewSubj(e.target.value)} onKeyDown={e => e.key==="Enter" && addSubject()} disabled={!newSubjSem} />
                  <button className="btn-navy" onClick={addSubject}>Add</button>
                </div>
              </div>

              {/* Display subjects */}
              <div style={{marginTop:"20px"}}>
                {departments.length === 0 && <span style={{color:"#94a3b8", fontSize:"14px"}}>Add departments first</span>}
                {departments.map(dept => (
                  <div key={dept} style={{marginBottom:"20px"}}>
                    <div style={{fontSize:"14px", fontWeight:"700", color:"#0F2A4A", marginBottom:"10px", paddingBottom:"6px", borderBottom:"2px solid rgba(15,42,74,0.1)"}}>🏛️ {dept}</div>
                    {(deptCourses[dept] || []).length === 0
                      ? <span style={{color:"#94a3b8", fontSize:"13px", paddingLeft:"12px"}}>No courses linked</span>
                      : (deptCourses[dept] || []).map(course => (
                        <div key={course} style={{marginBottom:"12px", paddingLeft:"12px"}}>
                          <div style={{fontSize:"13px", fontWeight:"600", color:"#2D5FA0", marginBottom:"8px"}}>🎓 {course}</div>
                          {SEMESTERS.map(sem => {
                            const semSubjects = subjects[dept]?.[course]?.[sem] || [];
                            if (semSubjects.length === 0) return null;
                            return (
                              <div key={sem} style={{marginBottom:"8px", paddingLeft:"12px"}}>
                                <div style={{fontSize:"12px", fontWeight:"600", color:"#4A6080", marginBottom:"4px"}}>📅 {sem} Semester</div>
                                <div>
                                  {semSubjects.map(s => (
                                    <span key={s} className="tag">{s}<button onClick={() => removeSubject(dept, course, sem, s)}>×</button></span>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ))
                    }
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ADMINS */}
        {activeTab === "admins" && isSuperAdmin && (
          <div style={{display:"flex", flexDirection:"column", gap:"20px"}}>
            <div style={{background:"white", borderRadius:"16px", border:"1px solid rgba(15,42,74,0.12)", padding:"28px"}}>
              <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:"18px", color:"#0F2A4A", margin:"0 0 16px"}}>
                ⏳ Pending Admin Requests <span style={{background:"#FEF9C3", color:"#92400E", borderRadius:"20px", padding:"3px 10px", fontSize:"13px", marginLeft:"8px"}}>{pendingAdmins.length}</span>
              </h2>
              {pendingAdmins.length === 0 ? <p style={{color:"#94a3b8", fontSize:"14px"}}>No pending requests</p>
              : pendingAdmins.map(a => (
                <div key={a.email} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:"1px solid rgba(15,42,74,0.06)"}}>
                  <div>
                    <div style={{fontWeight:"600", color:"#0F2A4A"}}>{a.name}</div>
                    <div style={{color:"#4A6080", fontSize:"13px"}}>{a.email}</div>
                  </div>
                  <div style={{display:"flex", gap:"8px"}}>
                    <button className="btn-approve" onClick={() => approveAdmin(a.email)}>✅ Approve</button>
                    <button className="btn-reject" onClick={() => rejectAdmin(a.email)}>❌ Reject</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{background:"white", borderRadius:"16px", border:"1px solid rgba(15,42,74,0.12)", padding:"28px"}}>
              <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:"18px", color:"#0F2A4A", margin:"0 0 16px"}}>
                👑 Active Admins <span style={{background:"#E1F5EE", color:"#1D9E75", borderRadius:"20px", padding:"3px 10px", fontSize:"13px", marginLeft:"8px"}}>{activeAdmins.length}</span>
              </h2>
              {activeAdmins.length === 0 ? <p style={{color:"#94a3b8", fontSize:"14px"}}>No active admins</p>
              : activeAdmins.map(a => (
                <div key={a.email} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:"1px solid rgba(15,42,74,0.06)"}}>
                  <div>
                    <div style={{fontWeight:"600", color:"#0F2A4A"}}>
                      {a.name}
                      {a.email === "happyreehal584@gmail.com" && <span style={{background:"linear-gradient(135deg,#7C3AED,#5B21B6)", color:"white", fontSize:"10px", padding:"2px 8px", borderRadius:"20px", marginLeft:"8px"}}>SUPER</span>}
                    </div>
                    <div style={{color:"#4A6080", fontSize:"13px"}}>{a.email}</div>
                  </div>
                  {a.email !== "happyreehal584@gmail.com" && (
                    <button className="btn-danger" onClick={() => removeAdmin(a.email)}>🗑️ Remove</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: SUPER ADMIN */}
        {activeTab === "superadmin" && isSuperAdmin && (
          <div style={{display:"flex", flexDirection:"column", gap:"20px"}}>
            <div style={{background:"white", borderRadius:"16px", border:"2px solid #C4B5FD", padding:"28px"}}>
              <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:"20px", color:"#5B21B6", margin:"0 0 8px"}}>🔐 Change Admin Secret Key</h2>
              <p style={{color:"#4A6080", fontSize:"14px", margin:"0 0 20px"}}>Yeh key admin registration ke waqt required hogi.</p>
              <div style={{background:"#F3E8FF", border:"1px solid #C4B5FD", borderRadius:"10px", padding:"14px 16px", marginBottom:"20px"}}>
                <div style={{fontSize:"12px", fontWeight:"600", color:"#5B21B6", marginBottom:"4px"}}>Current Secret Key:</div>
                <div style={{fontFamily:"monospace", fontSize:"16px", color:"#0F2A4A", fontWeight:"600"}}>{currentSecret || "Loading..."}</div>
              </div>
              <div style={{display:"flex", flexDirection:"column", gap:"12px"}}>
                <div>
                  <label style={{display:"block", fontSize:"13px", fontWeight:"600", color:"#374151", marginBottom:"6px"}}>New Secret Key (min 8 characters)</label>
                  <input type="text" className="form-input" value={newSecret} onChange={e => setNewSecret(e.target.value)} placeholder="Enter new secret key" />
                </div>
                <button className="btn-purple" onClick={updateSecret} style={{alignSelf:"flex-start", padding:"12px 28px"}}>
                  🔄 Update Secret Key
                </button>
              </div>
            </div>
            <div style={{background:"#FEF2F2", borderRadius:"16px", border:"1px solid #FECACA", padding:"20px"}}>
              <h3 style={{color:"#DC2626", fontSize:"15px", fontWeight:"700", margin:"0 0 8px"}}>⚠️ Important</h3>
              <p style={{color:"#7F1D1D", fontSize:"14px", margin:0, lineHeight:"1.6"}}>
                Key change karne ke baad existing admins affect nahi honge. Sirf nayi registrations ke liye nayi key required hogi.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}