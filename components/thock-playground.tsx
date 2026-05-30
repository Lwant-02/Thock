"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { IconRefresh } from "@tabler/icons-react";
import { motion } from "motion/react";
import { Keyboard } from "@/components/ui/keyboard";
import { useTypingEngine } from "@/lib/use-typing-engine";
import { DEFAULT_PACK, type SoundPack } from "@/lib/sound-packs";
import { Header } from "./header";
import { Results } from "./results";
import { Quote } from "./quote";
import { Switch } from "./switch";
import { TypeHint } from "./type-hint";
import { Settings, type KeyboardSettings } from "./settings";
import { ShareDialog } from "./share-dialog";
import { PlaygroundBg } from "./playground-bg";
import { ButtonContent } from "./button-content";

export function ThockPlayground() {
  const {
    words,
    target,
    input,
    caret,
    finished,
    timeLeft,
    wpm,
    accuracy,
    restart,
    author,
  } = useTypingEngine();
  const [pack, setPack] = useState<SoundPack>(DEFAULT_PACK);
  const [settings, setSettings] = useState<KeyboardSettings>({
    enableSound: true,
    showPreview: true,
    layout: "mac",
  });

  // Thocks counting state and optimistic updates for server-sync
  const [thocksFromDatabase, setThocksFromDatabase] = useState<number>(0);
  const [thocksCount, setThocksCount] = useState<number>(0);

  const debouncedThocks = useDebounce(thocksCount, 5000);
  const syncedRef = useRef(0);

  // Poll database
  useEffect(() => {
    const fetchGlobal = async () => {
      try {
        const res = await fetch("/api/thocks");
        const data = await res.json();
        setThocksFromDatabase(data.count);
      } catch (err) {
        console.error("Failed to fetch global thocks:", err);
      }
    };

    fetchGlobal();
  }, []);

  // Sync user's keypresses to server when debounced count changes
  useEffect(() => {
    const syncThocks = async () => {
      const diff = debouncedThocks - syncedRef.current;
      if (diff <= 0) return;

      syncedRef.current = debouncedThocks;
      try {
        const res = await fetch("/api/thocks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: diff }),
        });
        const data = await res.json();
        setThocksFromDatabase(data.count);

        // Safely adjust local counts
        setThocksCount((prev) => Math.max(0, prev - diff));
        syncedRef.current = Math.max(0, syncedRef.current - diff);
      } catch (error) {
        console.error("Failed to sync thocks:", error);
      }
    };

    syncThocks();
  }, [debouncedThocks]);

  const handleKeystroke = useCallback(() => {
    if (finished) return;
    setThocksCount((prev) => prev + 1);
  }, [finished]);

  // Listen for active keystrokes during standard typing flow
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Tab") return;
      if (finished) return;

      // Count printable characters, space, and backspaces
      if (e.key.length === 1 || e.key === "Backspace") {
        handleKeystroke();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [finished, handleKeystroke]);

  // Calculate typing errors by comparing typed characters with the target quote
  const correct = input
    .split("")
    .filter((char, i) => char === target[i]).length;
  const errors = Math.max(0, input.length - correct);

  return (
    <div className="relative flex min-h-screen flex-col items-center px-6 py-10 overflow-hidden">
      <PlaygroundBg />
      <div className="relative z-10 flex w-full max-w-4xl flex-1 flex-col">
        <Header
          wpm={wpm}
          accuracy={accuracy}
          timeLeft={timeLeft}
          finished={finished}
          thocksCount={thocksFromDatabase + thocksCount}
        />

        <div className="relative">
          <div className="mt-10 relative overflow-hidden h-24 text-2xl leading-loose tracking-none select-none">
            {finished ? (
              <Results wpm={wpm} accuracy={accuracy} />
            ) : (
              <>
                <Quote
                  words={words}
                  input={input}
                  target={target}
                  caret={caret}
                  author={author}
                />
              </>
            )}
          </div>
          {!finished && author && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 0.4, y: 0 }}
              whileHover={{ opacity: 0.8 }}
              transition={{ duration: 0.3 }}
              className="absolute -bottom-5 right-2 text-base font-handwriting text-neutral-500 select-none pointer-events-auto transition-opacity duration-200"
            >
              By - {author}
            </motion.div>
          )}
        </div>

        <div className="flex-1" />

        <div className="relative mb-10 w-full">
          <TypeHint />
          <Keyboard
            enableSound={settings.enableSound}
            soundUrl={pack.url}
            configUrl={pack.configUrl}
            showPreview={settings.showPreview}
            layout={settings.layout}
          />
        </div>

        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 24,
            delay: 0.3,
          }}
          className="flex items-center justify-between"
        >
          <div className="flex justify-between items-center gap-4">
            <Switch pack={pack} onChange={setPack} />
            <Settings settings={settings} onChange={setSettings} />
          </div>
          <div className="flex justify-between items-center gap-4">
            <ShareDialog
              wpm={wpm}
              accuracy={accuracy}
              errors={errors}
              packName={pack.name}
              packColor={pack.color}
            />
            <motion.button
              type="button"
              onClick={restart}
              initial="initial"
              whileHover="hover"
              className="flex items-center cursor-pointer gap-2 text-sm text-neutral-500 hover:text-neutral-800 active:scale-95 transition-colors duration-200 outline-none"
            >
              <ButtonContent
                initial={
                  <>
                    <IconRefresh className="h-4 w-4" />
                    <span>Restart</span>
                  </>
                }
                hover={
                  <>
                    <IconRefresh className="h-4 w-4" />
                    <span>Restart</span>
                  </>
                }
              />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
