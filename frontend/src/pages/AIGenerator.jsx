import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AIGenerator() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [syllabusPdf, setSyllabusPdf] = useState(null);
  const [pastPapersPdf, setPastPapersPdf] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [comment, setComment] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleGenerate = async () => {
    if (!syllabusPdf) {
      setError("Please upload syllabus PDF");
      return;
    }
    setLoading(true);
    setError("");
    setResult("");
    setFeedback(null);
    setFeedbackSent(false);

    try {
      const formData = new FormData();
      formData.append("syllabus_pdf", syllabusPdf);
      if (pastPapersPdf) {
        formData.append("past_papers_pdf", pastPapersPdf);
      }

      const res = await axios.post("https://academiq-jenb.onrender.com/ai/generate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data.questions);
    } catch (err) {
      setError(err.response?.data?.detail || "Generation failed");
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
        <h1 className="text-xl font-bold">AcademiQ — AI Question Generator</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/student")} className="text-sm underline">Back to Dashboard</button>
          <span className="text-sm">Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="bg-white text-sm px-4 py-1 rounded-lg font-medium" style={{color:"#1e3a5f"}}>Logout</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto mt-10 px-4 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-bold mb-1" style={{color:"#1e3a5f"}}>Step 1 — Upload Syllabus PDF</h2>
          <p className="text-sm text-slate-500 mb-3">Upload your latest course syllabus in PDF format</p>
          <input type="file" accept=".pdf" onChange={(e) => setSyllabusPdf(e.target.files[0])}
            className="w-full border border-slate-300 rounded-lg px-3 py-2" />
          {syllabusPdf && <p className="text-sm text-green-600 mt-1">✓ {syllabusPdf.name}</p>}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-bold mb-1" style={{color:"#1e3a5f"}}>Step 2 — Upload Past Year Papers PDF (Optional)</h2>
          <p className="text-sm text-slate-500 mb-3">Upload previous year question papers for better predictions</p>
          <input type="file" accept=".pdf" onChange={(e) => setPastPapersPdf(e.target.files[0])}
            className="w-full border border-slate-300 rounded-lg px-3 py-2" />
          {pastPapersPdf && <p className="text-sm text-green-600 mt-1">✓ {pastPapersPdf.name}</p>}
        </div>

        {error && <div className="bg-red-100 text-red-600 px-4 py-2 rounded">{error}</div>}

        <button onClick={handleGenerate} disabled={loading}
          className="w-full py-3 rounded-xl text-white font-semibold text-lg"
          style={{backgroundColor:"#1e3a5f"}}>
          {loading ? "Generating Practice Paper... Please wait..." : "Generate AI Practice Paper"}
        </button>

        {result && (
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold mb-4" style={{color:"#1e3a5f"}}>Generated Practice Paper</h2>
            <pre className="whitespace-pre-wrap text-slate-700 text-sm leading-relaxed">{result}</pre>

            <div className="mt-6 border-t pt-4">
              <p className="font-medium text-slate-700 mb-2">Rate this generated paper:</p>
              <div className="flex gap-4 mb-3">
                <button onClick={() => setFeedback("up")}
                  className={`px-4 py-2 rounded-lg border text-lg ${feedback === "up" ? "bg-green-100 border-green-500" : "border-slate-300"}`}>
                  👍 Helpful
                </button>
                <button onClick={() => setFeedback("down")}
                  className={`px-4 py-2 rounded-lg border text-lg ${feedback === "down" ? "bg-red-100 border-red-400" : "border-slate-300"}`}>
                  👎 Not Helpful
                </button>
              </div>

              {feedback && !feedbackSent && (
                <div className="space-y-2">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Any comments? (optional)"
                  />
                  <button onClick={() => setFeedbackSent(true)}
                    className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                    style={{backgroundColor:"#1e3a5f"}}>
                    Submit Feedback
                  </button>
                </div>
              )}

              {feedbackSent && (
                <p className="text-green-600 font-medium">Thank you for your feedback!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}