export const PlaygroundBg = () => {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
      <div
        className="absolute inset-0 text-neutral-200 dark:text-neutral-800 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1.2px, transparent 1.2px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="absolute right-[-15vw] top-1/2 -translate-y-1/2 flex items-center justify-center">
        <div className="text-[26vh] font-black leading-none tracking-tighter text-neutral-100/80 dark:text-neutral-900/15 -rotate-90 origin-center select-none pointer-events-none uppercase">
          thock
        </div>
      </div>
    </div>
  );
};
