import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, Siren, Sparkles, Hospital, Stethoscope, Info, Mail } from "lucide-react";

export const FloatingDockNav = () => {
  const navItems = [
    { name: "Home", link: "/", icon: <Home className="h-5 w-5 text-neutral-300" /> },
    { name: "Emergency", link: "/emergency", icon: <Siren className="h-5 w-5 text-neutral-300" /> },
    { name: "CURA", link: "/cura", icon: <Sparkles className="h-5 w-5 text-primary" /> },
    { name: "Find a Hospital", link: "/find-a-hospital", icon: <Hospital className="h-5 w-5 text-neutral-300" /> },
    { name: "Services", link: "/services", icon: <Stethoscope className="h-5 w-5 text-neutral-300" /> },
    { name: "About", link: "/about", icon: <Info className="h-5 w-5 text-neutral-300" /> },
    { name: "Contact", link: "/contact", icon: <Mail className="h-5 w-5 text-neutral-300" /> },
  ];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="fixed bottom-10 inset-x-0 w-max mx-auto z-50">
      <div
        onMouseLeave={() => setHoveredIndex(null)}
        className="flex items-center justify-center gap-2 p-2 rounded-full border border-neutral-700 bg-black/50 backdrop-blur-md"
      >
        {navItems.map((item, idx) => (
          <div
            key={item.link}
            className="relative group"
            onMouseEnter={() => setHoveredIndex(idx)}
          >
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  className="absolute -top-12 left-1/2 -translate-x-1/2 text-xs flex items-center justify-center rounded-md bg-neutral-800 border border-neutral-600 px-3 py-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 10 } }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <span className="text-white whitespace-nowrap">{item.name}</span>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 bg-neutral-800 transform rotate-45" />
                </motion.span>
              )}
            </AnimatePresence>
            <Link
              to={item.link}
              className="w-12 h-12 rounded-full flex items-center justify-center bg-transparent group-hover:bg-neutral-800 transition-colors duration-300"
            >
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: hoveredIndex === idx ? -4 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                {item.icon}
              </motion.div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};