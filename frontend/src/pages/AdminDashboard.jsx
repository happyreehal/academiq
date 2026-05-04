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
    setUploading(true);
    setUploadMsg(""); setUploadErr("");
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
      flash("⚠️ All fields required for subject");
      return;
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
    <div style={{minHeight:"100vh", background:"#030810", fontFamily:"'DM Sans', sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        
        .adm-tab { 
          flex:1; padding:12px 16px; border:none; border-radius:4px; cursor:pointer; 
          font-size:12px; font-weight:600; font-family:'DM Sans',sans-serif; 
          color:rgba(255,255,255,0.5); background:transparent; transition:all 0.3s; white-space:nowrap; letter-spacing:1px; text-transform:uppercase;
        }
        .adm-tab.active { background:linear-gradient(135deg, rgba(29,158,117,0.2), transparent); color:#1D9E75; border:1px solid rgba(29,158,117,0.3); }
        .adm-tab.super-tab.active { background:linear-gradient(135deg, rgba(124,58,237,0.2), transparent); color:#A78BFA; border: 1px solid rgba(124,58,237,0.3); }
        .adm-tab:hover:not(.active) { color: white; background:rgba(255,255,255,0.05); }
        
        .form-input { 
          width:100%; padding:12px 16px; border:1px solid rgba(255,255,255,0.1); 
          border-radius:4px; font-size:14px; font-family:'DM Sans',sans-serif; 
          color:white; background:rgba(255,255,255,0.03); outline:none; transition:border-color 0.3s; box-sizing:border-box; 
        }
        .form-input:focus { border-color:#1D9E75; background:rgba(255,255,255,0.06); }
        .form-input option { background: #040b14; color: white; }
        
        .btn-navy, .btn-accent { 
          background:linear-gradient(135deg, #1D9E75, #0d7a5a); color:white; border:none; padding:12px 24px; 
          border-radius:4px; font-size:13px; font-weight:600; cursor:pointer; 
          font-family:'DM Sans',sans-serif; white-space:nowrap; letter-spacing:1px; transition:all 0.3s;
        }
        .btn-navy:hover, .btn-accent:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(29,158,117,0.2); }
        .btn-accent:disabled { opacity:0.6; cursor:not-allowed; transform: none; box-shadow: none; }
        
        .btn-danger { background:rgba(220,38,38,0.1); color:#EF4444; border:1px solid rgba(220,38,38,0.3); padding:6px 14px; border-radius:4px; font-size:12px; cursor:pointer; transition:all 0.2s; }
        .btn-danger:hover { background:rgba(220,38,38,0.2); }
        
        .btn-approve { background:rgba(29,158,117,0.1); color:#1D9E75; border:1px solid rgba(29,158,117,0.3); padding:6px 14px; border-radius:4px; font-size:12px; cursor:pointer; transition:all 0.2s; }
        .btn-approve:hover { background:rgba(29,158,117,0.2); }
        
        .btn-reject { background:rgba(234,179,8,0.1); color:#FACC15; border:1px solid rgba(234,179,8,0.3); padding:6px 14px; border-radius:4px; font-size:12px; cursor:pointer; transition:all 0.2s;}
        .btn-reject:hover { background:rgba(234,179,8,0.2); }
        
        .btn-purple { background:linear-gradient(135deg,#7C3AED,#5B21B6); color:white; border:none; padding:12px 24px; border-radius:4px; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.3s;}
        .btn-purple:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(124,58,237,0.2); }
        
        .tag { 
          display:inline-flex; align-items:center; gap:8px; 
          background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); 
          border-radius:2px; padding:6px 14px; font-size:12px; color:rgba(255,255,255,0.8); 
          font-weight:500; margin:4px; letter-spacing: 0.5px;
        }
        .tag button { background:none; border:none; cursor:pointer; color:rgba(255,255,255,0.4); font-size:15px; line-height:1; padding:0; transition:color 0.2s;}
        .tag button:hover { color:#EF4444; }
        
        .drop-zone { 
          border:1px dashed rgba(255,255,255,0.2); border-radius:4px; padding:40px; 
          text-align:center; cursor:pointer; transition:all 0.3s; background:rgba(255,255,255,0.02); 
        }
        .drop-zone.active { border-color:#1D9E75; background:rgba(29,158,117,0.05); }
        
        .paper-card { 
          background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); 
          border-radius:4px; padding:20px 24px; display:flex; justify-content:space-between; 
          align-items:center; margin-bottom:12px; transition:all 0.3s;
        }
        .paper-card:hover { border-color:rgba(29,158,117,0.3); background:rgba(29,158,117,0.02); transform:translateY(-2px);}
        
        .card { background:rgba(255,255,255,0.02); border-radius:4px; border:1px solid rgba(255,255,255,0.06); padding:36px; backdrop-filter: blur(20px); }
        
        /* Headers inside cards */
        .card-title { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 400; color: white; margin: 0 0 24px; }
        .label-text { display:block; font-size:11px; font-weight:600; color:rgba(255,255,255,0.5); margin-bottom:8px; letter-spacing:1px; text-transform:uppercase; }
      `}</style>

      {/* Navbar */}
      <nav style={{
        background:"rgba(3,8,16,0.95)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.06)",
        height:"72px", padding:"0 6%", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100
      }}>
        <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
          <div style={{width:"32px", height:"32px", background:"#1D9E75", borderRadius:"4px", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:"700", fontSize:"16px"}}>Q</div>
          <span style={{color:"white", fontWeight:"600", fontSize:"15px"}}>
            AcademiQ <span style={{color:"#1D9E75"}}>Admin</span>
            {isSuperAdmin && <span style={{background:"linear-gradient(135deg,#7C3AED,#5B21B6)", color:"white", fontSize:"9px", padding:"3px 8px", borderRadius:"2px", marginLeft:"10px", letterSpacing:"1px"}}>SUPER</span>}
          </span>
        </div>
        <div style={{display:"flex", alignItems:"center", gap:"16px"}}>
          <span style={{color:"rgba(255,255,255,0.5)", fontSize:"13px", letterSpacing:"1px"}}>👋 {user?.name}</span>
          <button onClick={() => { logout(); navigate("/login"); }} style={{background:"transparent", border:"1px solid rgba(255,255,255,0.2)", color:"rgba(255,255,255,0.8)", padding:"8px 16px", borderRadius:"4px", cursor:"pointer", fontSize:"12px", transition:"all 0.3s"}}>Logout</button>
        </div>
      </nav>

      <div style={{maxWidth:"1000px", margin:"0 auto", padding:"40px 20px"}}>

        {/* Tabs */}
        <div style={{display:"flex", gap:"8px", marginBottom:"36px", background:"rgba(255,255,255,0.02)", padding:"8px", borderRadius:"4px", border:"1px solid rgba(255,255,255,0.06)", flexWrap:"wrap", backdropFilter:"blur(20px)"}}>
          <button className={`adm-tab ${activeTab==="upload"?"active":""}`} onClick={() => setActiveTab("upload")}>📤 Upload</button>
          <button className={`adm-tab ${activeTab==="papers"?"active":""}`} onClick={() => setActiveTab("papers")}>📋 Papers</button>
          <button className={`adm-tab ${activeTab==="students"?"active":""}`} onClick={() => setActiveTab("students")}>
            👨‍🎓 Students {pendingStudents.length > 0 && <span style={{background:"rgba(239,68,68,0.2)", border:"1px solid rgba(239,68,68,0.5)", color:"#EF4444", borderRadius:"2px", padding:"2px 6px", fontSize:"10px", marginLeft:"6px"}}>{pendingStudents.length}</span>}
          </button>
          <button className={`adm-tab ${activeTab==="settings"?"active":""}`} onClick={() => setActiveTab("settings")}>⚙️ Settings</button>
          {isSuperAdmin && <>
            <button className={`adm-tab super-tab ${activeTab==="admins"?"active":""}`} onClick={() => setActiveTab("admins")}>
              👑 Admins {pendingAdmins.length > 0 && <span style={{background:"rgba(239,68,68,0.2)", border:"1px solid rgba(239,68,68,0.5)", color:"#EF4444", borderRadius:"2px", padding:"2px 6px", fontSize:"10px", marginLeft:"6px"}}>{pendingAdmins.length}</span>}
            </button>
            <button className={`adm-tab super-tab ${activeTab==="superadmin"?"active":""}`} onClick={() => setActiveTab("superadmin")}>🔐 Super</button>
          </>}
        </div>

        {settingsMsg && <div style={{background:"rgba(29,158,117,0.1)", border:"1px solid rgba(29,158,117,0.3)", color:"#1D9E75", padding:"12px 20px", borderRadius:"4px", fontSize:"13px", marginBottom:"24px"}}>{settingsMsg}</div>}
        {papersMsg && <div style={{background:"rgba(29,158,117,0.1)", border:"1px solid rgba(29,158,117,0.3)", color:"#1D9E75", padding:"12px 20px", borderRadius:"4px", fontSize:"13px", marginBottom:"24px"}}>{papersMsg}</div>}
        {superMsg && <div style={{background:"rgba(139,92,246,0.1)", border:"1px solid rgba(139,92,246,0.3)", color:"#A78BFA", padding:"12px 20px", borderRadius:"4px", fontSize:"13px", marginBottom:"24px"}}>{superMsg}</div>}

        {/* TAB 1: UPLOAD */}
        {activeTab === "upload" && (
          <div className="card">
            <h2 className="card-title">📤 Upload Question Paper</h2>
            {uploadMsg && <div style={{background:"rgba(29,158,117,0.1)", border:"1px solid rgba(29,158,117,0.3)", color:"#1D9E75", padding:"12px 16px", borderRadius:"4px", fontSize:"13px", marginBottom:"20px"}}>✅ {uploadMsg}</div>}
            {uploadErr && <div style={{background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", color:"#EF4444", padding:"12px 16px", borderRadius:"4px", fontSize:"13px", marginBottom:"20px"}}>⚠️ {uploadErr}</div>}
            
            <form onSubmit={handleUpload} style={{display:"flex", flexDirection:"column", gap:"20px"}}>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px"}}>
                <div>
                  <label className="label-text">Department</label>
                  <select className="form-input" value={form.department} onChange={e => setForm({...form, department:e.target.value, course:"", semester:"", subject:""})} required>
                    <option value="">Select Department</option>
                    {departments.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-text">Course</label>
                  <select className="form-input" value={form.course} onChange={e => setForm({...form, course:e.target.value, semester:"", subject:""})} required disabled={!form.department}>
                    <option value="">{form.department ? "Select Course" : "Select Dept first"}</option>
                    {uploadCourses.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-text">Semester</label>
                  <select className="form-input" value={form.semester} onChange={e => setForm({...form, semester:e.target.value, subject:""})} required disabled={!form.course}>
                    <option value="">{form.course ? "Select Semester" : "Select Course first"}</option>
                    {SEMESTERS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-text">Academic Year</label>
                  <input type="number" className="form-input" value={form.academic_year} onChange={e => setForm({...form, academic_year:e.target.value})} required placeholder="e.g. 2024" min="2000" max="2030" />
                </div>
              </div>
              <div>
                <label className="label-text">Subject</label>
                <select className="form-input" value={form.subject} onChange={e => setForm({...form, subject:e.target.value})} required disabled={!form.semester}>
                  <option value="">{form.semester ? (uploadSubjects.length > 0 ? "Select Subject" : "No subjects for this semester — add in Settings") : "Select Semester first"}</option>
                  {uploadSubjects.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label-text">Upload PDF</label>
                <div className={`drop-zone ${dragOver?"active":""}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); const f=e.dataTransfer.files[0]; if(f?.name.endsWith(".pdf")) setForm({...form,file:f}); }}
                  onClick={() => document.getElementById("fileInput").click()}>
                  <input id="fileInput" type="file" accept=".pdf" style={{display:"none"}} onChange={e => setForm({...form, file:e.target.files[0]})} />
                  {form.file ? (
                    <div><div style={{fontSize:"32px", marginBottom:"12px"}}>📄</div><div style={{color:"#1D9E75", fontWeight:"500"}}>{form.file.name}</div><div style={{color:"rgba(255,255,255,0.4)", fontSize:"12px", marginTop:"6px"}}>Click to change</div></div>
                  ) : (
                    <div><div style={{fontSize:"32px", marginBottom:"12px", opacity:0.7}}>☁️</div><div style={{color:"white", fontWeight:"400", letterSpacing:"1px"}}>Drag & drop PDF here</div><div style={{color:"rgba(255,255,255,0.4)", fontSize:"12px", marginTop:"6px"}}>or click to browse</div></div>
                  )}
                </div>
              </div>
              <button type="submit" disabled={uploading} className="btn-accent" style={{marginTop:"10px"}}>
                {uploading ? "⏳ Uploading..." : "📤 Upload Paper"}
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: PAPERS */}
        {activeTab === "papers" && (
          <div className="card">
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px"}}>
              <h2 className="card-title" style={{margin:0}}>📋 Manage Papers</h2>
              <span style={{background:"rgba(29,158,117,0.1)", border:"1px solid rgba(29,158,117,0.3)", color:"#1D9E75", borderRadius:"2px", padding:"6px 14px", fontSize:"12px", fontWeight:"500", letterSpacing:"1px"}}>{filteredPapers.length} PAPERS</span>
            </div>
            <div style={{display:"flex", gap:"16px", marginBottom:"28px"}}>
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
              <div style={{textAlign:"center", padding:"60px", color:"rgba(255,255,255,0.3)"}}><div style={{fontSize:"40px", opacity:0.5, marginBottom:"12px"}}>📭</div><div style={{fontWeight:"300", letterSpacing:"1px"}}>No papers found</div></div>
            ) : filteredPapers.map((paper, idx) => (
              <div key={idx} className="paper-card">
                <div>
                  <div style={{fontWeight:"500", color:"white", fontSize:"15px", marginBottom:"6px"}}>{paper.subject} — <span style={{color:"#1D9E75"}}>{paper.academic_year}</span></div>
                  <div style={{color:"rgba(255,255,255,0.5)", fontSize:"12px", marginBottom:"4px", letterSpacing:"0.5px"}}>{paper.department} | {paper.class_name} | {paper.semester} Semester</div>
                  <div style={{color:"rgba(255,255,255,0.3)", fontSize:"11px"}}>By: {paper.uploaded_by}</div>
                </div>
                <div style={{display:"flex", gap:"12px"}}>
                  <a href={paper.file_url} target="_blank" rel="noreferrer"
                    style={{padding:"8px 16px", background:"rgba(29,158,117,0.1)", color:"#1D9E75", borderRadius:"4px", fontSize:"12px", fontWeight:"500", textDecoration:"none", border:"1px solid rgba(29,158,117,0.3)", transition:"all 0.3s"}}>
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
          <div style={{display:"flex", flexDirection:"column", gap:"24px"}}>
            {/* Pending */}
            <div className="card">
              <h2 className="card-title">
                ⏳ Pending Requests <span style={{background:"rgba(234,179,8,0.1)", border:"1px solid rgba(234,179,8,0.3)", color:"#FACC15", borderRadius:"2px", padding:"4px 10px", fontSize:"12px", marginLeft:"12px", fontFamily:"'DM Sans'"}}>{pendingStudents.length}</span>
              </h2>
              {pendingStudents.length === 0 ? <p style={{color:"rgba(255,255,255,0.4)", fontSize:"13px", fontWeight:"300"}}>No pending requests</p>
              : pendingStudents.map(s => (
                <div key={s.email} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 0", borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                  <div>
                    <div style={{fontWeight:"500", color:"white", marginBottom:"4px"}}>{s.name}</div>
                    <div style={{color:"rgba(255,255,255,0.5)", fontSize:"12px"}}>{s.email} {s.college_id && `• ${s.college_id}`}</div>
                  </div>
                  <div style={{display:"flex", gap:"10px"}}>
                    <button className="btn-approve" onClick={() => approveStudent(s.email)}>✅ Approve</button>
                    <button className="btn-reject" onClick={() => rejectStudent(s.email)}>❌ Reject</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Active */}
            <div className="card">
              <h2 className="card-title">
                ✅ Active Students <span style={{background:"rgba(29,158,117,0.1)", border:"1px solid rgba(29,158,117,0.3)", color:"#1D9E75", borderRadius:"2px", padding:"4px 10px", fontSize:"12px", marginLeft:"12px", fontFamily:"'DM Sans'"}}>{activeStudents.length}</span>
              </h2>
              {activeStudents.length === 0 ? <p style={{color:"rgba(255,255,255,0.4)", fontSize:"13px", fontWeight:"300"}}>No active students</p>
              : activeStudents.map(s => (
                <div key={s.email} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 0", borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                  <div>
                    <div style={{fontWeight:"500", color:"white", marginBottom:"4px"}}>{s.name}</div>
                    <div style={{color:"rgba(255,255,255,0.5)", fontSize:"12px"}}>{s.email} {s.college_id && `• ${s.college_id}`}</div>
                  </div>
                  <button className="btn-danger" onClick={() => removeStudent(s.email)}>🗑️ Remove</button>
                </div>
              ))}
            </div>

            {/* Rejected */}
            {rejectedStudents.length > 0 && (
              <div className="card">
                <h2 className="card-title">
                  ❌ Rejected <span style={{background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", color:"#EF4444", borderRadius:"2px", padding:"4px 10px", fontSize:"12px", marginLeft:"12px", fontFamily:"'DM Sans'"}}>{rejectedStudents.length}</span>
                </h2>
                {rejectedStudents.map(s => (
                  <div key={s.email} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 0", borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                    <div>
                      <div style={{fontWeight:"500", color:"white", marginBottom:"4px"}}>{s.name}</div>
                      <div style={{color:"rgba(255,255,255,0.5)", fontSize:"12px"}}>{s.email}</div>
                    </div>
                    <div style={{display:"flex", gap:"10px"}}>
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
          <div style={{display:"flex", flexDirection:"column", gap:"24px"}}>

            {/* Departments */}
            <div className="card">
              <h2 className="card-title">🏛️ Departments</h2>
              <div style={{display:"flex", gap:"12px"}}>
                <input className="form-input" placeholder="e.g. Computer Science" value={newDept} onChange={e => setNewDept(e.target.value)} onKeyDown={e => e.key==="Enter" && addDept()} />
                <button className="btn-navy" onClick={addDept}>Add</button>
              </div>
              <div style={{marginTop:"20px"}}>
                {departments.length === 0 && <span style={{color:"rgba(255,255,255,0.4)", fontSize:"13px", fontWeight:"300"}}>No departments yet</span>}
                {departments.map(d => <span key={d} className="tag">{d}<button onClick={() => removeDept(d)}>×</button></span>)}
              </div>
            </div>

            {/* Courses */}
            <div className="card">
              <h2 className="card-title">🎓 Courses</h2>
              <div style={{display:"flex", gap:"12px"}}>
                <input className="form-input" placeholder="e.g. B.Tech, MCA, M.Sc" value={newCourse} onChange={e => setNewCourse(e.target.value)} onKeyDown={e => e.key==="Enter" && addCourse()} />
                <button className="btn-navy" onClick={addCourse}>Add</button>
              </div>
              <div style={{marginTop:"20px"}}>
                {courses.length === 0 && <span style={{color:"rgba(255,255,255,0.4)", fontSize:"13px", fontWeight:"300"}}>No courses yet</span>}
                {courses.map(c => <span key={c} className="tag">{c}<button onClick={() => removeCourse(c)}>×</button></span>)}
              </div>
            </div>

            {/* Dept-Course Mapping */}
            <div className="card">
              <h2 className="card-title" style={{marginBottom:"8px"}}>🔗 Department → Course Mapping</h2>
              <p style={{color:"rgba(255,255,255,0.4)", fontSize:"13px", margin:"0 0 24px", fontWeight:"300"}}>Har department ke saath linked courses dikhenge</p>
              <div style={{display:"flex", gap:"12px", flexWrap:"wrap"}}>
                <select className="form-input" style={{flex:1}} value={mapDept} onChange={e => setMapDept(e.target.value)}>
                  <option value="">Select Department</option>
                  {departments.map(d => <option key={d}>{d}</option>)}
                </select>
                <select className="form-input" style={{flex:1}} value={mapCourse} onChange={e => setMapCourse(e.target.value)}>
                  <option value="">Select Course</option>
                  {courses.map(c => <option key={c}>{c}</option>)}
                </select>
                <button className="btn-navy" onClick={addDeptCourse}>Link</button>
              </div>
              <div style={{marginTop:"24px"}}>
                {departments.map(d => (
                  <div key={d} style={{marginBottom:"20px", background:"rgba(255,255,255,0.01)", padding:"16px", borderRadius:"4px", border:"1px solid rgba(255,255,255,0.04)"}}>
                    <div style={{fontSize:"11px", fontWeight:"600", color:"rgba(255,255,255,0.6)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"10px"}}>{d}</div>
                    {(deptCourses[d] || []).length === 0
                      ? <span style={{color:"rgba(255,255,255,0.3)", fontSize:"12px", fontStyle:"italic"}}>No courses linked</span>
                      : (deptCourses[d] || []).map(c => <span key={c} className="tag">{c}<button onClick={() => removeDeptCourse(d, c)}>×</button></span>)
                    }
                  </div>
                ))}
              </div>
            </div>

            {/* Subjects */}
            <div className="card">
              <h2 className="card-title" style={{marginBottom:"8px"}}>📚 Subjects</h2>
              <p style={{color:"rgba(255,255,255,0.4)", fontSize:"13px", margin:"0 0 24px", fontWeight:"300"}}>Department → Course → Semester ke hisaab se subjects add karo</p>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"20px"}}>
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
                <div style={{display:"flex", gap:"12px"}}>
                  <input className="form-input" placeholder="Subject name" value={newSubj} onChange={e => setNewSubj(e.target.value)} onKeyDown={e => e.key==="Enter" && addSubject()} disabled={!newSubjSem} />
                  <button className="btn-navy" onClick={addSubject}>Add</button>
                </div>
              </div>

              {/* Display subjects */}
              <div style={{marginTop:"32px"}}>
                {departments.length === 0 && <span style={{color:"rgba(255,255,255,0.4)", fontSize:"13px", fontWeight:"300"}}>Add departments first</span>}
                {departments.map(dept => (
                  <div key={dept} style={{marginBottom:"32px"}}>
                    <div style={{fontSize:"16px", fontWeight:"500", color:"white", marginBottom:"16px", paddingBottom:"8px", borderBottom:"1px solid rgba(255,255,255,0.06)"}}>🏛️ {dept}</div>
                    {(deptCourses[dept] || []).length === 0
                      ? <span style={{color:"rgba(255,255,255,0.3)", fontSize:"12px", paddingLeft:"16px", fontStyle:"italic"}}>No courses linked</span>
                      : (deptCourses[dept] || []).map(course => (
                        <div key={course} style={{marginBottom:"20px", paddingLeft:"16px", borderLeft:"1px solid rgba(255,255,255,0.06)"}}>
                          <div style={{fontSize:"13px", fontWeight:"500", color:"#1D9E75", marginBottom:"12px", letterSpacing:"0.5px"}}>🎓 {course}</div>
                          {SEMESTERS.map(sem => {
                            const semSubjects = subjects[dept]?.[course]?.[sem] || [];
                            if (semSubjects.length === 0) return null;
                            return (
                              <div key={sem} style={{marginBottom:"12px", paddingLeft:"16px"}}>
                                <div style={{fontSize:"11px", fontWeight:"600", color:"rgba(255,255,255,0.5)", marginBottom:"8px", textTransform:"uppercase", letterSpacing:"1px"}}>📅 {sem} Semester</div>
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
          <div style={{display:"flex", flexDirection:"column", gap:"24px"}}>
            <div className="card">
              <h2 className="card-title">
                ⏳ Pending Admin Requests <span style={{background:"rgba(234,179,8,0.1)", border:"1px solid rgba(234,179,8,0.3)", color:"#FACC15", borderRadius:"2px", padding:"4px 10px", fontSize:"12px", marginLeft:"12px", fontFamily:"'DM Sans'"}}>{pendingAdmins.length}</span>
              </h2>
              {pendingAdmins.length === 0 ? <p style={{color:"rgba(255,255,255,0.4)", fontSize:"13px", fontWeight:"300"}}>No pending requests</p>
              : pendingAdmins.map(a => (
                <div key={a.email} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 0", borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                  <div>
                    <div style={{fontWeight:"500", color:"white", marginBottom:"4px"}}>{a.name}</div>
                    <div style={{color:"rgba(255,255,255,0.5)", fontSize:"12px"}}>{a.email}</div>
                  </div>
                  <div style={{display:"flex", gap:"10px"}}>
                    <button className="btn-approve" onClick={() => approveAdmin(a.email)}>✅ Approve</button>
                    <button className="btn-reject" onClick={() => rejectAdmin(a.email)}>❌ Reject</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="card">
              <h2 className="card-title">
                👑 Active Admins <span style={{background:"rgba(29,158,117,0.1)", border:"1px solid rgba(29,158,117,0.3)", color:"#1D9E75", borderRadius:"2px", padding:"4px 10px", fontSize:"12px", marginLeft:"12px", fontFamily:"'DM Sans'"}}>{activeAdmins.length}</span>
              </h2>
              {activeAdmins.length === 0 ? <p style={{color:"rgba(255,255,255,0.4)", fontSize:"13px", fontWeight:"300"}}>No active admins</p>
              : activeAdmins.map(a => (
                <div key={a.email} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 0", borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                  <div>
                    <div style={{fontWeight:"500", color:"white", display:"flex", alignItems:"center", marginBottom:"4px"}}>
                      {a.name}
                      {a.email === "happyreehal584@gmail.com" && <span style={{background:"linear-gradient(135deg,#7C3AED,#5B21B6)", color:"white", fontSize:"9px", padding:"3px 8px", borderRadius:"2px", marginLeft:"10px", letterSpacing:"1px"}}>SUPER</span>}
                    </div>
                    <div style={{color:"rgba(255,255,255,0.5)", fontSize:"12px"}}>{a.email}</div>
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
          <div style={{display:"flex", flexDirection:"column", gap:"24px"}}>
            <div className="card" style={{borderColor:"rgba(139,92,246,0.3)", background:"linear-gradient(135deg, rgba(139,92,246,0.02), transparent)"}}>
              <h2 className="card-title" style={{color:"#A78BFA", marginBottom:"8px"}}>🔐 Change Admin Secret Key</h2>
              <p style={{color:"rgba(255,255,255,0.5)", fontSize:"13px", margin:"0 0 28px", fontWeight:"300"}}>Yeh key admin registration ke waqt required hogi.</p>
              <div style={{background:"rgba(139,92,246,0.05)", border:"1px solid rgba(139,92,246,0.2)", borderRadius:"4px", padding:"20px", marginBottom:"28px"}}>
                <div style={{fontSize:"11px", fontWeight:"600", color:"rgba(167,139,250,0.8)", marginBottom:"8px", letterSpacing:"1px", textTransform:"uppercase"}}>Current Secret Key:</div>
                <div style={{fontFamily:"monospace", fontSize:"18px", color:"white", letterSpacing:"2px"}}>{currentSecret || "Loading..."}</div>
              </div>
              <div style={{display:"flex", flexDirection:"column", gap:"16px"}}>
                <div>
                  <label className="label-text">New Secret Key (min 8 characters)</label>
                  <input type="text" className="form-input" value={newSecret} onChange={e => setNewSecret(e.target.value)} placeholder="Enter new secret key" />
                </div>
                <button className="btn-purple" onClick={updateSecret} style={{alignSelf:"flex-start", marginTop:"8px"}}>
                  🔄 Update Secret Key
                </button>
              </div>
            </div>
            <div style={{background:"rgba(239,68,68,0.05)", borderRadius:"4px", border:"1px solid rgba(239,68,68,0.2)", padding:"24px"}}>
              <h3 style={{color:"#EF4444", fontSize:"14px", fontWeight:"600", margin:"0 0 10px", letterSpacing:"1px", textTransform:"uppercase"}}>⚠️ Important</h3>
              <p style={{color:"rgba(239,68,68,0.8)", fontSize:"13px", margin:0, lineHeight:"1.6", fontWeight:"300"}}>
                Key change karne ke baad existing admins affect nahi honge. Sirf nayi registrations ke liye nayi key required hogi.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}