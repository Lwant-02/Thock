import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";

export const Quote = ({
  words,
  input,
  target,
  caret,
  author,
}: {
  words: string[];
  input: string;
  target: string;
  caret: number;
  author?: string;
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
        const chars = word.split("").map((ch) => {
          const idx = gi++;
          return (
            <Char
              key={idx}
              ch={ch}
              idx={idx}
              input={input}
              target={target}
              caret={caret}
            />
          );
        });
        const spaceIdx = wi < words.length - 1 ? gi++ : -1;
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
}: {
  ch: string;
  idx: number;
  input: string;
  target: string;
  caret: number;
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
          className="absolute -left-px top-2.5 h-7 w-[2px] rounded bg-neutral-700 z-10 animate-pulse"
        />
      )}
      <span
        className={cn(
          typed
            ? correct
              ? "text-neutral-700"
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
