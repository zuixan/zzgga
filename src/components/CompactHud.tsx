import type { Hud } from "../game/useSnake";
import { IconPause, IconPlay, IconRestart, IconTrophy } from "./icons";

interface Props {
  hud: Hud;
  onPrimary: () => void;
  onRestart: () => void;
}

export function CompactHud({ hud, onPrimary, onRestart }: Props) {
  return (
    <div className="panel flex items-center justify-between gap-3 px-4 py-2.5 md:hidden">
      <div className="min-w-0">
        <p className="font-body text-[8px] font-semibold uppercase tracking-[0.2em] text-pine-300">
          Punti
        </p>
        <p
          key={hud.score}
          className="pop mt-0.5 font-display text-lg leading-none text-lime-300"
          style={{ textShadow: "0 0 14px rgba(163,230,53,0.4)" }}
        >
          {hud.score}
        </p>
      </div>

      <div className="min-w-0">
        <p className="flex items-center gap-1 font-body text-[8px] font-semibold uppercase tracking-[0.2em] text-pine-300">
          <IconTrophy className="h-2.5 w-2.5 text-gold-400" /> Record
        </p>
        <p key={hud.best} className="pop mt-0.5 font-display text-lg leading-none text-gold-400">
          {hud.best}
        </p>
      </div>

      <div className="min-w-0">
        <p className="font-body text-[8px] font-semibold uppercase tracking-[0.2em] text-pine-300">
          Lunghezza
        </p>
        <p key={hud.length} className="pop mt-0.5 font-display text-lg leading-none text-mint-300">
          {hud.length}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onPrimary}
          className={`btn-pixel p-2.5 ${hud.status === "running" ? "btn-gold" : "btn-lime"}`}
          aria-label={hud.status === "running" ? "Pausa" : "Gioca"}
        >
          {hud.status === "running" ? (
            <IconPause className="h-4 w-4" />
          ) : (
            <IconPlay className="h-4 w-4" />
          )}
        </button>
        <button
          onClick={onRestart}
          className="btn-pixel btn-coral p-2.5"
          aria-label="Ricomincia"
        >
          <IconRestart className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
