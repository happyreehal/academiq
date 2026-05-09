import { useState } from "react";
import { SEMESTERS } from "../../data/adminConstants";

export default function PaperFilters({ departments, deptCourses, subjects, loading, onSearch }) {
  const [filters, setFilters] = useState({ 
    department: "", 
    course: "", 
    semester: "", 
    subject: "" 
  });

  const filteredCourses = filters.department 
    ? (deptCourses[filters.department] || []) 
    : [];
    
  const filteredSubjects = (filters.department && filters.course && filters.semester)
    ? (subjects[filters.department]?.[filters.course]?.[filters.semester] || [])
    : [];

  const handleSearch = () => onSearch(filters);

  // ✅ Fix 3 — Reset handler
  const handleReset = () => {
    setFilters({ department: "", course: "", semester: "", subject: "" });
    onSearch({ department: "", course: "", semester: "", subject: "" });
  };

  return (
    <div className="filter-card">
      <h2 className="filter-title">🔍 Filter Question Papers</h2>
      
      <div className="filter-grid">
        
        {/* Department */}
        <div>
          <label className="student-label">Department</label>
          <select 
            className="student-form-input" 
            value={filters.department}
            disabled={loading}
            onChange={e => setFilters({ 
              ...filters, 
              department: e.target.value, 
              course: "", 
              semester: "", 
              subject: "" 
            })}
          >
            <option value="">All Departments</option>
            {departments.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>

        {/* Course */}
        <div>
          <label className="student-label">Course</label>
          <select 
            className="student-form-input" 
            value={filters.course}
            onChange={e => setFilters({ 
              ...filters, 
              course: e.target.value, 
              semester: "", 
              subject: "" 
            })}
            disabled={!filters.department || loading}
          >
            <option value="">
              {filters.department ? "All Courses" : "Select Department first"}
            </option>
            {filteredCourses.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Semester */}
        <div>
          <label className="student-label">Semester</label>
          <select 
            className="student-form-input" 
            value={filters.semester}
            onChange={e => setFilters({ 
              ...filters, 
              semester: e.target.value, 
              subject: "" 
            })}
            disabled={!filters.course || loading}
          >
            <option value="">
              {filters.course ? "All Semesters" : "Select Course first"}
            </option>
            {SEMESTERS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Subject */}
        <div>
          <label className="student-label">Subject</label>
          <select 
            className="student-form-input" 
            value={filters.subject}
            onChange={e => setFilters({ ...filters, subject: e.target.value })}
            disabled={!filters.semester || loading}
          >
            <option value="">
              {filters.semester ? "All Subjects" : "Select Semester first"}
            </option>
            {filteredSubjects.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {/* ✅ Fix 1 — department required */}
        <button 
          onClick={handleSearch} 
          disabled={loading || !filters.department}
          className="btn-search"
          style={{ flex: 1 }}
        >
          {loading ? "⏳ Searching..." : "🔍 Search Papers"}
        </button>

        {/* ✅ Fix 3 — Reset button */}
        {(filters.department || filters.course || filters.semester || filters.subject) && (
          <button
            onClick={handleReset}
            disabled={loading}
            className="btn-reset"
          >
            ✕ Reset
          </button>
        )}
      </div>
    </div>
  );
}