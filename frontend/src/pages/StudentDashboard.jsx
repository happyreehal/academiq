import { useEffect } from "react";
import useStudentData from "../hooks/useStudentData";
import "../styles/student.css";

import StudentNavbar from "../components/student/StudentNavbar";
import PaperFilters from "../components/student/PaperFilters";
import PaperResults from "../components/student/PaperResults";

export default function StudentDashboard() {
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

  // ✅ Page title
  useEffect(() => {
    document.title = "Student Dashboard | AcademiQ";
    return () => { document.title = "AcademiQ"; };
  }, []);

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#030810", 
      fontFamily: "'DM Sans', sans-serif" 
    }}>
      {/* Navbar */}
      <StudentNavbar />

      {/* Main Content */}
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "100px 20px 60px" }}>
        
        {/* Filter Card */}
        <PaperFilters 
          departments={departments}
          deptCourses={deptCourses}
          subjects={subjects}
          loading={loading}
          onSearch={searchPapers}
        />

        {/* ✅ Always render — searched prop se handle hoga */}
        <PaperResults 
          papers={papers}
          searched={searched}
          getViewUrl={getViewUrl}
          getDownloadUrl={getDownloadUrl}
        />
      </div>
    </div>
  );
}