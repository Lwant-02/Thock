import { Stat } from "./stat";
import { motion } from "motion/react";

interface HeaderProps {
  wpm: number;
  accuracy: number;
  timeLeft: number;
  finished: boolean;
  thocksCount: number;
}

const formatNumber = (v: number) => {
  return new Intl.NumberFormat().format(v);
};

export const Header = ({
  wpm,
  accuracy,
  timeLeft,
  finished,
  thocksCount,
}: HeaderProps) => {
  return (
    <motion.div
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 24,
      }}
      className="flex items-center justify-between select-none"
    >
      <span className="flex items-center gap-1 text-sm font-medium">
        <span className="relative flex overflow-hidden h-5 items-center justify-center">
          <motion.span
            key={thocksCount}
            initial={{ y: 15, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 600,
              damping: 24,
              mass: 0.6,
            }}
            className="inline-block font-bold text-neutral-800 tabular-nums"
          >
            {formatNumber(thocksCount)}
          </motion.span>
        </span>
        <span className="text-neutral-400">Thocks and Counting</span>
      </span>

      <div className="flex items-center gap-6">
        <Stat value={finished ? 0 : timeLeft} unit="s" />
        <Stat value={wpm} unit="wpm" />
        <Stat value={accuracy} unit="% acc" />
      </div>
    </motion.div>
  );
};
