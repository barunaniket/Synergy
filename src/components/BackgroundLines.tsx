import React from "react";
import { motion } from "framer-motion";

export const BackgroundLines = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0">
        <motion.svg
          width="100%"
          height="100%"
          className="w-full h-full"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              {/* Corrected stroke opacity for visibility */}
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="0.5"></path>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"></rect>
        </motion.svg>
      </div>
      {/* Fades at the edges to make it look less harsh */}
      <motion.div
        className="absolute top-0 left-0 w-1/2 h-full"
        style={{
          background: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)'
        }}
      />
      <motion.div
        className="absolute top-0 right-0 w-1/2 h-full"
        style={{
          background: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)'
        }}
      />
    </div>
  );
};