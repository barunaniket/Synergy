// src/components/AINavbar.tsx
import React, { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "../utils/cn";
import { HeartPulse } from "lucide-react";

export const AINavbar = () => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      let direction = current - (scrollYProgress.getPrevious() ?? 0);
      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Emergency", link: "/emergency", special: true },
    { name: "AI News", link: "/ai-news", special: true },
    { name: "Find a Hospital", link: "/find-a-hospital" },
    { name: "Services", link: "/services" },
    { name: "About", link: "/about" },
    { name: "Contact", link: "/contact" },
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 1, y: -100 }}
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "flex max-w-fit fixed top-6 inset-x-0 mx-auto border border-white/[0.2] rounded-full bg-black shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] px-8 py-2 items-center justify-center space-x-4"
        )}
      >
        <Link to="/" className="flex items-center space-x-2 mr-4">
            <HeartPulse className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-dark-text-primary">Synergy</span>
        </Link>
        {navItems.map((navItem) => (
          <Link
            key={navItem.link}
            to={navItem.link}
            className={cn(
              "relative text-neutral-50 items-center flex space-x-1 hover:text-neutral-300 transition-colors",
              navItem.special ? "text-primary hover:text-teal-400" : ""
            )}
          >
            <span className="text-sm">{navItem.name}</span>
          </Link>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};