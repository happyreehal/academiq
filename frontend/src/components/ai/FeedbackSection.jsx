export default function FeedbackSection({ 
  feedback, 
  setFeedback, 
  comment, 
  setComment, 
  feedbackSent, 
  submitFeedback 
}) {
  return (
    <div className="feedback-section">
      <p className="feedback-label">Help us improve:</p>

      {/* Thumbs Up / Down Buttons */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button 
          type="button"
          onClick={() => setFeedback("up")} 
          className={`btn-feedback btn-feedback-up ${feedback === "up" ? "active" : ""}`}
        >
          👍 Good
        </button>
        <button 
          type="button"
          onClick={() => setFeedback("down")} 
          className={`btn-feedback btn-feedback-down ${feedback === "down" ? "active" : ""}`}
        >
          👎 Bad
        </button>
      </div>

      {/* Comment Textarea (show only after feedback selected) */}
      {feedback && !feedbackSent && (
        <div style={{ marginTop: "20px" }}>
          <textarea 
            value={comment} 
            onChange={(e) => setComment(e.target.value)} 
            placeholder="Feedback (optional)..."
            className="feedback-textarea"
            rows="4"
          />
          <button 
            type="button"
            onClick={submitFeedback}
            className="btn-submit-feedback"
          >
            Submit
          </button>
        </div>
      )}

      {/* Success Message */}
      {feedbackSent && (
        <p className="feedback-success">
          ✅ Thanks for the feedback!
        </p>
      )}
    </div>
  );
}