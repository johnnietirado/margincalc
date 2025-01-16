"use client";

import { motion } from "framer-motion";

export function DashboardLoading() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-background">
      <div className="relative">
        {/* Main pulsing circle */}
        <motion.div
          className="w-16 h-16 bg-primary rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Rotating circles */}
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute top-1/2 left-1/2 w-24 h-24 -ml-12 -mt-12"
            style={{
              border: "2px solid",
              borderColor: "hsl(var(--primary) / 0.3)",
              borderRadius: "50%",
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              delay: index * 0.4,
            }}
          />
        ))}

        {/* Loading text */}
        <motion.p
          className="absolute mt-8 left-1/2 -translate-x-1/2 text-primary font-medium w-52 text-center"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Preparing Calcular
        </motion.p>
      </div>
    </div>
  );
}
