import useStudentData from "../hooks/useStudentData";
import "../styles/student.css";

// Components
import StudentNavbar from "../components/student/StudentNavbar";
import PaperFilters from "../components/student/PaperFilters";
import PaperResults from "../components/student/PaperResults";

export default function StudentDashboard() {
  // All data and actions from custom hook
  const {
    departments,
    deptCourses,
    subjects,
    papers,
    loading,
    searched,
    searchPapers,
    getViewUrl,
    getDownloadUrl,
  } = useStudentData();

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#030810", 
      fontFamily: "'DM Sans', sans-serif" 
    }}>
      {/* Navbar */}
      <StudentNavbar />

      {/* Main Content */}
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "60px 20px" }}>
        
        {/* Filter Card */}
        <PaperFilters 
          departments={departments}
          deptCourses={deptCourses}
          subjects={subjects}
          loading={loading}
          onSearch={searchPapers}
        />

        {/* Results - only show after first search */}
        {searched && (
          <PaperResults 
            papers={papers}
            getViewUrl={getViewUrl}
            getDownloadUrl={getDownloadUrl}
          />
        )}
      </div>
    </div>
  );
}