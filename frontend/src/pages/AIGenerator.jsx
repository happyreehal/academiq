import { useEffect } from "react";
import useAIGenerator from "../hooks/useAIGenerator";
import "../styles/ai.css";

// Components
import AINavbar from "../components/ai/AINavbar";
import PdfUploadCard from "../components/ai/PdfUploadCard";
import ResultDisplay from "../components/ai/ResultDisplay";

export default function AIGenerator() {
  // All AI logic from custom hook
  const {
    syllabusPdf, setSyllabusPdf,
    pastPapersPdf, setPastPapersPdf,
    result, loading, error,
    feedback, setFeedback,
    comment, setComment,
    feedbackSent,
    generatePaper, submitFeedback,
  } = useAIGenerator();

  // Set body background
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.backgroundColor = "#030810";
    document.body.style.overflowX = "hidden";
    return () => { document.body.style.margin = ""; };
  }, []);

  return (
    <div style={{
      minHeight: "100vh", 
      width: "100%", 
      background: "#030810",
      fontFamily: "'DM Sans', sans-serif", 
      color: "white",
      display: "flex", 
      flexDirection: "column", 
      position: "relative"
    }}>
      
      {/* Floating Particles - Background */}
      <div className="ai-particle" style={{ width: '40px', height: '40px', left: '10%', animationDelay: '0s' }} />
      <div className="ai-particle" style={{ width: '20px', height: '20px', left: '30%', animationDelay: '5s' }} />
      <div className="ai-particle" style={{ width: '60px', height: '60px', left: '70%', animationDelay: '2s' }} />
      <div className="ai-particle" style={{ width: '30px', height: '30px', left: '85%', animationDelay: '8s' }} />
      <div className="ai-particle" style={{ width: '15px', height: '15px', left: '50%', animationDelay: '4s' }} />

      {/* Gradient Orbs */}
      <div className="ai-orb ai-orb-1" />
      <div className="ai-orb ai-orb-2" />

      {/* Navbar */}
      <AINavbar />

      {/* Main Content */}
      <div style={{ 
        maxWidth: "800px", 
        width: "100%", 
        margin: "60px auto", 
        padding: "0 20px", 
        flex: 1, 
        position: "relative", 
        zIndex: 1 
      }}>
        
        {/* Syllabus Upload */}
        <PdfUploadCard 
          icon="📄"
          title="Syllabus PDF"
          subtitle="Upload the PDF to define the AI's knowledge scope."
          file={syllabusPdf}
          onFileChange={setSyllabusPdf}
        />

        {/* Past Papers Upload */}
        <PdfUploadCard 
          icon="📚"
          title="Past Papers"
          subtitle="Upload old papers for pattern matching."
          optional={true}
          file={pastPapersPdf}
          onFileChange={setPastPapersPdf}
        />

        {/* Error Message */}
        {error && (
          <div className="ai-error">{error}</div>
        )}

        {/* Generate Button */}
        <button 
          onClick={generatePaper} 
          disabled={loading} 
          className="btn-generate"
        >
          {loading ? "⚡ Processing Data..." : "🤖 Generate Practice Paper"}
        </button>

        {/* Result Display */}
        {(result || loading) && (
          <ResultDisplay 
            result={result}
            loading={loading}
            feedback={feedback}
            setFeedback={setFeedback}
            comment={comment}
            setComment={setComment}
            feedbackSent={feedbackSent}
            submitFeedback={submitFeedback}
          />
        )}
      </div>
    </div>
  );
}