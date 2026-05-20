import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import "../styles/landing.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import About from "../components/landing/About";
import HowItWorks from "../components/landing/HowItWorks";
import Developer from "../components/landing/Developer";
import CTA from "../components/landing/CTA";
import Marquee from "../components/landing/Marquee";

// ✅ Detect mobile ONCE at module level
const detectMobile = () => {
  if (typeof window === "undefined") return false;
  return window.innerWidth <= 768 ||
         'ontouchstart' in window ||
         navigator.maxTouchPoints > 0 ||
         /Mobi|Android/i.test(navigator.userAgent);
};

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cursorState, setCursorState] = useState({ hovering: false, label: "" });
  const [isMobile] = useState(detectMobile);

  const canvasRef = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const scrollRafRef = useRef(null);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const enableCanvas = !isMobile && !prefersReducedMotion;

  // Page title
  useEffect(() => {
    document.title = "AcademiQ | Smart Question Paper Portal";
    return () => { document.title = "AcademiQ"; };
  }, []);

  // ✅ Cursor — desktop only, single RAF
  useEffect(() => {
    if (isMobile) return;

    let dotX = 0, dotY = 0, ringX = 0, ringY = 0;
    let targetX = 0, targetY = 0;
    let rafId;
    let isActive = true;

    const animate = () => {
      if (!isActive) return;
      dotX += (targetX - dotX) * 0.25;
      dotY += (targetY - dotY) * 0.25;
      ringX += (targetX - ringX) * 0.1;
      ringY += (targetY - ringY) * 0.1;

      if (cursorDotRef.current)
        cursorDotRef.current.style.transform = `translate3d(${dotX}px,${dotY}px,0) translate(-50%,-50%)`;
      if (cursorRingRef.current)
        cursorRingRef.current.style.transform = `translate3d(${ringX}px,${ringY}px,0) translate(-50%,-50%)`;

      rafId = requestAnimationFrame(animate);
    };

    const handleMouse = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOver = (e) => {
      const t = e.target;
      if (t.closest("button")) setCursorState({ hovering: true, label: "Click" });
      else if (t.closest("a")) setCursorState({ hovering: true, label: "View" });
      else if (t.closest(".hover-target")) setCursorState({ hovering: true, label: "" });
      else setCursorState({ hovering: false, label: "" });
    };

    window.addEventListener("mousemove", handleMouse, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      isActive = false;
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(rafId);
    };
  }, [isMobile]);

  // ✅ Canvas particles — desktop only, throttled
  useEffect(() => {
    if (!enableCanvas) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const setSize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };
    setSize();

    const particles = Array.from({ length: 25 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.2 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.1,
    }));

    let animId;
    let isVisible = true;
    let frameCount = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;
      frameCount++;
      if (frameCount % 2 !== 0) return; // 30fps

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particles.forEach((p) => {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > window.innerWidth) p.dx *= -1;
        if (p.y < 0 || p.y > window.innerHeight) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(29,158,117,${p.opacity})`;
        ctx.fill();
      });
    };
    animate();

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0 });
    observer.observe(canvas);

    const resize = () => setSize();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [enableCanvas]);

  // Scroll throttled
  const handleScroll = useCallback(() => {
    if (scrollRafRef.current) return;
    scrollRafRef.current = requestAnimationFrame(() => {
      setScrollY(window.scrollY);
      scrollRafRef.current = null;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    const t = setTimeout(() => setIsLoaded(true), 100);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(t);
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
    };
  }, [handleScroll]);

  return (
    <div className="landing-page" style={{
      fontFamily: "'DM Sans', sans-serif",
      background: "#030810",
      minHeight: "100vh",
      position: "relative",
    }}>
      {!isMobile && createPortal(
        <>
          <div
            ref={cursorDotRef}
            className={`cursor-dot ${cursorState.hovering ? "cursor-dot--hover" : ""}`}
            style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 999999, willChange: "transform" }}
          />
          <div
            ref={cursorRingRef}
            className={`cursor-ring ${cursorState.hovering ? "cursor-ring--hover" : ""}`}
            style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 999998, willChange: "transform" }}
          >
            {cursorState.label && <span className="cursor-label">{cursorState.label}</span>}
          </div>
        </>,
        document.body
      )}

      {enableCanvas && (
        <canvas ref={canvasRef} style={{
          position: "fixed", top: 0, left: 0,
          zIndex: 0, pointerEvents: "none",
        }} />
      )}

      <Navbar scrollY={scrollY} />
      <Hero isLoaded={isLoaded} mousePosRef={mousePosRef} isMobile={isMobile} />
      <Marquee />
      <Features />
      <About />
      <HowItWorks />
      <Developer />
      <CTA />
      <Footer />
    </div>
  );
}