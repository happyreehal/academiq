import FeedbackSection from "./FeedbackSection";

export default function ResultDisplay({ 
  result, 
  loading,
  feedback,
  setFeedback,
  comment,
  setComment,
  feedbackSent,
  submitFeedback
}) {
  return (
    <div className="ai-card">
      
      {/* Title with Live Indicator */}
      <h2 
        className="ai-card-title" 
        style={{ 
          marginBottom: "20px", 
          display: "flex", 
          alignItems: "center", 
          gap: "12px" 
        }}
      >
        📝 Predicted Exam Paper
        {loading && (
          <span style={{ 
            fontSize: "12px", 
            color: "#1D9E75", 
            background: "rgba(29,158,117,0.1)",
            padding: "4px 12px",
            borderRadius: "12px",
            border: "1px solid rgba(29,158,117,0.3)",
            animation: "livePulse 1.5s infinite"
          }}>
            ● LIVE
          </span>
        )}
      </h2>

      {/* Result Text with Typing Cursor */}
      <pre className="ai-result-text">
        {result}
        {loading && <span className="typing-cursor">▋</span>}
      </pre>

      {/* Feedback Section - show only when result is complete */}
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

      {/* Inline styles for cursor animation */}
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