import { useState, useRef, useEffect } from "react";
import { API } from "../data/adminConstants";

export default function useAIGenerator() {

  const [syllabusPdf, setSyllabusPdf] = useState(null);
  const [pastPapersPdf, setPastPapersPdf] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [comment, setComment] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  const bufferRef = useRef("");
  const intervalRef = useRef(null);
  const drainRef = useRef(null);

  // ✅ Fix 2 — cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (drainRef.current) clearInterval(drainRef.current);
    };
  }, []);

  // ============ SMOOTH TYPING ============

  const startSmoothTyping = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (bufferRef.current.length > 0) {
        const charsToAdd = Math.min(
          Math.ceil(bufferRef.current.length / 20),
          3
        );
        const chunk = bufferRef.current.slice(0, charsToAdd);
        bufferRef.current = bufferRef.current.slice(charsToAdd);
        setResult(prev => prev + chunk);
      }
    }, 15);
  };

  const stopSmoothTyping = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (bufferRef.current.length > 0) {
      setResult(prev => prev + bufferRef.current);
      bufferRef.current = "";
    }
  };

  // ============ GENERATE PAPER ============

  const generatePaper = async () => {
    if (!syllabusPdf) {
      setError("Please upload syllabus PDF");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");
    setFeedback(null);
    setFeedbackSent(false);
    bufferRef.current = "";

    startSmoothTyping();

    try {
      const formData = new FormData();
      formData.append("syllabus_pdf", syllabusPdf);
      if (pastPapersPdf) formData.append("past_papers_pdf", pastPapersPdf);

      // ✅ Fix 1 — API constant use karo
      const res = await fetch(`${API}/ai/generate`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Generation failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        bufferRef.current += chunk;
      }

      // ✅ Fix 3 — drainRef se cleanup possible
      await new Promise(resolve => {
        drainRef.current = setInterval(() => {
          if (bufferRef.current.length === 0) {
            clearInterval(drainRef.current);
            drainRef.current = null;
            resolve();
          }
        }, 50);
      });

    } catch (err) {
      setError(err.message || "Generation failed. Please try again.");
    } finally {
      stopSmoothTyping();
      setLoading(false);
    }
  };

  // ============ FEEDBACK ============

  const submitFeedback = () => {
    setFeedbackSent(true);
  };

  const resetFeedback = () => {
    setFeedback(null);
    setComment("");
    setFeedbackSent(false);
  };

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