"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { LOGO_PATH } from "@/data/constant";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const installedHandler = () => setDeferredPrompt(null);

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    // A prompt can only be used once.
    setDeferredPrompt(null);
  };

  // Hide entirely when not installable (already installed, unsupported, etc.).
  if (!deferredPrompt) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="absolute right-32 top-1/2 z-30 flex -translate-y-1/2 items-center select-none "
    >
      <div className="hidden flex-col items-center sm:flex">
        <span className="font-handwriting text-2xl text-neutral-400 -rotate-6">
          Install
        </span>
        <svg
          width="96"
          height="48"
          viewBox="0 0 160 80"
          fill="none"
          className="text-neutral-400"
        >
          <motion.path
            d="M 8,30 C 24,18 40,52 56,46 C 70,41 64,18 80,24 C 94,29 110,52 138,40"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          />
          <motion.path
            d="M 122,28 C 128,32 136,37 140,40 C 135,44 128,49 124,54"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.9 }}
          />
        </svg>
      </div>

      <motion.button
        type="button"
        onClick={handleInstall}
        title="Install Thock"
        aria-label="Install Thock"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-11 w-11 cursor-pointer pt-5 items-center justify-center transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
      >
        <Image
          src={LOGO_PATH}
          alt="Thock Logo"
          width={28}
          height={28}
          priority
          className="object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.06)]"
        />
      </motion.button>
    </motion.div>
  );
}
