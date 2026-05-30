"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { AboutDialog } from "./about-dialog";

export const TypeHint = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.25 }}
      className="hidden xl:flex absolute -left-48 top-1/2 -translate-y-1/2 flex-col items-end gap-1 select-none"
    >
      <div className="flex items-center gap-2 mb-3 rotate-[-8deg] mr-2">
        <Image
          src="/logo.png"
          alt="Thock Logo"
          width={28}
          height={28}
          priority
          className="object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.06)]"
        />
        <span className="font-sans font-black text-xl text-neutral-800 tracking-tight">
          thock
        </span>
      </div>
      <span className="font-handwriting text-2xl text-neutral-400">
        type it and
      </span>
      <span className="font-handwriting text-2xl text-neutral-400">
        you&apos;ll hear
      </span>
      <svg
        width="140"
        height="90"
        viewBox="0 0 160 100"
        fill="none"
        className="mt-2 text-neutral-400"
      >
        <motion.path
          d="M 12,14 C 20,12 25,48 30,62 C 35,76 42,40 45,22 C 48,4 58,48 68,68 C 76,84 92,62 86,38 C 82,20 68,32 78,52 C 85,66 110,74 135,70"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.0, ease: "easeInOut", delay: 0.5 }}
        />

        <motion.path
          d="M 122,58 C 126,62 136,68 142,72"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 1.4 }}
        />
        <motion.path
          d="M 142,72 C 136,75 128,82 125,86"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 1.55 }}
        />
        <motion.path
          d="M 125,86 C 124,80 123,68 122,58"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 1.7 }}
        />

        <motion.path
          d="M 126,64 Q 127,72 128,80"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.15, ease: "easeOut", delay: 1.9 }}
        />
        <motion.path
          d="M 130,66 Q 131,71 132,77"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.15, ease: "easeOut", delay: 2.0 }}
        />
        <motion.path
          d="M 134,68 Q 134.5,71 135,74"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.15, ease: "easeOut", delay: 2.1 }}
        />
      </svg>
      <div className="mt-4 mr-6">
        <AboutDialog />
      </div>
    </motion.div>
  );
};
