"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { toPng } from "html-to-image";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { IconShare, IconDownload } from "@tabler/icons-react";
import { SwitchSwatch } from "./switch";
import { ButtonContent } from "./button-content";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

export const ShareDialog = ({
  wpm,
  accuracy,
  errors,
  packName,
  packColor,
}: {
  wpm: number;
  accuracy: number;
  errors: number;
  packName: string;
  packColor: string;
}) => {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    const d = new Date();
    const dayName = days[d.getDay()];
    const monthName = months[d.getMonth()];
    const dateNum = d.getDate();
    setFormattedDate(`DAILY THOCK · ${dayName}, ${monthName} ${dateNum}`);
  }, []);

  const cardRef = useRef<HTMLDivElement>(null);

  const handleSaveImage = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        backgroundColor: "#f4f4f4",
        pixelRatio: 2, // 2x resolution for high quality
      });
      const link = document.createElement("a");
      link.download = `thock.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image:", err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.button
          type="button"
          initial="initial"
          whileHover="hover"
          className="flex items-center cursor-pointer gap-2 text-sm text-neutral-500 hover:text-neutral-800 active:scale-95 transition-colors duration-200 outline-none"
        >
          <ButtonContent
            initial={
              <>
                <IconShare className="h-4 w-4" />
                <span>Share</span>
              </>
            }
            hover={
              <>
                <IconShare className="h-4 w-4" />
                <span>Share</span>
              </>
            }
          />
        </motion.button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="w-[360px] p-0 overflow-hidden bg-[#f4f4f4] rounded-lg border border-neutral-200 shadow-2xl select-none focus-visible:outline-none"
      >
        <div className="sr-only">
          <DialogTitle>Share Thock Stats</DialogTitle>
          <DialogDescription>
            A summary card of your typing session stats, including {wpm} Words
            Per Minute, {accuracy}% accuracy, and {errors} errors.
          </DialogDescription>
        </div>

        <div ref={cardRef} className="bg-[#f4f4f4] w-full">
          <div className="bg-white p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1.5 font-sans font-black text-base">
                <Image
                  src="/logo.png"
                  alt="Thock Logo"
                  width={22}
                  height={22}
                  priority
                  className="object-contain"
                />
                thock
              </div>
              <span className="text-[8px] font-bold tracking-widest text-neutral-400 font-mono">
                {formattedDate}
              </span>
            </div>

            <div className="flex flex-col items-start mt-10 mb-6">
              <span className="text-[10px] font-extrabold tracking-widest text-neutral-400 uppercase">
                Words Per Minute (WPM)
              </span>
              <span className="text-8xl font-black text-neutral-900 tracking-tighter mt-1 leading-none">
                {wpm}
              </span>
            </div>
          </div>

          <div className="h-[3px] w-full bg-[#d56430]" />

          <div className="p-6 flex flex-col gap-5">
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col">
                <span className="text-[8px] font-bold tracking-widest text-neutral-400 uppercase">
                  Accuracy
                </span>
                <span className="text-2xl font-black text-neutral-800 mt-0.5 leading-none">
                  {accuracy}%
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-bold tracking-widest text-neutral-400 uppercase">
                  Errors
                </span>
                <span className="text-2xl font-black text-neutral-800 mt-0.5 leading-none">
                  {errors}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-bold tracking-widest text-neutral-400 uppercase">
                  Sound Pack
                </span>
                <span className="text-xs font-bold text-neutral-700 mt-2 truncate leading-none">
                  {packName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white border border-neutral-200/50 p-2.5 rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
              <SwitchSwatch color={packColor} />
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-neutral-700 leading-none">
                  Typed on {packName}
                </span>
                <span className="text-[8px] text-neutral-400 mt-1 leading-none font-medium">
                  Satisfying custom mechanical keyboard
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-200/40">
              <Image
                src="/logo.png"
                alt="Thock Logo"
                width={22}
                height={22}
                priority
                className="object-contain"
              />
              <span className="text-[9px] font-bold tracking-wider text-neutral-400 font-mono">
                {APP_URL}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border-t border-neutral-200/80 p-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleSaveImage}
            className="flex w-full h-8 items-center justify-center gap-1.5 rounded-md text-xs font-bold bg-neutral-900 text-white border border-neutral-900 hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <IconDownload className="h-3.5 w-3.5" />
            Save as Image
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
