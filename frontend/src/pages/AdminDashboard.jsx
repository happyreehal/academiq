import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const DEPARTMENTS = ["CSE", "ECE", "ME", "CE", "EE", "MCA", "MBA"];
const CLASSES = ["B.Tech", "MCA", "MBA", "M.Tech"];
const SEMESTERS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    department: "", class_name: "", semester: "",
    subject: "", academic_year: "", file: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setForm({ ...form, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const token = localStorage.getItem("academiq_token");
    const data = new FormData();
    data.append("department", form.department);
    data.append("class_name", form.class_name);
    data.append("semester", form.semester);
    data.append("subject", form.subject);
    data.append("academic_year", form.academic_year);
    data.append("file", form.file);

    try {
      await axios.post("http://127.0.0.1:8000/papers/upload", data, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Paper uploaded successfully!");
      setForm({ department: "", class_name: "", semester: "", subject: "", academic_year: "", file: null });
    } catch (err) {
      setError(err.response?.data?.detail || "Upload failed");
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
        <h1 className="text-xl font-bold">AcademiQ — Admin Panel</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="bg-white text-sm px-4 py-1 rounded-lg font-medium" style={{color:"#1e3a5f"}}>Logout</button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-6" style={{color:"#1e3a5f"}}>Upload Question Paper</h2>

        {message && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">{message}</div>}
        {error && <div className="bg-red-100 text-red-600 px-4 py-2 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
            <select name="department" value={form.department} onChange={handleChange} required
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select Department</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Class</label>
            <select name="class_name" value={form.class_name} onChange={handleChange} required
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select Class</option>
              {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Semester</label>
            <select name="semester" value={form.semester} onChange={handleChange} required
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select Semester</option>
              {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Subject Name</label>
            <input type="text" name="subject" value={form.subject} onChange={handleChange} required
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Data Structures" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Academic Year</label>
            <input type="number" name="academic_year" value={form.academic_year} onChange={handleChange} required
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 2024" min="2000" max="2030" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Upload PDF</label>
            <input type="file" accept=".pdf" onChange={handleFile} required
              className="w-full border border-slate-300 rounded-lg px-3 py-2" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-2 rounded-lg text-white font-semibold"
            style={{backgroundColor:"#1e3a5f"}}>
            {loading ? "Uploading..." : "Upload Paper"}
          </button>
        </form>
      </div>
    </div>
  );
}