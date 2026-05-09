import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

export default function CountUp({ value, suffix = "", duration = 2 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  
  // Check if value is a number or string like "AI", "24/7"
  const numericValue = parseInt(value);
  const isNumeric = !isNaN(numericValue);
  
  const rounded = useTransform(motionValue, (latest) => 
    Math.round(latest) + suffix
  );

  useEffect(() => {
    if (isInView && isNumeric) {
      const controls = animate(motionValue, numericValue, {
        duration: duration,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [isInView, numericValue, duration]);

  // If not a pure number (like "AI" or "24/7"), just show with fade
  if (!isNumeric) {
    return (
      <motion.span 
        ref={ref}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        {value}
      </motion.span>
    );
  }

  // For numbers, animate count up
  return <motion.span ref={ref}>{rounded}</motion.span>;
}