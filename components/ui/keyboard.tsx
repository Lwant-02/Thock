"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { CODE_TO_ID, type PackConfig } from "@/lib/sound-keymap";
import { DEFAULT_PACK } from "@/lib/sound-packs";
import {
  IconBrightnessDown,
  IconBrightnessUp,
  IconCaretRightFilled,
  IconCaretUpFilled,
  IconChevronUp,
  IconMicrophone,
  IconMoon,
  IconPlayerSkipForward,
  IconPlayerTrackNext,
  IconPlayerTrackPrev,
  IconTable,
  IconVolume,
  IconVolume2,
  IconVolume3,
  IconSearch,
  IconWorld,
  IconCommand,
  IconCaretLeftFilled,
  IconCaretDownFilled,
} from "@tabler/icons-react";

// Keycap color variants — off-white alphas, charcoal modifiers, orange accent.
type Variant = "alpha" | "mod" | "accent";
const VARIANTS: Record<Variant, string> = {
  alpha: "bg-[#f3f2ef] text-[#3a3a3a]",
  mod: "bg-[#8c8d93] text-[#262626]",
  accent: "bg-[#d56430] text-white",
};

// Map key codes to display labels
const KEY_DISPLAY_LABELS: Record<string, string> = {
  Escape: "esc",
  Backspace: "delete",
  Tab: "tab",
  Enter: "return",
  ShiftLeft: "shift",
  ShiftRight: "shift",
  ControlLeft: "control",
  ControlRight: "control",
  AltLeft: "option",
  AltRight: "option",
  MetaLeft: "command",
  MetaRight: "command",
  Space: "space",
  CapsLock: "caps",
  ArrowUp: "↑",
  ArrowDown: "↓",
  ArrowLeft: "←",
  ArrowRight: "→",
  Backquote: "`",
  Minus: "-",
  Equal: "=",
  BracketLeft: "[",
  BracketRight: "]",
  Backslash: "\\",
  Semicolon: ";",
  Quote: "'",
  Comma: ",",
  Period: ".",
  Slash: "/",
};

const getKeyDisplayLabel = (
  keyCode: string,
  layout: "mac" | "win" = "mac",
): string => {
  if (layout === "win") {
    if (keyCode === "MetaLeft" || keyCode === "MetaRight") return "win";
    if (keyCode === "AltLeft" || keyCode === "AltRight") return "alt";
    if (keyCode === "Backspace") return "backspace";
    if (keyCode === "Enter") return "enter";
  }
  if (KEY_DISPLAY_LABELS[keyCode]) return KEY_DISPLAY_LABELS[keyCode];
  if (keyCode.startsWith("Key")) return keyCode.slice(3);
  if (keyCode.startsWith("Digit")) return keyCode.slice(5);
  if (keyCode.startsWith("F") && keyCode.length <= 3) return keyCode;
  return keyCode;
};

interface KeyboardContextType {
  playSoundDown: (keyCode: string) => void;
  playSoundUp: (keyCode: string) => void;
  pressedKeys: Set<string>;
  setPressed: (keyCode: string) => void;
  setReleased: (keyCode: string) => void;
  lastPressedKey: string | null;
  layout?: "mac" | "win";
}

const KeyboardContext = createContext<KeyboardContextType | null>(null);

const useKeyboardSound = () => {
  const context = useContext(KeyboardContext);
  if (!context) {
    throw new Error("useKeyboardSound must be used within KeyboardProvider");
  }
  return context;
};

const KeyboardProvider = ({
  children,
  enableSound = false,
  soundUrl = DEFAULT_PACK.url,
  configUrl = DEFAULT_PACK.configUrl,
  containerRef,
  layout = "mac",
}: {
  children: React.ReactNode;
  enableSound?: boolean;
  soundUrl?: string;
  configUrl?: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  layout?: "mac" | "win";
}) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const spriteBufferRef = useRef<AudioBuffer | null>(null);
  const sampleBuffersRef = useRef<Record<string, AudioBuffer>>({});
  const definesRef = useRef<PackConfig["defines"]>({});
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [lastPressedKey, setLastPressedKey] = useState<string | null>(null);
  const [soundLoaded, setSoundLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enableSound) return;
    let cancelled = false;
    setSoundLoaded(false);

    const load = async () => {
      try {
        const ctx = audioContextRef.current ?? new AudioContext();
        audioContextRef.current = ctx;

        const configRes = await fetch(configUrl);
        if (!configRes.ok) return;
        const config = (await configRes.json()) as PackConfig;
        if (cancelled) return;

        definesRef.current = config.defines ?? {};
        const isMulti = config.key_define_type === "multi";

        if (isMulti) {
          const baseUrl = soundUrl.substring(0, soundUrl.lastIndexOf("/") + 1);
          const filenames = new Set(
            Object.values(config.defines).filter(
              (v): v is string => typeof v === "string" && v !== "",
            ),
          );
          const buffers: Record<string, AudioBuffer> = {};
          await Promise.all(
            [...filenames].map(async (name) => {
              const res = await fetch(baseUrl + name);
              if (!res.ok) return;
              buffers[name] = await ctx.decodeAudioData(
                await res.arrayBuffer(),
              );
            }),
          );
          if (cancelled) return;
          sampleBuffersRef.current = buffers;
          spriteBufferRef.current = null;
        } else {
          const res = await fetch(soundUrl);
          if (!res.ok) return;
          const buffer = await ctx.decodeAudioData(await res.arrayBuffer());
          if (cancelled) return;
          spriteBufferRef.current = buffer;
          sampleBuffersRef.current = {};
        }

        setSoundLoaded(true);
      } catch (e) {
        console.warn("Failed to load sound pack:", e);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [enableSound, soundUrl, configUrl]);

  useEffect(() => {
    return () => {
      audioContextRef.current?.close();
      audioContextRef.current = null;
    };
  }, []);

  const playSample = useCallback(
    (keyCode: string, release: boolean) => {
      if (!enableSound || !soundLoaded) return;
      const ctx = audioContextRef.current;
      if (!ctx) return;

      const id = CODE_TO_ID[keyCode];
      if (id === undefined) return;
      const entry = definesRef.current[id];
      if (!entry) return;

      if (ctx.state === "suspended") ctx.resume();
      const source = ctx.createBufferSource();
      source.connect(ctx.destination);

      if (typeof entry === "string") {
        // Multi-file pack — play the whole sample on press, skip release.
        if (release) return;
        const buf = sampleBuffersRef.current[entry];
        if (!buf) return;
        source.buffer = buf;
        source.start(0);
      } else {
        // Single-sprite pack — slice press/release halves from the sprite.
        const buf = spriteBufferRef.current;
        if (!buf) return;
        const [startMs, durationMs] = entry;
        const half = durationMs * 0.5;
        source.buffer = buf;
        source.start(
          0,
          (release ? startMs + half : startMs) / 1000,
          half / 1000,
        );
      }
    },
    [enableSound, soundLoaded],
  );

  const playSoundDown = useCallback(
    (keyCode: string) => playSample(keyCode, false),
    [playSample],
  );

  const playSoundUp = useCallback(
    (keyCode: string) => playSample(keyCode, true),
    [playSample],
  );

  const setPressed = useCallback((keyCode: string) => {
    setPressedKeys((prev) => new Set(prev).add(keyCode));
    setLastPressedKey(keyCode);
  }, []);

  const setReleased = useCallback((keyCode: string) => {
    setPressedKeys((prev) => {
      const next = new Set(prev);
      next.delete(keyCode);
      return next;
    });
  }, []);

  // Track visibility with IntersectionObserver
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [containerRef]);

  // Handle physical keyboard events (only when visible)
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent repeat events
      if (e.repeat) return;

      const keyCode = e.code;
      playSoundDown(keyCode);
      setPressed(keyCode);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const keyCode = e.code;
      playSoundUp(keyCode);
      setReleased(keyCode);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [isVisible, playSoundDown, playSoundUp, setPressed, setReleased]);

  return (
    <KeyboardContext.Provider
      value={{
        playSoundDown,
        playSoundUp,
        pressedKeys,
        setPressed,
        setReleased,
        lastPressedKey,
        layout,
      }}
    >
      {children}
    </KeyboardContext.Provider>
  );
};

const KeystrokePreview = () => {
  const { lastPressedKey, pressedKeys, layout } = useKeyboardSound();
  const [displayKey, setDisplayKey] = useState<string | null>(null);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (lastPressedKey) {
      if (
        lastPressedKey === "Space" ||
        lastPressedKey === "ShiftLeft" ||
        lastPressedKey === "ShiftRight"
      ) {
        setDisplayKey(null);
        return;
      }

      setDisplayKey(getKeyDisplayLabel(lastPressedKey, layout));
      setAnimationKey((prev) => prev + 1);
    }
  }, [lastPressedKey, layout]);

  const isPressed = pressedKeys.size > 0;

  return (
    <div className="relative flex h-fit w-full items-end justify-center">
      <AnimatePresence mode="popLayout">
        {displayKey && (
          <motion.div
            key={animationKey}
            layout
            initial={{ opacity: 0, scale: 0.5, y: 5 }}
            animate={{
              opacity: 1,
              scale: isPressed ? 0.95 : 1,
              y: 0,
            }}
            exit={{ opacity: 0, scale: 0.8, y: -5 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              mass: 0.5,
            }}
            className="absolute bottom-0 flex items-center justify-center text-base font-black text-neutral-700"
          >
            <motion.span
              initial={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
              animate={{ opacity: 0.6, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.05 }}
              className="text-base"
            >
              {displayKey}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Keyboard = ({
  className,
  enableSound = false,
  soundUrl,
  configUrl,
  showPreview = false,
  layout = "mac",
}: {
  className?: string;
  enableSound?: boolean;
  soundUrl?: string;
  configUrl?: string;
  showPreview?: boolean;
  layout?: "mac" | "win";
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <KeyboardProvider
      enableSound={enableSound}
      soundUrl={soundUrl}
      configUrl={configUrl}
      containerRef={containerRef}
      layout={layout}
    >
      <motion.div
        ref={containerRef}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 24,
          delay: 0.15,
        }}
        className={cn(
          "mx-auto w-fit zoom-[0.8] sm:zoom-[1.25] md:zoom-[1.5] lg:zoom-[1.75] xl:zoom-[2.25]",
          className,
        )}
      >
        {showPreview && <KeystrokePreview />}
        <Keypad />
      </motion.div>
    </KeyboardProvider>
  );
};

export const Keypad = () => {
  const { layout = "mac" } = useKeyboardSound();
  return (
    <div className="h-fit w-fit rounded-xl bg-linear-to-b from-[#46474b] to-[#343539] p-1 shadow-lg font-sans ring-1 shadow-black/20 ring-black/30">
      <Row>
        <Key
          keyCode="Escape"
          variant="accent"
          containerClassName="rounded-tl-xl"
          className="w-10 rounded-tl-lg"
          childrenClassName="items-start justify-end pb-[2px] pl-[4px]"
        >
          <span>esc</span>
        </Key>
        <Key keyCode="F1">
          <IconBrightnessDown className="h-[6px] w-[6px]" />
          <span className="mt-1">F1</span>
        </Key>
        <Key keyCode="F2">
          <IconBrightnessUp className="h-[6px] w-[6px]" />
          <span className="mt-1">F2</span>
        </Key>
        <Key keyCode="F3">
          <IconTable className="h-[6px] w-[6px]" />
          <span className="mt-1">F3</span>
        </Key>
        <Key keyCode="F4">
          <IconSearch className="h-[6px] w-[6px]" />
          <span className="mt-1">F4</span>
        </Key>
        <Key keyCode="F5" variant="mod" className="text-white">
          <IconMicrophone className="h-[6px] w-[6px]" />
          <span className="mt-1">F5</span>
        </Key>
        <Key keyCode="F6" variant="mod" className="text-white">
          <IconMoon className="h-[6px] w-[6px]" />
          <span className="mt-1">F6</span>
        </Key>
        <Key keyCode="F7" variant="mod" className="text-white">
          <IconPlayerTrackPrev className="h-[6px] w-[6px]" />
          <span className="mt-1">F7</span>
        </Key>
        <Key keyCode="F8" variant="mod" className="text-white">
          <IconPlayerSkipForward className="h-[6px] w-[6px]" />
          <span className="mt-1">F8</span>
        </Key>
        <Key keyCode="F9" variant="mod" className="text-white">
          <IconPlayerTrackNext className="h-[6px] w-[6px]" />
          <span className="mt-1">F9</span>
        </Key>
        <Key keyCode="F10">
          <IconVolume3 className="h-[6px] w-[6px]" />
          <span className="mt-1">F10</span>
        </Key>
        <Key keyCode="F11">
          <IconVolume2 className="h-[6px] w-[6px]" />
          <span className="mt-1">F11</span>
        </Key>
        <Key keyCode="F12">
          <IconVolume className="h-[6px] w-[6px]" />
          <span className="mt-1">F12</span>
        </Key>
        <Key
          variant="mod"
          containerClassName="rounded-tr-xl"
          className="rounded-tr-lg"
        >
          <div className="h-4 w-4 rounded-full bg-linear-to-b from-neutral-400 via-neutral-300 to-neutral-400 p-px">
            <div className="h-full w-full rounded-full bg-neutral-200" />
          </div>
        </Key>
      </Row>

      {/* Number Row */}
      <Row>
        <Key keyCode="Backquote">
          <span>~</span>
          <span>`</span>
        </Key>
        <Key keyCode="Digit1">
          <span>!</span>
          <span>1</span>
        </Key>
        <Key keyCode="Digit2">
          <span>@</span>
          <span>2</span>
        </Key>
        <Key keyCode="Digit3">
          <span>#</span>
          <span>3</span>
        </Key>
        <Key keyCode="Digit4">
          <span>$</span>
          <span>4</span>
        </Key>
        <Key keyCode="Digit5">
          <span>%</span>
          <span>5</span>
        </Key>
        <Key keyCode="Digit6">
          <span>^</span>
          <span>6</span>
        </Key>
        <Key keyCode="Digit7">
          <span>&</span>
          <span>7</span>
        </Key>
        <Key keyCode="Digit8">
          <span>*</span>
          <span>8</span>
        </Key>
        <Key keyCode="Digit9">
          <span>(</span>
          <span>9</span>
        </Key>
        <Key keyCode="Digit0">
          <span>)</span>
          <span>0</span>
        </Key>
        <Key keyCode="Minus">
          <span>—</span>
          <span>_</span>
        </Key>
        <Key keyCode="Equal">
          <span>+</span>
          <span>=</span>
        </Key>
        <Key
          keyCode="Backspace"
          variant="mod"
          className="w-10 text-white"
          childrenClassName="items-end justify-end pr-[4px] pb-[2px]"
        >
          <span>{layout === "win" ? "backspace" : "delete"}</span>
        </Key>
      </Row>

      {/* QWERTY Row */}
      <Row>
        <Key
          keyCode="Tab"
          variant="mod"
          className="w-10 text-white"
          childrenClassName="items-start justify-end pb-[2px] pl-[4px]"
        >
          <span>tab</span>
        </Key>
        {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map((letter) => (
          <Key key={letter} keyCode={`Key${letter}`}>
            {letter}
          </Key>
        ))}
        <Key keyCode="BracketLeft">
          <span>{`{`}</span>
          <span>{`[`}</span>
        </Key>
        <Key keyCode="BracketRight">
          <span>{`}`}</span>
          <span>{`]`}</span>
        </Key>
        <Key keyCode="Backslash">
          <span>{`|`}</span>
          <span>{`\\`}</span>
        </Key>
      </Row>

      {/* Home Row */}
      <Row>
        <Key
          keyCode="CapsLock"
          variant="mod"
          className="w-[2.8rem] text-white"
          childrenClassName="items-start justify-end pb-[2px] pl-[4px]"
        >
          <span>caps lock</span>
        </Key>
        {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map((letter) => (
          <Key key={letter} keyCode={`Key${letter}`}>
            {letter}
          </Key>
        ))}
        <Key keyCode="Semicolon">
          <span>:</span>
          <span>;</span>
        </Key>
        <Key keyCode="Quote">
          <span>{`"`}</span>
          <span>{`'`}</span>
        </Key>
        <Key
          keyCode="Enter"
          variant="mod"
          className="w-[2.85rem] text-white"
          childrenClassName="items-end justify-end pr-[4px] pb-[2px]"
        >
          <span>{layout === "win" ? "enter" : "return"}</span>
        </Key>
      </Row>

      {/* Bottom Letter Row */}
      <Row>
        <Key
          keyCode="ShiftLeft"
          variant="mod"
          className="w-[3.65rem] text-white"
          childrenClassName="items-start justify-end pb-[2px] pl-[4px]"
        >
          <span>shift</span>
        </Key>
        {["Z", "X", "C", "V", "B", "N", "M"].map((letter) => (
          <Key key={letter} keyCode={`Key${letter}`}>
            {letter}
          </Key>
        ))}
        <Key keyCode="Comma">
          <span>{`<`}</span>
          <span>,</span>
        </Key>
        <Key keyCode="Period">
          <span>{`>`}</span>
          <span>.</span>
        </Key>
        <Key keyCode="Slash">
          <span>?</span>
          <span>/</span>
        </Key>
        <Key
          keyCode="ShiftRight"
          variant="mod"
          className="w-[3.65rem] text-white"
          childrenClassName="items-end justify-end pr-[4px] pb-[2px]"
        >
          <span>shift</span>
        </Key>
      </Row>

      {/* Modifier Row */}
      <Row>
        <ModifierKey
          keyCode="Fn"
          containerClassName="rounded-bl-xl"
          className="rounded-bl-lg text-white"
        >
          <span>fn</span>
          <IconWorld className="h-[6px] w-[6px]" />
        </ModifierKey>
        <ModifierKey keyCode="ControlLeft" className="text-white">
          <IconChevronUp className="h-[6px] w-[6px]" />
          <span>control</span>
        </ModifierKey>
        <ModifierKey keyCode="AltLeft" className="text-white">
          {layout === "win" ? (
            <span className="text-[6px] font-bold">Alt</span>
          ) : (
            <OptionKey className="h-[6px] w-[6px]" />
          )}
          <span>{layout === "win" ? "alt" : "option"}</span>
        </ModifierKey>
        <ModifierKey keyCode="MetaLeft" className="w-8 text-white">
          {layout === "win" ? (
            <WindowsLogo className="h-[5px] w-[5px]" />
          ) : (
            <IconCommand className="h-[6px] w-[6px]" />
          )}
          <span>{layout === "win" ? "win" : "command"}</span>
        </ModifierKey>
        <Key keyCode="Space" className="w-[8.2rem]" />
        <ModifierKey keyCode="MetaRight" className="w-8 text-white">
          {layout === "win" ? (
            <WindowsLogo className="h-[5px] w-[5px]" />
          ) : (
            <IconCommand className="h-[6px] w-[6px]" />
          )}
          <span>{layout === "win" ? "win" : "command"}</span>
        </ModifierKey>
        <ModifierKey keyCode="AltRight" className="text-white">
          {layout === "win" ? (
            <span className="text-[6px] font-bold">Alt</span>
          ) : (
            <OptionKey className="h-[6px] w-[6px]" />
          )}
          <span>{layout === "win" ? "alt" : "option"}</span>
        </ModifierKey>
        {/* Arrow Keys */}
        <div className="flex h-6 w-[4.9rem] items-center justify-end rounded-[4px] p-[0.5px]">
          <Key keyCode="ArrowLeft" className="h-6 w-6">
            <IconCaretLeftFilled className="h-[6px] w-[6px]" />
          </Key>
          <div className="flex flex-col">
            <Key keyCode="ArrowUp" className="h-3 w-6">
              <IconCaretUpFilled className="h-[6px] w-[6px]" />
            </Key>
            <Key keyCode="ArrowDown" className="h-3 w-6">
              <IconCaretDownFilled className="h-[6px] w-[6px]" />
            </Key>
          </div>
          <Key
            keyCode="ArrowRight"
            containerClassName="rounded-br-xl"
            className="h-6 w-6 rounded-br-lg"
          >
            <IconCaretRightFilled className="h-[6px] w-[6px]" />
          </Key>
        </div>
      </Row>
    </div>
  );
};

const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">{children}</div>
);

const Key = ({
  className,
  childrenClassName,
  containerClassName,
  children,
  keyCode,
  variant = "alpha",
}: {
  className?: string;
  childrenClassName?: string;
  containerClassName?: string;
  children?: React.ReactNode;
  keyCode?: string;
  variant?: Variant;
}) => {
  const { playSoundDown, playSoundUp, pressedKeys, setPressed, setReleased } =
    useKeyboardSound();
  const isPressed = keyCode ? pressedKeys.has(keyCode) : false;

  const handleMouseDown = () => {
    if (keyCode) {
      playSoundDown(keyCode);
      setPressed(keyCode);
    }
  };

  const handleMouseUp = () => {
    if (keyCode && isPressed) {
      playSoundUp(keyCode);
      setReleased(keyCode);
    }
  };

  const handleMouseLeave = () => {
    if (keyCode && isPressed) {
      setReleased(keyCode);
    }
  };

  return (
    <div className={cn("rounded-[4px] p-[0.5px]", containerClassName)}>
      <button
        type="button"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "flex h-6 w-6 cursor-pointer items-center justify-center rounded-[3.5px] transition-transform duration-75 active:scale-[0.98]",
          VARIANTS[variant],
          "shadow-[0px_0px_1px_0px_rgba(0,0,0,0.5),0px_1px_1px_0px_rgba(0,0,0,0.15),0px_1px_0px_0px_rgba(255,255,255,0.6)_inset]",
          isPressed && "scale-[0.98] brightness-95",
          className,
        )}
      >
        <div
          className={cn(
            "flex h-full w-full flex-col items-center justify-center text-[5px]",
            childrenClassName,
          )}
        >
          {children}
        </div>
      </button>
    </div>
  );
};

const ModifierKey = ({
  className,
  containerClassName,
  children,
  keyCode,
  variant = "mod",
}: {
  className?: string;
  containerClassName?: string;
  children?: React.ReactNode;
  keyCode?: string;
  variant?: Variant;
}) => {
  const { playSoundDown, playSoundUp, pressedKeys, setPressed, setReleased } =
    useKeyboardSound();
  const isPressed = keyCode ? pressedKeys.has(keyCode) : false;

  const handleMouseDown = () => {
    if (keyCode) {
      playSoundDown(keyCode);
      setPressed(keyCode);
    }
  };

  const handleMouseUp = () => {
    if (keyCode && isPressed) {
      playSoundUp(keyCode);
      setReleased(keyCode);
    }
  };

  const handleMouseLeave = () => {
    if (keyCode && isPressed) {
      setReleased(keyCode);
    }
  };

  return (
    <div className={cn("rounded-[4px] p-[0.5px]", containerClassName)}>
      <button
        type="button"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "flex h-6 w-6 cursor-pointer items-center justify-center rounded-[3.5px] transition-transform duration-75 active:scale-[0.98]",
          VARIANTS[variant],
          "shadow-[0px_0px_1px_0px_rgba(0,0,0,0.5),0px_1px_1px_0px_rgba(0,0,0,0.15),0px_1px_0px_0px_rgba(255,255,255,0.6)_inset]",
          isPressed && "scale-[0.98] brightness-95",
          className,
        )}
      >
        <div className="flex h-full w-full flex-col items-start justify-between p-1 text-[5px]">
          {children}
        </div>
      </button>
    </div>
  );
};

const OptionKey = ({ className }: { className?: string }) => {
  return (
    <svg
      fill="none"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className={className}
    >
      <rect
        stroke="currentColor"
        strokeWidth={2}
        x="18"
        y="5"
        width="10"
        height="2"
      />
      <polygon
        stroke="currentColor"
        strokeWidth={2}
        points="10.6,5 4,5 4,7 9.4,7 18.4,27 28,27 28,25 19.6,25"
      />
    </svg>
  );
};

const WindowsLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M0 3.449L9.75 2.1v9.45H0V3.449zM0 12.45h9.75v9.45L0 20.551v-8.1zM10.8 1.95L24 0v11.55H10.8V1.95zM10.8 12.45H24v11.55l-13.2-1.95v-9.6z" />
  </svg>
);
