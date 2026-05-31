"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { sentences } from "@/data/data";

const DEFAULT_DURATION = 30;

export interface TypingEngine {
  words: string[];
  target: string;
  input: string;
  caret: number;
  started: boolean;
  finished: boolean;
  timeLeft: number;
  wpm: number;
  accuracy: number;
  restart: () => void;
}

export function useTypingEngine(duration = DEFAULT_DURATION): TypingEngine {
  const [words, setWords] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);

  const target = useMemo(() => words.join(" "), [words]);
  // Done when the timer runs out, or when the whole quote has been typed.
  const finished =
    (started && timeLeft <= 0) ||
    (target.length > 0 && input.length >= target.length);

  // Refs keep the keydown handler stable while reading the latest values.
  const refs = useRef({ started, finished, target });
  useEffect(() => {
    refs.current = { started, finished, target };
  });

  const loadQuote = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * sentences.length);
    const quote = sentences[randomIndex];
    const rawWords = quote.split(/\s+/).filter(Boolean);
    setWords(rawWords);
  }, []);

  useEffect(() => {
    loadQuote();
  }, [loadQuote]);

  const restart = useCallback(() => {
    setInput("");
    setStarted(false);
    setTimeLeft(duration);
    loadQuote();
  }, [duration, loadQuote]);

  // Capture typed text (the keyboard component handles its own sound + press).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "Tab") {
        e.preventDefault();
        return;
      }
      if (refs.current.finished) return;

      if (e.key === "Backspace") {
        e.preventDefault();
        setInput((s) => s.slice(0, -1));
        return;
      }
      if (e.key === " ") e.preventDefault();

      if (e.key.length === 1) {
        if (!refs.current.started) setStarted(true);
        setInput((s) => {
          if (s.length < refs.current.target.length) {
            const next = s + e.key;
            checkAndPlayThock(next, refs.current.target);
            return next;
          }
          return s;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Countdown — the async setState inside the timeout doesn't cascade renders.
  useEffect(() => {
    if (!started || finished) return;
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [started, finished, timeLeft]);

  const { wpm, accuracy } = useMemo(() => {
    let correct = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === target[i]) correct++;
    }
    const elapsed = started ? duration - timeLeft : 0;
    const wpm = elapsed > 0 ? Math.round(correct / 5 / (elapsed / 60)) : 0;
    const accuracy =
      input.length > 0 ? Math.round((correct / input.length) * 100) : 100;
    return { wpm, accuracy };
  }, [input, target, started, timeLeft, duration]);

  return {
    words,
    target,
    input,
    caret: input.length,
    started,
    finished,
    timeLeft,
    wpm,
    accuracy,
    restart,
  };
}

const playThockSound = () => {
  if (typeof window === "undefined") return;
  try {
    const audio = new Audio("/sounds/thock.mp3");
    audio.volume = 0.8;
    audio.play().catch((err) => console.warn("Audio play blocked or file missing:", err));
  } catch (err) {
    console.warn("Failed to play thock sound", err);
  }
};

function checkAndPlayThock(input: string, target: string) {
  if (!input || !target) return;
  const currentLen = input.length;
  const words = target.split(/\s+/).filter(Boolean);
  let accumulatedIndex = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const wordStartIdx = accumulatedIndex;
    const wordEndIdx = wordStartIdx + word.length;
    accumulatedIndex = wordEndIdx + 1;

    if (currentLen === wordEndIdx) {
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, "");
      if (cleanWord === "thock") {
        const typedWord = input.slice(wordStartIdx, wordEndIdx);
        if (typedWord === word) {
          playThockSound();
        }
      }
      break;
    }
  }
}
