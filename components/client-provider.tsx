"use client";

import { ReactNode, useEffect } from "react";

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const clickSound = new Audio("/sounds/click.mp3");
    clickSound.preload = "auto";

    const handleMouseDown = () => {
      const playInstance = clickSound.cloneNode(true) as HTMLAudioElement;
      playInstance.volume = 0.4;
      playInstance.play().catch(() => {});
    };

    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return <>{children}</>;
};
