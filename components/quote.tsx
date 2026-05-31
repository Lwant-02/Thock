import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { LOGO_PATH } from "@/data/constant";

interface ThockWordProps {
  wordStartIdx: number;
  wordEndIdx: number;
  input: string;
  target: string;
  caret: number;
  baseChars: React.ReactNode;
  punctChars: React.ReactNode;
  spaceIdx: number;
}

function ThockWord({
  wordStartIdx,
  wordEndIdx,
  input,
  target,
  caret,
  baseChars,
  punctChars,
  spaceIdx,
}: ThockWordProps) {
  const isCompleted = caret >= wordEndIdx;
  const isActive = caret >= wordStartIdx && caret < wordEndIdx;

  // Track errors
  let hasErrors = false;
  for (let i = wordStartIdx; i < Math.min(caret, wordEndIdx); i++) {
    if (input[i] !== target[i]) {
      hasErrors = true;
      break;
    }
  }

  return (
    <motion.span
      variants={{
        hidden: { opacity: 0, y: 6 },
        show: { opacity: 1, y: 0 },
      }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 22,
      }}
      className="inline-flex items-center"
    >
      <motion.span
        animate={{
          scale: isCompleted && !hasErrors ? [1, 1.1, 1] : isActive ? 1.02 : 1,
        }}
        transition={{
          scale: {
            duration: 0.3,
            ease: "easeOut",
          },
        }}
        className="relative inline-flex items-center  shrink-0 select-none"
      >
        {baseChars}
        <motion.span
          animate={{
            scale: isActive ? [1, 1.12, 1] : 1,
            rotate: isActive ? [0, -6, 6, 0] : 0,
          }}
          transition={{
            repeat: isActive ? Infinity : 0,
            repeatType: "reverse",
            duration: 1.6,
          }}
          className="flex items-center justify-center shrink-0"
        >
          <Image
            src={LOGO_PATH}
            alt="Thock Logo"
            width={20}
            height={20}
            className={cn(
              "size-5 object-contain filter transition-all duration-300",
              isCompleted && !hasErrors
                ? "opacity-95 saturate-100 scale-105"
                : "opacity-75 saturate-50",
              isActive &&
                "scale-110 saturate-100 drop-shadow-[0_0_4px_rgba(245,158,11,0.4)]",
            )}
          />
        </motion.span>
      </motion.span>
      {punctChars}
      {spaceIdx >= 0 && (
        <Char
          ch=" "
          idx={spaceIdx}
          input={input}
          target={target}
          caret={caret}
        />
      )}
    </motion.span>
  );
}

export const Quote = ({
  words,
  input,
  target,
  caret,
}: {
  words: string[];
  input: string;
  target: string;
  caret: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const active = container.querySelector(
      '[data-caret="true"]',
    ) as HTMLElement | null;
    if (!active) return;

    const lineHeight = 48; // text-2xl leading-loose = 48px
    const containerRect = container.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();

    // Position of the active element within the full scrollable content
    const activeContentTop =
      activeRect.top - containerRect.top + container.scrollTop;
    // Snap to the line boundary the caret sits on
    const targetScroll = Math.floor(activeContentTop / lineHeight) * lineHeight;

    if (Math.abs(container.scrollTop - targetScroll) > 1) {
      container.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    }
  }, [caret]);

  let gi = 0;
  return (
    <motion.div
      key={target} // Re-animate when a new quote is loaded
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.012,
          },
        },
      }}
      ref={containerRef}
      className="relative h-full overflow-hidden px-1"
    >
      {words.map((word, wi) => {
        const cleanWord = word.toLowerCase().replace(/[^a-z]/g, "");
        const isThockWord = cleanWord === "thock";

        const wordStartIdx = gi;
        const match = word.match(/^([a-zA-Z]+)([^a-zA-Z]*)$/);
        const baseWord = match ? match[1] : word;
        const punctuation = match ? match[2] : "";

        const baseChars = baseWord.split("").map((ch) => {
          const idx = gi++;
          return (
            <Char
              key={idx}
              ch={ch}
              idx={idx}
              input={input}
              target={target}
              caret={caret}
              isThock={isThockWord}
            />
          );
        });

        const punctChars = punctuation.split("").map((ch) => {
          const idx = gi++;
          return (
            <Char
              key={idx}
              ch={ch}
              idx={idx}
              input={input}
              target={target}
              caret={caret}
              isThock={false}
            />
          );
        });

        const wordEndIdx = gi;
        const spaceIdx = wi < words.length - 1 ? gi++ : -1;

        if (isThockWord) {
          return (
            <ThockWord
              key={wi}
              wordStartIdx={wordStartIdx}
              wordEndIdx={wordEndIdx}
              input={input}
              target={target}
              caret={caret}
              baseChars={baseChars}
              punctChars={punctChars}
              spaceIdx={spaceIdx}
            />
          );
        }

        const chars = [...baseChars, ...punctChars];

        return (
          <motion.span
            key={wi}
            variants={{
              hidden: { opacity: 0, y: 6 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 22,
            }}
            className="inline-flex"
          >
            {chars}
            {spaceIdx >= 0 && (
              <Char
                ch=" "
                idx={spaceIdx}
                input={input}
                target={target}
                caret={caret}
              />
            )}
          </motion.span>
        );
      })}
    </motion.div>
  );
};

function Char({
  ch,
  idx,
  input,
  target,
  caret,
  isThock = false,
}: {
  ch: string;
  idx: number;
  input: string;
  target: string;
  caret: number;
  isThock?: boolean;
}) {
  const typed = idx < input.length;
  const correct = typed && input[idx] === target[idx];
  const isSpace = ch === " ";

  return (
    <span
      className="relative whitespace-pre"
      data-caret={idx === caret ? "true" : undefined}
    >
      {idx === caret && (
        <motion.span
          layoutId="caret"
          transition={{
            type: "spring",
            stiffness: 450,
            damping: 28,
            mass: 0.4,
          }}
          className={cn(
            "absolute -left-px top-2.5 h-7 w-[2px] rounded z-10 animate-pulse",
            isThock ? "bg-[#d56430]" : "bg-neutral-700",
          )}
        />
      )}
      <span
        className={cn(
          typed
            ? correct
              ? isThock
                ? "text-[#d56430] font-semibold"
                : "text-neutral-700"
              : "text-red-500"
            : "text-neutral-400/50",
          isSpace && typed && !correct && "rounded bg-red-300/50",
        )}
      >
        {isSpace ? " " : ch}
      </span>
    </span>
  );
}
