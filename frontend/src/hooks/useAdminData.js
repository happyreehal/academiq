import { useState, useEffect } from "react";
import axios from "axios";
import { API, authHeaders } from "../data/adminConstants";

export default function useAdminData(activeTab, isSuperAdmin) {
  // ============ STATES ============
  
  // Settings data
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState({});
  const [deptCourses, setDeptCourses] = useState({});
  
  // Students & Admins
  const [students, setStudents] = useState([]);
  const [admins, setAdmins] = useState([]);
  
  // Papers
  const [papers, setPapers] = useState([]);
  
  // Secret
  const [currentSecret, setCurrentSecret] = useState("");
  
  // Messages
  const [settingsMsg, setSettingsMsg] = useState("");
  const [papersMsg, setPapersMsg] = useState("");
  const [superMsg, setSuperMsg] = useState("");

  // ============ FLASH MESSAGES ============
  
  const flash = (msg) => { 
    setSettingsMsg(msg); 
    setTimeout(() => setSettingsMsg(""), 3000); 
  };
  
  const flashPapers = (msg) => { 
    setPapersMsg(msg); 
    setTimeout(() => setPapersMsg(""), 3000); 
  };
  
  const flashSuper = (msg) => { 
    setSuperMsg(msg); 
    setTimeout(() => setSuperMsg(""), 3000); 
  };

  // ============ FETCH FUNCTIONS ============
  
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
      const res = await axios.get(`${API}/settings/students`, { headers: authHeaders() });
      setStudents(res.data.students);
    } catch (_) {}
  }

  async function fetchPapers() {
    try {
      const res = await axios.get(`${API}/papers/all`, { headers: authHeaders() });
      setPapers(res.data.papers);
    } catch (_) {}
  }

  async function fetchAdmins() {
    try {
      const res = await axios.get(`${API}/settings/admins`, { headers: authHeaders() });
      setAdmins(res.data.admins);
    } catch (_) {}
  }

  async function fetchSecret() {
    try {
      const res = await axios.get(`${API}/settings/admin-secret`, { headers: authHeaders() });
      setCurrentSecret(res.data.secret);
    } catch (_) {}
  }

  // ============ EFFECTS ============
  
  useEffect(() => { fetchSettings(); }, []);
  useEffect(() => { if (activeTab === "students") fetchStudents(); }, [activeTab]);
  useEffect(() => { if (activeTab === "papers") fetchPapers(); }, [activeTab]);
  useEffect(() => { if (activeTab === "admins" && isSuperAdmin) fetchAdmins(); }, [activeTab, isSuperAdmin]);
  useEffect(() => { if (activeTab === "superadmin" && isSuperAdmin) fetchSecret(); }, [activeTab, isSuperAdmin]);

  // ============ STUDENT ACTIONS ============
  
  async function approveStudent(email) {
    try {
      await axios.post(`${API}/settings/students/${encodeURIComponent(email)}/approve`, {}, { headers: authHeaders() });
      setStudents(prev => prev.map(s => s.email === email ? { ...s, status: "active" } : s));
      flash("✅ Student approved");
    } catch (err) { flash("⚠️ Error"); }
  }

  async function rejectStudent(email) {
    try {
      await axios.post(`${API}/settings/students/${encodeURIComponent(email)}/reject`, {}, { headers: authHeaders() });
      setStudents(prev => prev.map(s => s.email === email ? { ...s, status: "rejected" } : s));
      flash("❌ Student rejected");
    } catch (err) { flash("⚠️ Error"); }
  }

  async function removeStudent(email) {
    if (!window.confirm(`Remove "${email}"?`)) return;
    try {
      await axios.delete(`${API}/settings/students/${encodeURIComponent(email)}`, { headers: authHeaders() });
      setStudents(prev => prev.filter(s => s.email !== email));
      flash("🗑️ Removed");
    } catch (err) { flash("⚠️ Error"); }
  }

  // ============ ADMIN ACTIONS ============
  
  async function approveAdmin(email) {
    try {
      await axios.post(`${API}/settings/admins/${encodeURIComponent(email)}/approve`, {}, { headers: authHeaders() });
      setAdmins(prev => prev.map(a => a.email === email ? { ...a, status: "active" } : a));
      flashSuper("✅ Admin approved");
    } catch (err) { flashSuper("⚠️ Error"); }
  }

  async function rejectAdmin(email) {
    try {
      await axios.post(`${API}/settings/admins/${encodeURIComponent(email)}/reject`, {}, { headers: authHeaders() });
      setAdmins(prev => prev.map(a => a.email === email ? { ...a, status: "rejected" } : a));
      flashSuper("❌ Admin rejected");
    } catch (err) { flashSuper("⚠️ Error"); }
  }

  async function removeAdmin(email) {
    if (!window.confirm(`Remove "${email}"?`)) return;
    try {
      await axios.delete(`${API}/settings/admins/${encodeURIComponent(email)}`, { headers: authHeaders() });
      setAdmins(prev => prev.filter(a => a.email !== email));
      flashSuper("🗑️ Removed");
    } catch (err) { flashSuper("⚠️ Error"); }
  }

  async function updateSecret(newSecret) {
    if (newSecret.length < 8) { 
      flashSuper("⚠️ Min 8 characters"); 
      return false;
    }
    try {
      await axios.post(`${API}/settings/admin-secret`, { new_secret: newSecret }, { headers: authHeaders() });
      setCurrentSecret(newSecret);
      flashSuper("✅ Secret updated");
      return true;
    } catch (err) { 
      flashSuper("⚠️ Error"); 
      return false;
    }
  }

  // ============ DEPARTMENT ACTIONS ============
  
  async function addDept(newDept) {
    if (!newDept.trim()) return;
    try {
      const res = await axios.post(`${API}/settings/departments`, { value: newDept }, { headers: authHeaders() });
      setDepartments(res.data.departments);
      flash("✅ Department added");
    } catch (err) { flash("⚠️ " + (err.response?.data?.detail || "Error")); }
  }

  async function removeDept(name) {
    if (!window.confirm(`Remove "${name}"?`)) return;
    try {
      const res = await axios.delete(`${API}/settings/departments/${encodeURIComponent(name)}`, { headers: authHeaders() });
      setDepartments(res.data.departments);
      fetchSettings();
      flash("🗑️ Removed");
    } catch (err) { flash("⚠️ Error"); }
  }

  // ============ COURSE ACTIONS ============
  
  async function addCourse(newCourse) {
    if (!newCourse.trim()) return;
    try {
      const res = await axios.post(`${API}/settings/courses`, { value: newCourse }, { headers: authHeaders() });
      setCourses(res.data.courses);
      flash("✅ Course added");
    } catch (err) { flash("⚠️ " + (err.response?.data?.detail || "Error")); }
  }

  async function removeCourse(name) {
    if (!window.confirm(`Remove "${name}"?`)) return;
    try {
      const res = await axios.delete(`${API}/settings/courses/${encodeURIComponent(name)}`, { headers: authHeaders() });
      setCourses(res.data.courses);
      flash("🗑️ Removed");
    } catch (err) { flash("⚠️ Error"); }
  }

  // ============ SUBJECT ACTIONS ============
  
  async function addSubject(dept, course, sem, subj) {
    if (!dept || !course || !sem || !subj.trim()) {
      flash("⚠️ All fields required for subject");
      return;
    }
    try {
      const res = await axios.post(`${API}/settings/subjects`, {
        department: dept, course, semester: sem, subject: subj
      }, { headers: authHeaders() });
      setSubjects(res.data.subjects);
      flash("✅ Subject added");
    } catch (err) { flash("⚠️ " + (err.response?.data?.detail || "Error")); }
  }

  async function removeSubject(dept, course, sem, subj) {
    try {
      const res = await axios.delete(
        `${API}/settings/subjects/${encodeURIComponent(dept)}/${encodeURIComponent(course)}/${encodeURIComponent(sem)}/${encodeURIComponent(subj)}`,
        { headers: authHeaders() }
      );
      setSubjects(res.data.subjects);
      flash("🗑️ Removed");
    } catch (err) { flash("⚠️ Error"); }
  }

  // ============ DEPT-COURSE MAPPING ============
  
  async function addDeptCourse(dept, course) {
    if (!dept || !course) return;
    try {
      const res = await axios.post(`${API}/settings/dept-courses`, { department: dept, course }, { headers: authHeaders() });
      setDeptCourses(res.data.dept_courses);
      flash("✅ Course linked");
    } catch (err) { flash("⚠️ " + (err.response?.data?.detail || "Error")); }
  }

  async function removeDeptCourse(dept, course) {
    try {
      const res = await axios.delete(`${API}/settings/dept-courses/${encodeURIComponent(dept)}/${encodeURIComponent(course)}`, { headers: authHeaders() });
      setDeptCourses(res.data.dept_courses);
      flash("🗑️ Removed");
    } catch (err) { flash("⚠️ Error"); }
  }

  // ============ PAPER ACTIONS ============
  
  async function deletePaper(public_id) {
    if (!window.confirm("Delete this paper permanently?")) return;
    try {
      await axios.delete(`${API}/papers/delete/${encodeURIComponent(public_id)}`, { headers: authHeaders() });
      setPapers(prev => prev.filter(p => p.public_id !== public_id));
      flashPapers("🗑️ Paper deleted");
    } catch (err) { flashPapers("⚠️ " + (err.response?.data?.detail || "Error")); }
  }

  async function uploadPaper(formData) {
    try {
      await axios.post(`${API}/papers/upload`, formData, {
        headers: { ...authHeaders(), "Content-Type": "multipart/form-data" },
      });
      return { success: true, message: "Paper uploaded successfully!" };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.detail || "Upload failed" 
      };
    }
  }

  // ============ RETURN EVERYTHING ============
  
  return {
    // Data
    departments, courses, subjects, deptCourses,
    students, admins, papers, currentSecret,
    
    // Messages
    settingsMsg, papersMsg, superMsg,
    
    // Actions
    approveStudent, rejectStudent, removeStudent,
    approveAdmin, rejectAdmin, removeAdmin,
    updateSecret,
    addDept, removeDept,
    addCourse, removeCourse,
    addSubject, removeSubject,
    addDeptCourse, removeDeptCourse,
    deletePaper, uploadPaper,
  };
}