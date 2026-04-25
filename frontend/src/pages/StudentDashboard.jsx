import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API = "https://academiq-jenb.onrender.com";
const SEMESTERS = ["1st","2nd","3rd","4th","5th","6th","7th","8th"];

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [deptClasses, setDeptClasses] = useState({});
  const [subjects, setSubjects] = useState({});

  const [filters, setFilters] = useState({ department:"", class_name:"", semester:"", subject:"" });
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const [d, dc, s] = await Promise.all([
          axios.get(`${API}/settings/departments`),
          axios.get(`${API}/settings/dept-classes`),
          axios.get(`${API}/settings/subjects`),
        ]);
        setDepartments(d.data.departments);
        setDeptClasses(dc.data.dept_classes);
        setSubjects(s.data.subjects);
      } catch (_) {}
    }
    fetchSettings();
  }, []);

  const filteredClasses = filters.department ? (deptClasses[filters.department] || []) : [];
  const filteredSubjects = filters.department ? (subjects[filters.department] || []) : [];

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const params = {};
      if (filters.department) params.department = filters.department;
      if (filters.class_name) params.class_name = filters.class_name;
      if (filters.semester) params.semester = filters.semester;
      if (filters.subject) params.subject = filters.subject;
      const res = await axios.get(`${API}/papers/list`, { params });
      setPapers(res.data.papers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight:"100vh", background:"#F4F7FB", fontFamily:"'DM Sans', sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        .form-input { width:100%; padding:11px 14px; border:1px solid rgba(15,42,74,0.12); border-radius:8px; font-size:14px; font-family:'DM Sans',sans-serif; color:#0F2A4A; background:#F4F7FB; outline:none; transition:border-color 0.2s; box-sizing:border-box; }
        .form-input:focus { border-color:#2D5FA0; background:white; }
        .form-input:disabled { opacity:0.5; cursor:not-allowed; }
      `}</style>

      {/* Navbar */}
      <nav style={{background:"#0F2A4A", height:"64px", padding:"0 32px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100}}>
        <span style={{color:"white", fontWeight:"600", fontSize:"15px"}}>AcademiQ <span style={{color:"#1D9E75"}}>Student Portal</span></span>
        <div style={{display:"flex", alignItems:"center", gap:"12px"}}>
          <button onClick={() => navigate("/ai-generator")} style={{background:"#1D9E75", color:"white", border:"none", padding:"8px 16px", borderRadius:"8px", fontSize:"13px", fontWeight:"500", cursor:"pointer"}}>🤖 AI Generator</button>
          <span style={{color:"rgba(255,255,255,0.7)", fontSize:"14px"}}>👋 {user?.name}</span>
          <button onClick={() => { logout(); navigate("/login"); }} style={{background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.25)", color:"white", padding:"8px 16px", borderRadius:"8px", fontSize:"13px", cursor:"pointer"}}>Logout</button>
        </div>
      </nav>

      <div style={{maxWidth:"800px", margin:"0 auto", padding:"36px 20px"}}>

        {/* Filter Card */}
        <div style={{background:"white", borderRadius:"16px", border:"1px solid rgba(15,42,74,0.12)", padding:"28px", marginBottom:"20px"}}>
          <h2 style={{fontSize:"18px", fontWeight:"600", color:"#0F2A4A", margin:"0 0 20px"}}>🔍 Filter Question Papers</h2>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px"}}>
            <div>
              <label style={{display:"block", fontSize:"13px", fontWeight:"600", color:"#374151", marginBottom:"6px"}}>Department</label>
              <select className="form-input" value={filters.department}
                onChange={e => setFilters({...filters, department:e.target.value, class_name:"", subject:""})}>
                <option value="">All Departments</option>
                {departments.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={{display:"block", fontSize:"13px", fontWeight:"600", color:"#374151", marginBottom:"6px"}}>Class</label>
              <select className="form-input" value={filters.class_name}
                onChange={e => setFilters({...filters, class_name:e.target.value})}
                disabled={!filters.department}>
                <option value="">{filters.department ? "All Classes" : "Select Department first"}</option>
                {filteredClasses.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{display:"block", fontSize:"13px", fontWeight:"600", color:"#374151", marginBottom:"6px"}}>Semester</label>
              <select className="form-input" value={filters.semester}
                onChange={e => setFilters({...filters, semester:e.target.value})}>
                <option value="">All Semesters</option>
                {SEMESTERS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{display:"block", fontSize:"13px", fontWeight:"600", color:"#374151", marginBottom:"6px"}}>Subject</label>
              <select className="form-input" value={filters.subject}
                onChange={e => setFilters({...filters, subject:e.target.value})}
                disabled={!filters.department}>
                <option value="">{filters.department ? "All Subjects" : "Select Department first"}</option>
                {filteredSubjects.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <button onClick={handleSearch} style={{marginTop:"20px", background:"#0F2A4A", color:"white", border:"none", padding:"12px 28px", borderRadius:"8px", fontSize:"14px", fontWeight:"500", cursor:"pointer"}}>
            {loading ? "⏳ Searching..." : "🔍 Search Papers"}
          </button>
        </div>

        {/* Results */}
        {searched && (
          <div style={{background:"white", borderRadius:"16px", border:"1px solid rgba(15,42,74,0.12)", padding:"28px"}}>
            <h2 style={{fontSize:"18px", fontWeight:"600", color:"#0F2A4A", margin:"0 0 16px"}}>
              {papers.length} Paper{papers.length !== 1 ? "s" : ""} Found
            </h2>
            {papers.length === 0 ? (
              <div style={{textAlign:"center", padding:"40px", color:"#94a3b8"}}>
                <div style={{fontSize:"32px", marginBottom:"8px"}}>📭</div>
                <div>No papers found for selected filters</div>
              </div>
            ) : (
              <div style={{display:"flex", flexDirection:"column", gap:"12px"}}>
                {papers.map((paper, idx) => (
                  <div key={idx} style={{border:"1px solid rgba(15,42,74,0.12)", borderRadius:"12px", padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                    <div>
                      <div style={{fontWeight:"600", color:"#0F2A4A", fontSize:"15px"}}>{paper.subject} — {paper.academic_year}</div>
                      <div style={{color:"#4A6080", fontSize:"13px", marginTop:"4px"}}>{paper.department} · {paper.class_name} · {paper.semester} Semester</div>
                    </div>
                    <div style={{display:"flex", gap:"8px"}}>
                      <a href={paper.file_url} target="_blank" rel="noreferrer"
                        style={{background:"#0F2A4A", color:"white", padding:"8px 16px", borderRadius:"8px", fontSize:"13px", fontWeight:"500", textDecoration:"none"}}>View</a>
                      <a href={paper.file_url} download
                        style={{background:"#E1F5EE", color:"#1D9E75", padding:"8px 16px", borderRadius:"8px", fontSize:"13px", fontWeight:"500", textDecoration:"none", border:"1px solid rgba(29,158,117,0.3)"}}>Download</a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}