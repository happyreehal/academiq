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

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cursorState, setCursorState] = useState({ hovering: false, label: "" });
  const canvasRef = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const scrollRafRef = useRef(null);
  const cursorRafRef = useRef(null);

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;
  
  // ✅ Canvas sirf desktop pe
  const enableCanvas = !isMobile && !prefersReducedMotion;

  // Page title
  useEffect(() => {
    document.title = "AcademiQ | Smart Question Paper Portal";
    return () => {
      document.title = "AcademiQ";
    };
  }, []);

  // Custom cursor — desktop only
  useEffect(() => {
    if (isMobile) return;

    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;
    let targetX = 0, targetY = 0;
    let isActive = true;

    const animate = () => {
      if (!isActive) return;

      dotX += (targetX - dotX) * 0.2;
      dotY += (targetY - dotY) * 0.2;
      ringX += (targetX - ringX) * 0.08;
      ringY += (targetY - ringY) * 0.08;

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      }
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }

      cursorRafRef.current = requestAnimationFrame(animate);
    };

    const handleMouse = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const isLink = target.closest("a");
      const isButton = target.closest("button");
      const isHoverTarget = target.closest(".hover-target");

      if (isButton) {
        setCursorState({ hovering: true, label: "Click" });
      } else if (isLink) {
        setCursorState({ hovering: true, label: "View" });
      } else if (isHoverTarget) {
        setCursorState({ hovering: true, label: "" });
      } else {
        setCursorState({ hovering: false, label: "" });
      }
    };

    window.addEventListener("mousemove", handleMouse, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    cursorRafRef.current = requestAnimationFrame(animate);

    return () => {
      isActive = false;
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("mouseover", handleMouseOver);
      if (cursorRafRef.current) cancelAnimationFrame(cursorRafRef.current);
    };
  }, [isMobile]);

  // Particle Canvas — desktop only, with touch-action fix
  useEffect(() => {
    if (!enableCanvas) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // ✅ CRITICAL: Allow scroll through canvas
    canvas.style.touchAction = "pan-y";
    
    const ctx = canvas.getContext("2d", { alpha: true });
    const dpr = Math.min(window.devicePixelRatio, 1.5);
    
    const setSize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };
    setSize();

    const particles = Array.from({ length: 30 }, () => ({
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
      if (frameCount % 2 !== 0) return;

      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      
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

  // Throttled scroll
  const handleScroll = useCallback(() => {
    if (scrollRafRef.current) return;
    scrollRafRef.current = requestAnimationFrame(() => {
      setScrollY(window.scrollY);
      scrollRafRef.current = null;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    setTimeout(() => setIsLoaded(true), 100);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
    };
  }, [handleScroll]);

  return (
    <div
      className="landing-page"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: "#030810",
        overflowX: "hidden",
        // ✅ CRITICAL: Allow vertical scroll
        overflowY: "auto",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {!isMobile &&
        createPortal(
          <>
            <div
              ref={cursorDotRef}
              className={`cursor-dot ${cursorState.hovering ? "cursor-dot--hover" : ""}`}
              style={{ 
                zIndex: 2147483647,
                position: "fixed",
                top: 0,
                left: 0,
                pointerEvents: "none",
                willChange: "transform",
              }}
            />
            <div
              ref={cursorRingRef}
              className={`cursor-ring ${cursorState.hovering ? "cursor-ring--hover" : ""}`}
              style={{ 
                zIndex: 2147483646,
                position: "fixed",
                top: 0,
                left: 0,
                pointerEvents: "none",
                willChange: "transform",
              }}
            >
              {cursorState.label && (
                <span className="cursor-label">{cursorState.label}</span>
              )}
            </div>
          </>,
          document.body
        )}

      {/* ✅ Canvas with touch-action fix */}
      {enableCanvas && (
        <canvas
          ref={canvasRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 0,
            pointerEvents: "none", // Let clicks pass through
            touchAction: "pan-y", // Allow vertical scroll
          }}
        />
      )}

      <Navbar scrollY={scrollY} />
      <Hero isLoaded={isLoaded} mousePosRef={mousePosRef} />
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