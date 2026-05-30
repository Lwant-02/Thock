import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  IconSettings,
  IconVolume,
  IconVolumeOff,
  IconEye,
  IconEyeOff,
  IconBrandApple,
  IconBrandWindows,
  IconChevronDown,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export interface KeyboardSettings {
  enableSound: boolean;
  showPreview: boolean;
  layout: "mac" | "win";
}

export const Settings = ({
  settings,
  onChange,
}: {
  settings: KeyboardSettings;
  onChange: (s: KeyboardSettings) => void;
}) => {
  const toggleSound = () => {
    onChange({ ...settings, enableSound: !settings.enableSound });
  };

  const togglePreview = () => {
    onChange({ ...settings, showPreview: !settings.showPreview });
  };

  const setLayout = (layout: "mac" | "win") => {
    onChange({ ...settings, layout });
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-neutral-400">Settings</span>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex cursor-pointer w-[250px] items-center justify-between gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium shadow-sm transition-colors outline-none hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-neutral-300"
          >
            <div className="flex items-center gap-2">
              <IconSettings className="h-4 w-4 text-neutral-500 transition-transform duration-500 hover:rotate-45" />
              <span>Settings</span>
            </div>
            <IconChevronDown
              className={cn(
                "h-4 w-4 text-neutral-400 transition-transform duration-200",
                isOpen && "rotate-180",
              )}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          side="top"
          className="w-[250px] p-4 flex flex-col gap-4 bg-white border border-neutral-200 rounded-xl shadow-lg select-none"
        >
          <div>
            <h3 className="text-sm font-semibold text-neutral-800">
              Preferences
            </h3>
            <p className="text-[10px] text-neutral-400">
              Configure typing playground details
            </p>
          </div>

          <hr className="border-neutral-100" />

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-neutral-700">
                Sound Feedback
              </span>
              <span className="text-[10px] text-neutral-400">
                Hear mechanical key sounds
              </span>
            </div>
            <button
              type="button"
              onClick={toggleSound}
              className={cn(
                "flex h-8 w-11 cursor-pointer items-center justify-center rounded-lg border transition-all",
                settings.enableSound
                  ? "bg-neutral-900 border-neutral-900 text-white shadow-sm"
                  : "bg-white border-neutral-200 text-neutral-400 hover:bg-neutral-50",
              )}
            >
              {settings.enableSound ? (
                <IconVolume className="h-4 w-4" />
              ) : (
                <IconVolumeOff className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Key Preview Setting Row */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-neutral-700">
                Keycap Preview
              </span>
              <span className="text-[10px] text-neutral-400">
                Show visual keystroke indicator
              </span>
            </div>
            <button
              type="button"
              onClick={togglePreview}
              className={cn(
                "flex h-8 w-12 cursor-pointer items-center justify-center rounded-lg border transition-all",
                settings.showPreview
                  ? "bg-neutral-900 border-neutral-900 text-white shadow-sm"
                  : "bg-white border-neutral-200 text-neutral-400 hover:bg-neutral-50",
              )}
            >
              {settings.showPreview ? (
                <IconEye className="h-4 w-4" />
              ) : (
                <IconEyeOff className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Keyboard Layout Setting Row */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-neutral-700">
                Keyboard Layout
              </span>
              <span className="text-[10px] text-neutral-400">
                Legends for macOS or Windows
              </span>
            </div>
            <div className="flex rounded-lg bg-neutral-100 p-0.5 border border-neutral-200/50">
              <button
                type="button"
                onClick={() => setLayout("mac")}
                className={cn(
                  "flex h-7 px-2 cursor-pointer items-center justify-center gap-1 rounded-md text-[10px] font-bold uppercase transition-all",
                  settings.layout === "mac"
                    ? "bg-white text-neutral-800 shadow-xs"
                    : "text-neutral-400 hover:text-neutral-600",
                )}
              >
                <IconBrandApple className="h-3 w-3" />
                Mac
              </button>
              <button
                type="button"
                onClick={() => setLayout("win")}
                className={cn(
                  "flex h-7 px-2 cursor-pointer items-center justify-center gap-1 rounded-md text-[10px] font-bold uppercase transition-all",
                  settings.layout === "win"
                    ? "bg-white text-neutral-800 shadow-xs"
                    : "text-neutral-400 hover:text-neutral-600",
                )}
              >
                <IconBrandWindows className="h-3 w-3" />
                Win
              </button>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
