import { useState, useRef } from "react";
import { API } from "../data/adminConstants";

export default function useAIGenerator() {
  // ============ STATES ============
  
  const [syllabusPdf, setSyllabusPdf] = useState(null);
  const [pastPapersPdf, setPastPapersPdf] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Feedback states
  const [feedback, setFeedback] = useState(null);
  const [comment, setComment] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Buffer ref for smooth streaming
  const bufferRef = useRef("");
  const intervalRef = useRef(null);

  // ============ SMOOTH TYPING EFFECT ============
  
  const startSmoothTyping = () => {
    // Clear any existing interval
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      if (bufferRef.current.length > 0) {
        // Take 1-3 characters at a time for smooth effect
        const charsToAdd = Math.min(
          Math.ceil(bufferRef.current.length / 20), // Faster if more buffered
          3
        );
        const chunk = bufferRef.current.slice(0, charsToAdd);
        bufferRef.current = bufferRef.current.slice(charsToAdd);
        setResult(prev => prev + chunk);
      }
    }, 15); // Update every 15ms for smooth typing
  };

  const stopSmoothTyping = () => {
    // Flush remaining buffer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (bufferRef.current.length > 0) {
      setResult(prev => prev + bufferRef.current);
      bufferRef.current = "";
    }
  };

  // ============ GENERATE PAPER (with smooth streaming) ============
  
  const generatePaper = async () => {
    if (!syllabusPdf) { 
      setError("Please upload syllabus PDF"); 
      return; 
    }
    
    // Reset states
    setLoading(true);
    setError("");
    setResult("");
    setFeedback(null);
    setFeedbackSent(false);
    bufferRef.current = "";

    // Start smooth typing animation
    startSmoothTyping();

    try {
      const formData = new FormData();
      formData.append("syllabus_pdf", syllabusPdf);
      if (pastPapersPdf) formData.append("past_papers_pdf", pastPapersPdf);

      const res = await fetch(`/api/ai/generate`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Generation failed");
      }

      // Read stream and add to buffer
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        // Add to buffer (smooth typing will pick it up)
        bufferRef.current += chunk;
      }

      // Wait for buffer to drain
      await new Promise(resolve => {
        const checkDrain = setInterval(() => {
          if (bufferRef.current.length === 0) {
            clearInterval(checkDrain);
            resolve();
          }
        }, 50);
      });

    } catch (err) {
      setError(err.message || "Generation failed");
    } finally {
      stopSmoothTyping();
      setLoading(false);
    }
  };

  // ============ FEEDBACK ACTIONS ============
  
  const submitFeedback = () => {
    setFeedbackSent(true);
  };

  const resetFeedback = () => {
    setFeedback(null);
    setComment("");
    setFeedbackSent(false);
  };

  // ============ RETURN EVERYTHING ============
  
  return {
    syllabusPdf,
    setSyllabusPdf,
    pastPapersPdf,
    setPastPapersPdf,
    result,
    loading,
    error,
    feedback,
    setFeedback,
    comment,
    setComment,
    feedbackSent,
    generatePaper,
    submitFeedback,
    resetFeedback,
  };
}