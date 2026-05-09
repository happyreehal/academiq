import { useState } from "react";
import { SEMESTERS } from "../../data/adminConstants";

export default function SettingsTab({ 
  departments, courses, subjects, deptCourses,
  addDept, removeDept, addCourse, removeCourse,
  addSubject, removeSubject, addDeptCourse, removeDeptCourse 
}) {
  const [newDept, setNewDept] = useState("");
  const [newCourse, setNewCourse] = useState("");
  const [mapDept, setMapDept] = useState("");
  const [mapCourse, setMapCourse] = useState("");
  const [newSubjDept, setNewSubjDept] = useState("");
  const [newSubjCourse, setNewSubjCourse] = useState("");
  const [newSubjSem, setNewSubjSem] = useState("");
  const [newSubj, setNewSubj] = useState("");

  // ✅ Fix 1 — trim() + clear only if value exists
  const handleAddDept = () => {
    if (!newDept.trim()) return;
    addDept(newDept.trim());
    setNewDept("");
  };

  const handleAddCourse = () => {
    if (!newCourse.trim()) return;
    addCourse(newCourse.trim());
    setNewCourse("");
  };

  const handleAddSubject = () => {
    if (!newSubj.trim()) return;
    addSubject(newSubjDept, newSubjCourse, newSubjSem, newSubj.trim());
    setNewSubj("");
  };

  // ✅ Fix 2 — mapDept bhi reset karo
  const handleAddDeptCourse = () => {
    if (!mapDept || !mapCourse) return;
    addDeptCourse(mapDept, mapCourse);
    setMapCourse("");
    setMapDept("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* ============ DEPARTMENTS ============ */}
      <div className="card">
        <h2 className="card-title">🏛️ Departments</h2>
        <div style={{ display: "flex", gap: "12px" }}>
          <input 
            className="form-input" 
            placeholder="e.g. Computer Science" 
            value={newDept} 
            onChange={e => setNewDept(e.target.value)} 
            onKeyDown={e => e.key === "Enter" && handleAddDept()} 
          />
          <button className="btn-navy" onClick={handleAddDept}>Add</button>
        </div>
        <div style={{ marginTop: "20px" }}>
          {departments.length === 0 && (
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", fontWeight: "300" }}>
              No departments yet
            </span>
          )}
          {departments.map(d => (
            <span key={d} className="tag">
              {d}
              <button onClick={() => removeDept(d)}>×</button>
            </span>
          ))}
        </div>
      </div>

      {/* ============ COURSES ============ */}
      <div className="card">
        <h2 className="card-title">🎓 Courses</h2>
        <div style={{ display: "flex", gap: "12px" }}>
          <input 
            className="form-input" 
            placeholder="e.g. B.Tech, MCA, M.Sc" 
            value={newCourse} 
            onChange={e => setNewCourse(e.target.value)} 
            onKeyDown={e => e.key === "Enter" && handleAddCourse()} 
          />
          <button className="btn-navy" onClick={handleAddCourse}>Add</button>
        </div>
        <div style={{ marginTop: "20px" }}>
          {courses.length === 0 && (
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", fontWeight: "300" }}>
              No courses yet
            </span>
          )}
          {courses.map(c => (
            <span key={c} className="tag">
              {c}
              <button onClick={() => removeCourse(c)}>×</button>
            </span>
          ))}
        </div>
      </div>

      {/* ============ DEPT-COURSE MAPPING ============ */}
      <div className="card">
        <h2 className="card-title" style={{ marginBottom: "8px" }}>
          🔗 Department → Course Mapping
        </h2>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: "0 0 24px", fontWeight: "300" }}>
          Har department ke saath linked courses dikhenge
        </p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <select 
            className="form-input" style={{ flex: 1 }} 
            value={mapDept} onChange={e => setMapDept(e.target.value)}
          >
            <option value="">Select Department</option>
            {departments.map(d => <option key={d}>{d}</option>)}
          </select>
          <select 
            className="form-input" style={{ flex: 1 }} 
            value={mapCourse} onChange={e => setMapCourse(e.target.value)}
            disabled={!mapDept}
          >
            <option value="">Select Course</option>
            {courses.map(c => <option key={c}>{c}</option>)}
          </select>
          <button className="btn-navy" onClick={handleAddDeptCourse}>Link</button>
        </div>
        <div style={{ marginTop: "24px" }}>
          {departments.map(d => (
            <div key={d} style={{ 
              marginBottom: "20px", background: "rgba(255,255,255,0.01)", 
              padding: "16px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.04)" 
            }}>
              <div style={{ 
                fontSize: "11px", fontWeight: "600", color: "rgba(255,255,255,0.6)", 
                textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" 
              }}>
                {d}
              </div>
              {(deptCourses[d] || []).length === 0 ? (
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", fontStyle: "italic" }}>
                  No courses linked
                </span>
              ) : (
                (deptCourses[d] || []).map(c => (
                  <span key={c} className="tag">
                    {c}
                    <button onClick={() => removeDeptCourse(d, c)}>×</button>
                  </span>
                ))
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ============ SUBJECTS ============ */}
      <div className="card">
        <h2 className="card-title" style={{ marginBottom: "8px" }}>📚 Subjects</h2>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: "0 0 24px", fontWeight: "300" }}>
          Department → Course → Semester ke hisaab se subjects add karo
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
          <select className="form-input" value={newSubjDept} 
            onChange={e => { setNewSubjDept(e.target.value); setNewSubjCourse(""); setNewSubjSem(""); }}>
            <option value="">Select Department</option>
            {departments.map(d => <option key={d}>{d}</option>)}
          </select>
          <select className="form-input" value={newSubjCourse} 
            onChange={e => { setNewSubjCourse(e.target.value); setNewSubjSem(""); }}
            disabled={!newSubjDept}>
            <option value="">{newSubjDept ? "Select Course" : "Select Dept first"}</option>
            {(deptCourses[newSubjDept] || []).map(c => <option key={c}>{c}</option>)}
          </select>
          <select className="form-input" value={newSubjSem} 
            onChange={e => setNewSubjSem(e.target.value)} 
            disabled={!newSubjCourse}>
            <option value="">{newSubjCourse ? "Select Semester" : "Select Course first"}</option>
            {SEMESTERS.map(s => <option key={s}>{s}</option>)}
          </select>
          <div style={{ display: "flex", gap: "12px" }}>
            <input 
              className="form-input" placeholder="Subject name" 
              value={newSubj} onChange={e => setNewSubj(e.target.value)} 
              onKeyDown={e => e.key === "Enter" && handleAddSubject()} 
              disabled={!newSubjSem} 
            />
            <button className="btn-navy" onClick={handleAddSubject}>Add</button>
          </div>
        </div>

        <div style={{ marginTop: "32px" }}>
          {departments.length === 0 && (
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", fontWeight: "300" }}>
              Add departments first
            </span>
          )}
          {departments.map(dept => (
            <div key={dept} style={{ marginBottom: "32px" }}>
              <div style={{ 
                fontSize: "16px", fontWeight: "500", color: "white", 
                marginBottom: "16px", paddingBottom: "8px", 
                borderBottom: "1px solid rgba(255,255,255,0.06)" 
              }}>
                🏛️ {dept}
              </div>
              {(deptCourses[dept] || []).length === 0 ? (
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", paddingLeft: "16px", fontStyle: "italic" }}>
                  No courses linked
                </span>
              ) : (
                (deptCourses[dept] || []).map(course => (
                  <div key={course} style={{ marginBottom: "20px", paddingLeft: "16px", borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize: "13px", fontWeight: "500", color: "#1D9E75", marginBottom: "12px", letterSpacing: "0.5px" }}>
                      🎓 {course}
                    </div>
                    {SEMESTERS.map(sem => {
                      const semSubjects = subjects[dept]?.[course]?.[sem] || [];
                      if (semSubjects.length === 0) return null;
                      return (
                        <div key={sem} style={{ marginBottom: "12px", paddingLeft: "16px" }}>
                          <div style={{ fontSize: "11px", fontWeight: "600", color: "rgba(255,255,255,0.5)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>
                            📅 {sem} Semester
                          </div>
                          <div>
                            {semSubjects.map(s => (
                              <span key={s} className="tag">
                                {s}
                                <button onClick={() => removeSubject(dept, course, sem, s)}>×</button>
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}