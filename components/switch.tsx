import { SOUND_PACKS, SoundPack } from "@/lib/sound-packs";
import { IconCheck, IconChevronDown, IconPlus } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function SwitchSwatch({ color }: { color: string }) {
  return (
    <span
      className="flex h-5 w-5 items-center justify-center rounded-sm text-white shadow-sm ring-1 ring-black/5"
      style={{
        backgroundImage: `linear-gradient(to bottom, color-mix(in srgb, ${color}, white 30%), ${color})`,
      }}
    >
      <IconPlus className="h-3.5 w-3.5" strokeWidth={3} />
    </span>
  );
}

export const Switch = ({
  pack,
  onChange,
}: {
  pack: SoundPack;
  onChange: (p: SoundPack) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-neutral-400">Switches</span>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex cursor-pointer w-[250px] items-center justify-between gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium shadow-sm transition-colors outline-none hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-neutral-300"
          >
            <div className="flex items-center gap-2">
              <SwitchSwatch color={pack.color} />
              {pack.name}
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
          className="w-[250px] h-72 overflow-y-scroll"
        >
          {SOUND_PACKS.map((p) => (
            <DropdownMenuItem
              key={p.id}
              onSelect={() => onChange(p)}
              className={cn(p.id === pack.id && "bg-neutral-100", "my-1")}
            >
              <SwitchSwatch color={p.color} />
              <span className="flex-1 whitespace-nowrap">{p.name}</span>
              {p.id === pack.id && (
                <IconCheck className="h-4 w-4 text-neutral-500" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
