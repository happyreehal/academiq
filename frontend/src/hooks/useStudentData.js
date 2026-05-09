import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../data/adminConstants";

export default function useStudentData() {
  // ============ STATES ============
  
  // Settings data
  const [departments, setDepartments] = useState([]);
  const [deptCourses, setDeptCourses] = useState({});
  const [subjects, setSubjects] = useState({});
  
  // Papers data
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // ============ FETCH SETTINGS ON MOUNT ============
  
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

  // ============ SEARCH PAPERS ============
  
  const searchPapers = async (filters) => {
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

  // ============ URL HELPERS ============
  
  const getViewUrl = (url) => {
    const cleanUrl = url
      .replace("/image/upload/fl_attachment/", "/raw/upload/")
      .replace("/image/upload/", "/raw/upload/");
    return `https://docs.google.com/viewer?url=${encodeURIComponent(cleanUrl)}`;
  };

  const getDownloadUrl = (url) => {
    return `${API}/papers/download?url=${encodeURIComponent(url)}`;
  };

  // ============ RETURN EVERYTHING ============
  
  return {
    departments,
    deptCourses,
    subjects,
    papers,
    loading,
    searched,
    searchPapers,
    getViewUrl,
    getDownloadUrl,
  };
}