import { useState } from "react";
import { SEMESTERS } from "../../data/adminConstants";

export default function PaperFilters({ departments, deptCourses, subjects, loading, onSearch }) {
  const [filters, setFilters] = useState({ 
    department: "", 
    course: "", 
    semester: "", 
    subject: "" 
  });

  // Get filtered options based on selections
  const filteredCourses = filters.department 
    ? (deptCourses[filters.department] || []) 
    : [];
    
  const filteredSubjects = (filters.department && filters.course && filters.semester)
    ? (subjects[filters.department]?.[filters.course]?.[filters.semester] || [])
    : [];

  const handleSearch = () => {
    onSearch(filters);
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
            disabled={!filters.department}
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
            disabled={!filters.course}
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
            disabled={!filters.semester}
          >
            <option value="">
              {filters.semester ? "All Subjects" : "Select Semester first"}
            </option>
            {filteredSubjects.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Search Button */}
      <button 
        onClick={handleSearch} 
        disabled={loading}
        className="btn-search"
      >
        {loading ? "⏳ Searching..." : "🔍 Search Papers"}
      </button>
    </div>
  );
}