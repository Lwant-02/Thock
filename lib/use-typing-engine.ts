"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_DURATION = 30;
const QUOTE_API = "https://dummyjson.com/quotes/random";
const OFFLINE_FALLBACK = "the quick brown fox jumps over the lazy dog";

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
  author?: string;
}

export function useTypingEngine(duration = DEFAULT_DURATION): TypingEngine {
  const [words, setWords] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [author, setAuthor] = useState("");

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

  const loadQuote = useCallback(async () => {
    try {
      const res = await fetch(QUOTE_API);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: { quote: string; author: string } = await res.json();
      setWords(data.quote.split(/\s+/).filter(Boolean));
      setAuthor(data.author);
    } catch {
      setWords(OFFLINE_FALLBACK.split(" "));
      setAuthor("Anonymous");
    }
  }, []);

  useEffect(() => {
    loadQuote();
  }, [loadQuote]);

  const restart = useCallback(() => {
    setInput("");
    setStarted(false);
    setTimeLeft(duration);
    setAuthor("");
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
        setInput((s) =>
          s.length < refs.current.target.length ? s + e.key : s,
        );
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
    author,
  };
}
