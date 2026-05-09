import { useState } from "react";
import FeedbackSection from "./FeedbackSection";

export default function ResultDisplay({ 
  result, loading,
  feedback, setFeedback,
  comment, setComment,
  feedbackSent, submitFeedback
}) {
  const [copied, setCopied] = useState(false);

  // ✅ Copy button
  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ai-card">
      
      {/* Title with Live Indicator + Copy Button */}
      <h2 className="ai-card-title" style={{ 
        marginBottom: "20px", display: "flex", 
        alignItems: "center", gap: "12px",
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          📝 Predicted Exam Paper
          {loading && (
            <span style={{ 
              fontSize: "12px", color: "#1D9E75", 
              background: "rgba(29,158,117,0.1)",
              padding: "4px 12px", borderRadius: "12px",
              border: "1px solid rgba(29,158,117,0.3)",
              animation: "livePulse 1.5s infinite"
            }}>
              ● LIVE
            </span>
          )}
        </div>

        {/* ✅ Copy Button */}
        {!loading && result && (
          <button
            onClick={handleCopy}
            style={{
              background: copied ? "rgba(29,158,117,0.15)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${copied ? "rgba(29,158,117,0.4)" : "rgba(255,255,255,0.1)"}`,
              color: copied ? "#1D9E75" : "rgba(255,255,255,0.5)",
              padding: "6px 14px", borderRadius: "6px",
              cursor: "pointer", fontSize: "12px",
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.3s", whiteSpace: "nowrap"
            }}
          >
            {copied ? "✅ Copied!" : "📋 Copy"}
          </button>
        )}
      </h2>

      {/* Result Text */}
      <pre className="ai-result-text">
        {result}
        {loading && <span className="typing-cursor">▋</span>}
      </pre>

      {/* Feedback */}
      {!loading && result && (
        <FeedbackSection 
          feedback={feedback}
          setFeedback={setFeedback}
          comment={comment}
          setComment={setComment}
          feedbackSent={feedbackSent}
          submitFeedback={submitFeedback}
        />
      )}

      <style>{`
        @keyframes typingBlink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .typing-cursor {
          display: inline-block;
          color: #1D9E75;
          animation: typingBlink 1s infinite;
          margin-left: 2px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}