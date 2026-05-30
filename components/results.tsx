"use client";

import { motion } from "motion/react";
import CountUp from "react-countup";

export const Results = ({
  wpm,
  accuracy,
}: {
  wpm: number;
  accuracy: number;
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.12,
          },
        },
      }}
      className="flex w-full flex-wrap gap-x-12 gap-y-4 justify-center items-center"
    >
      <ResultStat value={`${wpm}`} label="wpm" />
      <ResultStat value={`${accuracy}%`} label="accuracy" />
    </motion.div>
  );
};

function ResultStat({ value, label }: { value: string; label: string }) {
  const numMatch = value.match(/^(\d+)(.*)$/);
  const targetNum = numMatch ? parseInt(numMatch[1], 10) : 0;
  const suffix = numMatch ? numMatch[2] : "";

  return (
    <motion.div
      variants={{
        hidden: { y: 24, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            type: "spring",
            stiffness: 140,
            damping: 18,
          },
        },
      }}
      className="flex flex-col items-center sm:items-start"
    >
      <span className="text-7xl font-semibold tabular-nums text-neutral-800">
        <CountUp end={targetNum} duration={1.2} suffix={suffix} />
      </span>
      <span className="mt-1 text-sm text-neutral-400 font-medium tracking-wide uppercase">
        {label}
      </span>
    </motion.div>
  );
}
