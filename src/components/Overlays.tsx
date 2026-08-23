import type { ReactNode } from "react";
import type { Hud } from "../game/useSnake";
import { IconTrophy } from "./icons";

function Shell({ children, onPrimary }: { children: ReactNode; onPrimary: () => void }) {
  return (
    <div
      className="anim-fadein absolute inset-0 z-20 flex cursor-pointer touch-none select-none flex-col items-center justify-center gap-4 bg-pine-950/80 px-4 text-center"
      onClick={onPrimary}
    >
      {children}
    </div>
  );
}

interface Props {
  hud: Hud;
  diffLabel: string;
  diffTag: string;
  onPrimary: () => void;
}

export function Overlays({ hud, diffLabel, diffTag, onPrimary }: Props) {
  if (hud.status === "running") return null;

  if (hud.status === "idle") {
    return (
      <Shell onPrimary={onPrimary}>
        <p className="rounded-md border-2 border-pine-500 bg-pine-800/90 px-3 py-1.5 font-body text-[10px] font-semibold uppercase tracking-[0.24em] text-pine-200">
          Difficoltà · {diffLabel} <span className="text-mint-300">{diffTag}</span>
        </p>
        <h2
          className="font-display text-4xl text-lime-300 sm:text-5xl"
          style={{ textShadow: "4px 4px 0 rgba(240,76,94,0.9), 8px 8px 0 rgba(0,0,0,0.45)" }}
        >
          SNAKE
        </h2>
        <p className="-mt-1 font-body text-xs text-pine-200 sm:text-sm">
          Mangia, cresci, non morderti la coda.
        </p>
        <p className="blink mt-4 font-display text-[10px] text-gold-300 sm:text-xs">
          <span className="hidden sm:inline">PREMI SPAZIO PER GIOCARE</span>
          <span className="sm:hidden">TOCCA PER GIOCARE</span>
        </p>
        <div className="mt-4 hidden items-center gap-2 font-body text-[11px] text-pine-200 sm:flex">
          <span className="keycap">↑↓←→</span>
          <span>muovi</span>
          <span className="keycap ml-3">SPAZIO</span>
          <span>pausa</span>
          <span className="keycap ml-3">R</span>
          <span>riavvia</span>
        </div>
      </Shell>
    );
  }

  if (hud.status === "paused") {
    return (
      <Shell onPrimary={onPrimary}>
        <h2
          className="font-display text-3xl text-gold-400 sm:text-4xl"
          style={{ textShadow: "4px 4px 0 rgba(0,0,0,0.5)" }}
        >
          PAUSA
        </h2>
        <p className="rounded-md border-2 border-pine-500 bg-pine-800/90 px-4 py-2 font-body text-xs font-semibold uppercase tracking-[0.2em] text-pine-200">
          Punteggio · <span className="text-lime-300">{hud.score}</span>
        </p>
        <p className="blink mt-3 font-display text-[10px] text-pine-100">
          <span className="hidden sm:inline">SPAZIO PER RIPRENDERE</span>
          <span className="sm:hidden">TOCCA PER RIPRENDERE</span>
        </p>
      </Shell>
    );
  }

  // game over / vittoria
  return (
    <Shell onPrimary={onPrimary}>
      <h2
        className={`font-display text-3xl sm:text-4xl ${hud.win ? "text-lime-300" : "text-coral-400"}`}
        style={{ textShadow: "4px 4px 0 rgba(0,0,0,0.55)" }}
      >
        {hud.win ? "HAI VINTO!" : "GAME OVER"}
      </h2>

      {hud.isNewRecord && (
        <div className="wobble rounded-md border-2 border-gold-300 bg-gold-500 px-4 py-2 font-display text-[10px] text-pine-900 shadow-[4px_4px_0_rgba(0,0,0,0.45)] sm:text-xs">
          ★ NUOVO RECORD! ★
        </div>
      )}

      <div className="anim-rise flex items-center gap-6 rounded-lg border-2 border-pine-500 bg-pine-800/95 px-6 py-4 shadow-[6px_6px_0_rgba(0,0,0,0.4)]">
        <div className="text-left">
          <p className="font-body text-[9px] font-semibold uppercase tracking-[0.24em] text-pine-300">
            Punteggio
          </p>
          <p className="mt-1 font-display text-2xl text-lime-300 sm:text-3xl">{hud.score}</p>
        </div>
        <div className="h-12 w-0.5 bg-pine-600" />
        <div className="text-left">
          <p className="flex items-center gap-1.5 font-body text-[9px] font-semibold uppercase tracking-[0.24em] text-pine-300">
            <IconTrophy className="h-3 w-3 text-gold-400" /> Record
          </p>
          <p className="mt-1 font-display text-2xl text-gold-400 sm:text-3xl">{hud.best}</p>
        </div>
      </div>

      <button
        className="btn-pixel btn-lime mt-2 px-7 py-3.5 text-xs"
        onClick={(e) => {
          e.stopPropagation();
          onPrimary();
        }}
      >
        {hud.win ? "RIGIOCA" : "RIPROVA"}
      </button>
      <p className="font-body text-[11px] text-pine-300">
        oppure premi <span className="keycap">SPAZIO</span>
        <span className="sm:hidden"> o tocca lo schermo</span>
      </p>
    </Shell>
  );
}
