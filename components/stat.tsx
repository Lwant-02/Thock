"use client";

import { motion } from "motion/react";

interface StatProps {
  value: number;
  unit: string;
}

export const Stat = ({ value, unit }: StatProps) => {
  return (
    <span className="flex items-baseline gap-1 select-none">
      <span className="relative flex overflow-hidden h-7 items-center justify-center">
        <motion.span
          key={value}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 22,
            mass: 0.5,
          }}
          className="inline-block text-2xl font-semibold tabular-nums text-neutral-800"
        >
          {value}
        </motion.span>
      </span>
      <span className="text-xs text-neutral-400 select-none">{unit}</span>
    </span>
  );
};
