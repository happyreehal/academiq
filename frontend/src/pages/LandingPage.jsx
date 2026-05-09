import { useEffect, useRef, useState, useCallback } from "react";
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
  const [visibleSections, setVisibleSections] = useState({});
  const canvasRef = useRef(null);

  // ✅ Check mobile + reduced motion
  const isMobile = window.innerWidth <= 768;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const enableCanvas = !isMobile && !prefersReducedMotion;

  // ✅ Page title
  useEffect(() => {
    document.title = "AcademiQ | Smart Question Paper Portal";
    return () => { document.title = "AcademiQ"; };
  }, []);

  // Particle Canvas — only on desktop
  useEffect(() => {
    if (!enableCanvas) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // ✅ Reduced particles: 80 → 50
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

  // ✅ Throttled scroll + mouse
  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  // ✅ Throttled mousemove — RAF based
  const mouseMoveRaf = useRef(null);
  const handleMouseMove = useCallback((e) => {
    if (mouseMoveRaf.current) return;
    mouseMoveRaf.current = requestAnimationFrame(() => {
      setMousePos({ x: e.clientX, y: e.clientY });
      mouseMoveRaf.current = null;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    if (!isMobile) window.addEventListener("mousemove", handleMouseMove);
    setTimeout(() => setIsLoaded(true), 100);
    return () => { 
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      if (mouseMoveRaf.current) cancelAnimationFrame(mouseMoveRaf.current);
    };
  }, [handleScroll, handleMouseMove, isMobile]);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setVisibleSections(prev => ({ ...prev, [e.target.id]: true }));
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll("[data-animate]").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const isVisible = (id) => visibleSections[id];

  return (
    <div 
      className="landing-page"
      style={{ 
        fontFamily: "'DM Sans', sans-serif", 
        background: "#030810", 
        overflowX: "hidden"
      }}
    >
      {/* ✅ Custom Cursor — only desktop */}
      {!isMobile && (
        <>
          <div className="cursor-dot" style={{ left: mousePos.x, top: mousePos.y }} />
          <div className="cursor-ring" style={{ left: mousePos.x, top: mousePos.y }} />
        </>
      )}

      {/* ✅ Canvas — only desktop */}
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