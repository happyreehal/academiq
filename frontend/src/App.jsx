import { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Lenis from "lenis";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import Loader from "./components/Loader";
import PageTransition from "./components/PageTransition";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const AIGenerator = lazy(() => import("./pages/AIGenerator"));
const NotFound = lazy(() => import("./pages/NotFound"));

function MiniLoader() {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "#030810",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999,
    }}>
      <div style={{
        width: "40px", height: "40px",
        border: "3px solid rgba(29,158,117,0.2)",
        borderTopColor: "#1D9E75", borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<MiniLoader />}>
        <Routes location={location} key={location.pathname}>
          
          <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
          
          {/* ✅ Forgot Password Route */}
          <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
          
          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <PageTransition><AdminDashboard /></PageTransition>
            </ProtectedRoute>
          } />
          
          <Route path="/student" element={
            <ProtectedRoute role="student">
              <PageTransition><StudentDashboard /></PageTransition>
            </ProtectedRoute>
          } />
          
          <Route path="/ai-generator" element={
            <ProtectedRoute role="student">
              <PageTransition><AIGenerator /></PageTransition>
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <Loader key="loader" />
            ) : (
              <AnimatedRoutes key="routes" />
            )}
          </AnimatePresence>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;