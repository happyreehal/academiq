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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [cursorState, setCursorState] = useState({ hovering: false, label: "" });
  const canvasRef = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const enableCanvas = !isMobile && !prefersReducedMotion;

  // Page title
  useEffect(() => {
    document.title = "AcademiQ | Smart Question Paper Portal";
    return () => { document.title = "AcademiQ"; };
  }, []);

  // ✅ Smooth cursor with lag (using requestAnimationFrame)
  useEffect(() => {
    if (isMobile) return;

    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;
    let mouseX = 0, mouseY = 0;
    let rafId;

    const animate = () => {
      dotX += (mouseX - dotX) * 0.9;
      dotY += (mouseY - dotY) * 0.9;
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
      }
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    const handleMouse = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setMousePos({ x: e.clientX, y: e.clientY });
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

    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("mouseover", handleMouseOver);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(rafId);
    };
  }, [isMobile]);

  // Particle Canvas
  useEffect(() => {
    if (!enableCanvas) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(29,158,117,${p.opacity})`;
        ctx.fill();
      });
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(29,158,117,${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [enableCanvas]);

  // Throttled scroll
  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    setTimeout(() => setIsLoaded(true), 100);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div
      className="landing-page"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: "#030810",
        overflowX: "hidden"
      }}
    >
      {/* ✅ Premium Cursor — Portal to body (bypass filter parent issue) */}
      {!isMobile && createPortal(
        <>
          <div 
            ref={cursorDotRef}
            className={`cursor-dot ${cursorState.hovering ? "cursor-dot--hover" : ""}`}
            style={{ zIndex: 2147483647 }}
          />
          <div 
            ref={cursorRingRef}
            className={`cursor-ring ${cursorState.hovering ? "cursor-ring--hover" : ""}`}
            style={{ zIndex: 2147483646 }}
          >
            {cursorState.label && (
              <span className="cursor-label">{cursorState.label}</span>
            )}
          </div>
        </>,
        document.body
      )}

      {enableCanvas && (
        <canvas
          ref={canvasRef}
          style={{ position: "fixed", top: 0, left: 0, zIndex: 0, pointerEvents: "none" }}
        />
      )}

      <Navbar scrollY={scrollY} />
      <Hero isLoaded={isLoaded} mousePos={mousePos} />
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