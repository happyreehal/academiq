import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const DEPARTMENTS = ["CSE", "ECE", "ME", "CE", "EE", "MCA", "MBA"];
const CLASSES = ["B.Tech", "MCA", "MBA", "M.Tech"];
const SEMESTERS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    department: "", class_name: "", semester: "", subject: "",
  });
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const params = {};
      if (filters.department) params.department = filters.department;
      if (filters.class_name) params.class_name = filters.class_name;
      if (filters.semester) params.semester = filters.semester;
      if (filters.subject) params.subject = filters.subject;

      const res = await axios.get("http://127.0.0.1:8000/papers/list", { params });
      setPapers(res.data.papers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="text-white px-8 py-4 flex justify-between items-center" style={{backgroundColor:"#1e3a5f"}}>
        <h1 className="text-xl font-bold">AcademiQ — Student Portal</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/ai-generator")}
            className="bg-yellow-400 text-sm px-4 py-1 rounded-lg font-medium text-gray-900">
            AI Question Generator
          </button>
          <span className="text-sm">Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="bg-white text-sm px-4 py-1 rounded-lg font-medium" style={{color:"#1e3a5f"}}>Logout</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto mt-10 px-4">
        <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4" style={{color:"#1e3a5f"}}>Filter Question Papers</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <select name="department" value={filters.department} onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All Departments</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Class</label>
              <select name="class_name" value={filters.class_name} onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All Classes</option>
                {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Semester</label>
              <select name="semester" value={filters.semester} onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All Semesters</option>
                {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
              <input type="text" name="subject" value={filters.subject} onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Data Structures" />
            </div>
          </div>

          <button onClick={handleSearch}
            className="mt-4 px-6 py-2 rounded-lg text-white font-semibold"
            style={{backgroundColor:"#1e3a5f"}}>
            {loading ? "Searching..." : "Search Papers"}
          </button>
        </div>

        {searched && (
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold mb-4" style={{color:"#1e3a5f"}}>
              Results ({papers.length} papers found)
            </h2>

            {papers.length === 0 ? (
              <p className="text-slate-500">No papers found for selected filters.</p>
            ) : (
              <div className="space-y-3">
                {papers.map((paper, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-800">{paper.subject} — {paper.academic_year}</p>
                      <p className="text-sm text-slate-500">{paper.department} | {paper.class_name} | {paper.semester} Semester</p>
                    </div>
                    <div className="flex gap-2">
                      <a href={paper.file_url} target="_blank" rel="noreferrer"
                        className="px-4 py-1 rounded-lg text-white text-sm font-medium"
                        style={{backgroundColor:"#1e3a5f"}}>
                        View
                      </a>
                      <a href={paper.file_url} download
                        className="px-4 py-1 rounded-lg text-sm font-medium border"
                        style={{color:"#1e3a5f", borderColor:"#1e3a5f"}}>
                        Download
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