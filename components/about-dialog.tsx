"use client";

import { IconInfoCircle } from "@tabler/icons-react";
import { motion } from "motion/react";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { LOGO_PATH } from "@/data/constant";

export const AboutDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex items-center cursor-pointer gap-1.5 font-handwriting text-xl text-neutral-400 hover:text-neutral-700 active:scale-95 transition-colors duration-200 outline-none"
        >
          <IconInfoCircle className="size-4 -translate-y-0.5" />
          <span>About</span>
        </button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="w-[400px] p-6 bg-white rounded-lg border border-neutral-200 shadow-2xl select-none focus-visible:outline-none text-neutral-800"
      >
        <div className="flex flex-col items-center text-center">
          <motion.div
            animate={{
              y: [0, -6, 0],
              rotate: [-5, -3, -5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#fafafa] border border-neutral-200/50 shadow-md rotate-[-5deg]"
          >
            <Image
              src={LOGO_PATH}
              alt="Thock Logo"
              width={56}
              height={56}
              priority
              className="object-contain"
            />
          </motion.div>

          <DialogTitle className="font-sans font-black text-2xl tracking-tight text-neutral-800 uppercase">
            Thock
          </DialogTitle>
          <span className="font-handwriting text-xl text-neutral-400 mt-1">
            keyboard typing playground
          </span>

          <DialogDescription className="mt-4 text-xs leading-relaxed text-neutral-500 max-w-[320px]">
            Thock is a minimalist typing space designed to make writing feel
            incredibly satisfying. Focused on rich mechanical keyboard
            acoustics, tactile clicky feedback, and crisp minimalist aesthetics.
          </DialogDescription>

          <p className="mt-6 text-[10px] text-neutral-400 font-medium italic">
            "Built with ❤️ by Lwant"
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
