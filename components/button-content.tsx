"use client";

import React from "react";
import { motion } from "motion/react";

export const ButtonContent = ({
  initial,
  hover,
}: {
  initial: React.ReactNode;
  hover: React.ReactNode;
}) => {
  return (
    <div className="relative h-5 overflow-hidden">
      <motion.div
        variants={{
          initial: { y: 0 },
          hover: { y: -24 },
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="flex items-center justify-center gap-2 whitespace-nowrap"
      >
        {initial}
      </motion.div>
      <motion.div
        variants={{
          initial: { y: 24 },
          hover: { y: 0 },
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="absolute inset-0 flex items-center justify-center gap-2 whitespace-nowrap"
      >
        {hover}
      </motion.div>
    </div>
  );
};
