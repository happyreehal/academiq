import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import useAdminData from "../hooks/useAdminData";
import "../styles/admin.css";

import AdminNavbar from "../components/admin/AdminNavbar";
import AdminTabs from "../components/admin/AdminTabs";
import UploadTab from "../components/admin/UploadTab";
import PapersTab from "../components/admin/PapersTab";
import StudentsTab from "../components/admin/StudentsTab";
import SettingsTab from "../components/admin/SettingsTab";
import AdminsTab from "../components/admin/AdminsTab";
import SuperAdminTab from "../components/admin/SuperAdminTab";

export default function AdminDashboard() {
  const { user } = useAuth();
  const isSuperAdmin = user?.is_super;
  const [activeTab, setActiveTab] = useState("upload");

  const {
    departments, courses, subjects, deptCourses,
    students, admins, papers, currentSecret,
    settingsMsg, papersMsg, superMsg,
    approveStudent, rejectStudent, removeStudent,
    approveAdmin, rejectAdmin, removeAdmin,
    updateSecret,
    addDept, removeDept,
    addCourse, removeCourse,
    addSubject, removeSubject,
    addDeptCourse, removeDeptCourse,
    deletePaper, uploadPaper,
  } = useAdminData(activeTab, isSuperAdmin);

  const pendingStudentsCount = students.filter(s => s.status === "pending").length;
  const pendingAdminsCount = admins.filter(a => a.status === "pending").length;

  // ✅ Page title
  useEffect(() => {
    document.title = "Admin Dashboard | AcademiQ";
    return () => { document.title = "AcademiQ"; };
  }, []);

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#030810", 
      fontFamily: "'DM Sans', sans-serif" 
    }}>
      {/* Navbar */}
      <AdminNavbar />

      {/* ✅ Fix: padding-top 100px so content not hidden behind navbar */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "100px 20px 40px" }}>
        
        {/* Tabs Navigation */}
        <AdminTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isSuperAdmin={isSuperAdmin}
          pendingStudents={pendingStudentsCount}
          pendingAdmins={pendingAdminsCount}
        />

        {/* Flash Messages */}
        {settingsMsg && <div className="alert alert-success">{settingsMsg}</div>}
        {papersMsg && <div className="alert alert-success">{papersMsg}</div>}
        {superMsg && <div className="alert alert-purple">{superMsg}</div>}

        {/* Tab Content */}
        {activeTab === "upload" && (
          <UploadTab 
            departments={departments}
            deptCourses={deptCourses}
            subjects={subjects}
            uploadPaper={uploadPaper}
          />
        )}

        {activeTab === "papers" && (
          <PapersTab 
            papers={papers}
            departments={departments}
            deletePaper={deletePaper}
          />
        )}

        {activeTab === "students" && (
          <StudentsTab 
            students={students}
            approveStudent={approveStudent}
            rejectStudent={rejectStudent}
            removeStudent={removeStudent}
          />
        )}

        {activeTab === "settings" && (
          <SettingsTab 
            departments={departments}
            courses={courses}
            subjects={subjects}
            deptCourses={deptCourses}
            addDept={addDept}
            removeDept={removeDept}
            addCourse={addCourse}
            removeCourse={removeCourse}
            addSubject={addSubject}
            removeSubject={removeSubject}
            addDeptCourse={addDeptCourse}
            removeDeptCourse={removeDeptCourse}
          />
        )}

        {activeTab === "admins" && isSuperAdmin && (
          <AdminsTab 
            admins={admins}
            approveAdmin={approveAdmin}
            rejectAdmin={rejectAdmin}
            removeAdmin={removeAdmin}
          />
        )}

        {activeTab === "superadmin" && isSuperAdmin && (
          <SuperAdminTab 
            currentSecret={currentSecret}
            updateSecret={updateSecret}
          />
        )}
      </div>
    </div>
  );
}