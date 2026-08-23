import { DIFFICULTIES } from "../game/types";
import type { DifficultyId } from "../game/types";

interface Props {
  value: DifficultyId;
  onChange: (id: DifficultyId) => void;
}

export function DifficultyPicker({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {DIFFICULTIES.map((d) => {
        const active = d.id === value;
        return (
          <button
            key={d.id}
            onClick={() => onChange(d.id)}
            aria-pressed={active}
            className={`rounded-lg border-2 px-3 py-2.5 text-left transition-all duration-150 ${
              active
                ? "border-lime-300 bg-lime-400 text-pine-900 shadow-[4px_4px_0_rgba(0,0,0,0.45)]"
                : "border-pine-600 bg-pine-800 text-pine-200 hover:border-pine-400 hover:bg-pine-700 active:translate-y-0.5"
            }`}
          >
            <span className="block font-display text-[10px]">{d.label}</span>
            <span
              className={`mt-1.5 block font-body text-[10px] font-medium leading-tight ${
                active ? "text-pine-700" : "text-pine-300"
              }`}
            >
              {d.tag} · {d.blurb}
            </span>
          </button>
        );
      })}
    </div>
  );
}
