"use client";

import { LOGO_PATH } from "@/data/constant";
import { motion } from "motion/react";
import Image from "next/image";

export const LaptopOnly = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] px-6 text-center select-none overflow-hidden relative">
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-orange-400/5 rounded-full blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-neutral-900/5 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="relative z-10 flex max-w-sm flex-col items-center"
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [-6, -4, -6],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-white border border-neutral-200/50 shadow-xl shadow-neutral-100 -rotate-6deg"
        >
          <Image
            src={LOGO_PATH}
            alt="Thock Logo"
            width={72}
            height={72}
            priority
            className="object-contain"
          />
        </motion.div>

        <h1 className="font-sans font-black text-3xl tracking-tight text-neutral-800 uppercase">
          Desktop Only
        </h1>

        <span className="mt-2 font-handwriting text-2xl text-neutral-400">
          physical keyboard required
        </span>

        <p className="mt-6 text-sm leading-relaxed text-neutral-500 font-medium">
          Thock is an immersive mechanical typing playground designed for
          satisfying audio feedback and mechanical keystrokes.
        </p>
        <p className="mt-3 text-xs leading-relaxed text-neutral-400">
          Grab a seat at your desk, open Thock on a laptop or desktop computer,
          and plug in your favorite keyboard to get typing!
        </p>

        <div className="mt-10 flex gap-2.5">
          <kbd className="inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-b-2 border-neutral-300 bg-white px-1.5 font-mono text-sm font-bold text-neutral-600 shadow-sm">
            ⌘
          </kbd>
          <kbd className="inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-b-2 border-neutral-300 bg-white px-1.5 font-mono text-sm font-bold text-neutral-600 shadow-sm">
            ⌥
          </kbd>
          <kbd className="inline-flex h-9 min-w-16 items-center justify-center rounded-md border border-b-2 border-neutral-300 bg-white px-2.5 font-mono text-sm font-bold text-neutral-500 shadow-sm">
            space
          </kbd>
        </div>
      </motion.div>
    </div>
  );
};
