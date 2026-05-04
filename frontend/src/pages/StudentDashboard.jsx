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
  const [deptCourses, setDeptCourses] = useState({});
  const [subjects, setSubjects] = useState({});

  const [filters, setFilters] = useState({ department:"", course:"", semester:"", subject:"" });
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const [d, dc, s] = await Promise.all([
          axios.get(`${API}/settings/departments`),
          axios.get(`${API}/settings/dept-courses`),
          axios.get(`${API}/settings/subjects`),
        ]);
        setDepartments(d.data.departments);
        setDeptCourses(dc.data.dept_courses);
        setSubjects(s.data.subjects);
      } catch (_) {}
    }
    fetchSettings();
  }, []);

  const filteredCourses = filters.department ? (deptCourses[filters.department] || []) : [];
  const filteredSubjects =
    filters.department && filters.course && filters.semester
      ? (subjects[filters.department]?.[filters.course]?.[filters.semester] || [])
      : [];

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const params = {};
      if (filters.department) params.department = filters.department;
      if (filters.course)     params.class_name = filters.course;
      if (filters.semester)   params.semester = filters.semester;
      if (filters.subject)    params.subject = filters.subject;

      const res = await axios.get(`${API}/papers/list`, { params });
      setPapers(res.data.papers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const viewUrl = (url) => {
    const cleanUrl = url.replace("/image/upload/fl_attachment/", "/raw/upload/")
                        .replace("/image/upload/", "/raw/upload/");
    return `https://docs.google.com/viewer?url=${encodeURIComponent(cleanUrl)}`;
  };

  const downloadUrl = (url) => {
    return `${API}/papers/download?url=${encodeURIComponent(url)}`;
  };

  return (
    <div style={{minHeight:"100vh", background:"#030810", fontFamily:"'DM Sans', sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        
        .form-input { 
          width:100%; padding:11px 14px; 
          border:1px solid rgba(255,255,255,0.1); 
          border-radius:4px; font-size:14px; 
          font-family:'DM Sans',sans-serif; color:white; 
          background:rgba(255,255,255,0.03); 
          outline:none; transition:border-color 0.2s; box-sizing:border-box; 
        }
        .form-input:focus { border-color:#1D9E75; background:rgba(255,255,255,0.06); }
        .form-input:disabled { opacity:0.5; cursor:not-allowed; }
        .form-input option { background: #040b14; color: white; }
        
        .paper-card { 
          background:rgba(255,255,255,0.02); 
          border:1px solid rgba(255,255,255,0.06); 
          border-radius:4px; padding:20px 24px; 
          display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; 
          transition:all 0.4s ease; position: relative; overflow: hidden;
        }
        .paper-card:hover { background:rgba(29,158,117,0.04); border-color:rgba(29,158,117,0.2); transform:translateY(-2px); }
        
        .btn-view { 
          background:rgba(255,255,255,0.05); color:white; padding:8px 16px; border-radius:4px; 
          font-size:13px; font-weight:500; text-decoration:none; display:inline-block; border: 1px solid rgba(255,255,255,0.1); transition: all 0.3s;
        }
        .btn-view:hover { background:rgba(255,255,255,0.1); }
        
        .btn-download { 
          background:linear-gradient(135deg, #1D9E75, #0d7a5a); color:white; padding:8px 16px; border-radius:4px; font-size:13px; font-weight:500; text-decoration:none; border:none; display:inline-block; transition: all 0.3s;
        }
        .btn-download:hover { box-shadow: 0 10px 20px rgba(29,158,117,0.3); transform: translateY(-1px); }
      `}</style>

      {/* Navbar */}
      <nav style={{
        background:"rgba(3,8,16,0.95)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.06)",
        height:"72px", padding:"0 6%", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100
      }}>
        <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
          <div style={{width:"32px", height:"32px", background:"#1D9E75", borderRadius:"4px", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:"700", fontSize:"16px"}}>Q</div>
          <span style={{color:"white", fontWeight:"600", fontSize:"15px"}}>AcademiQ <span style={{color:"#1D9E75"}}>Student Portal</span></span>
        </div>
        <div style={{display:"flex", alignItems:"center", gap:"14px"}}>
          <button onClick={() => navigate("/ai-generator")}
            style={{background:"rgba(29,158,117,0.1)", color:"#1D9E75", border:"1px solid rgba(29,158,117,0.3)", padding:"8px 14px", borderRadius:"4px", fontSize:"13px", fontWeight:"500", cursor:"pointer", transition:"all 0.3s"}}>
            🤖 AI Generator
          </button>
          <span style={{color:"rgba(255,255,255,0.5)", fontSize:"13px", letterSpacing:"1px"}}>👋 {user?.name}</span>
          <button onClick={() => { logout(); navigate("/login"); }}
            style={{background:"transparent", border:"1px solid rgba(255,255,255,0.2)", color:"rgba(255,255,255,0.8)", padding:"8px 14px", borderRadius:"4px", fontSize:"13px", cursor:"pointer", transition:"all 0.3s"}}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{maxWidth:"860px", margin:"0 auto", padding:"60px 20px"}}>

        {/* Filter Card */}
        <div style={{background:"rgba(255,255,255,0.02)", borderRadius:"4px", border:"1px solid rgba(255,255,255,0.06)", padding:"36px", marginBottom:"30px", backdropFilter:"blur(20px)"}}>
          <h2 style={{fontFamily:"'Cormorant Garamond', serif", fontSize:"28px", fontWeight:"400", color:"white", margin:"0 0 24px"}}>🔍 Filter Question Papers</h2>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px"}}>

            <div>
              <label style={{display:"block", fontSize:"12px", fontWeight:"500", color:"rgba(255,255,255,0.5)", marginBottom:"8px", letterSpacing:"1px", textTransform:"uppercase"}}>Department</label>
              <select className="form-input" value={filters.department}
                onChange={e => setFilters({...filters, department:e.target.value, course:"", semester:"", subject:""})}>
                <option value="">All Departments</option>
                {departments.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label style={{display:"block", fontSize:"12px", fontWeight:"500", color:"rgba(255,255,255,0.5)", marginBottom:"8px", letterSpacing:"1px", textTransform:"uppercase"}}>Course</label>
              <select className="form-input" value={filters.course}
                onChange={e => setFilters({...filters, course:e.target.value, semester:"", subject:""})}
                disabled={!filters.department}>
                <option value="">{filters.department ? "All Courses" : "Select Department first"}</option>
                {filteredCourses.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label style={{display:"block", fontSize:"12px", fontWeight:"500", color:"rgba(255,255,255,0.5)", marginBottom:"8px", letterSpacing:"1px", textTransform:"uppercase"}}>Semester</label>
              <select className="form-input" value={filters.semester}
                onChange={e => setFilters({...filters, semester:e.target.value, subject:""})}
                disabled={!filters.course}>
                <option value="">{filters.course ? "All Semesters" : "Select Course first"}</option>
                {SEMESTERS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label style={{display:"block", fontSize:"12px", fontWeight:"500", color:"rgba(255,255,255,0.5)", marginBottom:"8px", letterSpacing:"1px", textTransform:"uppercase"}}>Subject</label>
              <select className="form-input" value={filters.subject}
                onChange={e => setFilters({...filters, subject:e.target.value})}
                disabled={!filters.semester}>
                <option value="">{filters.semester ? "All Subjects" : "Select Semester first"}</option>
                {filteredSubjects.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

          </div>

          <button onClick={handleSearch}
            style={{marginTop:"28px", background:"linear-gradient(135deg, #1D9E75, #0d7a5a)", color:"white", border:"none", padding:"14px 32px", borderRadius:"4px", fontSize:"14px", fontWeight:"600", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", letterSpacing:"1px", transition:"all 0.3s"}}>
            {loading ? "⏳ Searching..." : "🔍 Search Papers"}
          </button>
        </div>

        {/* Results */}
        {searched && (
          <div style={{background:"rgba(255,255,255,0.02)", borderRadius:"4px", border:"1px solid rgba(255,255,255,0.06)", padding:"36px", backdropFilter:"blur(20px)"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px"}}>
              <h2 style={{fontFamily:"'Cormorant Garamond', serif", fontSize:"28px", fontWeight:"400", color:"white", margin:0}}>
                Results
              </h2>
              <span style={{background:"rgba(29,158,117,0.1)", border:"1px solid rgba(29,158,117,0.3)", color:"#1D9E75", borderRadius:"2px", padding:"6px 14px", fontSize:"12px", fontWeight:"500", letterSpacing:"1px"}}>
                {papers.length} PAPER{papers.length !== 1 ? "S" : ""} FOUND
              </span>
            </div>

            {papers.length === 0 ? (
              <div style={{textAlign:"center", padding:"60px 20px", color:"rgba(255,255,255,0.3)"}}>
                <div style={{fontSize:"42px", marginBottom:"16px", opacity:0.5}}>📭</div>
                <div style={{fontWeight:"300", letterSpacing:"1px"}}>No papers found for selected filters</div>
              </div>
            ) : (
              <div style={{display:"flex", flexDirection:"column", gap:"12px"}}>
                {papers.map((paper, idx) => (
                  <div key={idx} className="paper-card">
                    <div>
                      <div style={{fontWeight:"500", color:"white", fontSize:"16px", marginBottom:"6px"}}>
                        {paper.subject} — <span style={{color:"#1D9E75"}}>{paper.academic_year}</span>
                      </div>
                      <div style={{color:"rgba(255,255,255,0.4)", fontSize:"13px", fontWeight:"300"}}>
                        {paper.department} · {paper.class_name} · {paper.semester} Semester
                      </div>
                    </div>
                    <div style={{display:"flex", gap:"10px", flexWrap:"wrap"}}>
                      <a href={viewUrl(paper.file_url)} target="_blank" rel="noreferrer" className="btn-view">
                        👁️ View
                      </a>
                      <a href={downloadUrl(paper.file_url)} target="_blank" rel="noreferrer" className="btn-download">
                        ⬇️ Download
                      </a>
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