import type { DifficultyDef, DifficultyId } from "../game/types";
import { MAX_SPEED_LEVEL } from "../game/types";
import type { Hud } from "../game/useSnake";
import { DifficultyPicker } from "./DifficultyPicker";
import { IconPause, IconPlay, IconRestart, IconTrophy } from "./icons";

interface Props {
  hud: Hud;
  def: DifficultyDef;
  onDifficulty: (id: DifficultyId) => void;
  onPrimary: () => void;
  onRestart: () => void;
}

const PRIMARY_LABEL: Record<Hud["status"], string> = {
  idle: "Gioca",
  running: "Pausa",
  paused: "Riprendi",
  over: "Rigioca",
};

export function SidePanel({ hud, def, onDifficulty, onPrimary, onRestart }: Props) {
  return (
    <aside className="hidden flex-col gap-4 md:flex">
      {/* punteggio */}
      <div className="panel p-5">
        <div className="flex items-center justify-between">
          <p className="font-body text-[11px] font-semibold uppercase tracking-[0.24em] text-pine-300">
            Punteggio
          </p>
          <p className="font-body text-[10px] font-medium text-pine-300">
            mele <span className="font-display text-[10px] text-coral-300">{hud.apples}</span>
          </p>
        </div>
        <p
          key={hud.score}
          className="pop mt-2 font-display text-4xl text-lime-300"
          style={{ textShadow: "0 0 18px rgba(163,230,53,0.45)" }}
        >
          {hud.score}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg border-2 border-pine-600 bg-pine-800 p-3">
            <p className="flex items-center gap-1.5 font-body text-[9px] font-semibold uppercase tracking-[0.2em] text-pine-300">
              <IconTrophy className="h-3.5 w-3.5 text-gold-400" /> Record
            </p>
            <p key={hud.best} className="pop mt-1.5 font-display text-lg text-gold-400">
              {hud.best}
            </p>
          </div>
          <div className="rounded-lg border-2 border-pine-600 bg-pine-800 p-3">
            <p className="font-body text-[9px] font-semibold uppercase tracking-[0.2em] text-pine-300">
              Lunghezza
            </p>
            <p key={hud.length} className="pop mt-1.5 font-display text-lg text-mint-300">
              {hud.length}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between font-body text-[9px] font-semibold uppercase tracking-[0.2em] text-pine-300">
            <span>Velocità</span>
            <span className="text-gold-300">LV {hud.speedLevel}</span>
          </div>
          <div className="mt-2 flex gap-1">
            {Array.from({ length: MAX_SPEED_LEVEL }, (_, i) => (
              <span
                key={i}
                className={`h-3 flex-1 rounded-[3px] border transition-all duration-300 ${
                  i < hud.speedLevel
                    ? "border-gold-300 bg-gold-400 shadow-[0_0_8px_rgba(255,201,60,0.55)]"
                    : "border-pine-600 bg-pine-800"
                }`}
              />
            ))}
          </div>
          <p className="mt-1.5 font-body text-[10px] text-pine-300">
            Il ritmo cresce del 4% ogni 4 mele, fino al livello {MAX_SPEED_LEVEL}.
          </p>
        </div>
      </div>

      {/* difficoltà */}
      <div className="panel p-5">
        <p className="font-body text-[11px] font-semibold uppercase tracking-[0.24em] text-pine-300">
          Difficoltà
        </p>
        <div className="mt-3">
          <DifficultyPicker value={def.id} onChange={onDifficulty} />
        </div>
        <p className="mt-2.5 font-body text-[10px] leading-relaxed text-pine-300">
          Cambiare difficoltà riporta al via: il record resta salvato per ogni livello.
        </p>
      </div>

      {/* azioni */}
      <div className="flex gap-3">
        <button
          onClick={onPrimary}
          className={`btn-pixel flex flex-1 items-center justify-center gap-2.5 py-3.5 text-[11px] ${
            hud.status === "running" ? "btn-gold" : "btn-lime"
          }`}
        >
          {hud.status === "running" ? (
            <IconPause className="h-3.5 w-3.5" />
          ) : (
            <IconPlay className="h-3.5 w-3.5" />
          )}
          {PRIMARY_LABEL[hud.status]}
        </button>
        <button
          onClick={onRestart}
          className="btn-pixel btn-coral flex items-center justify-center gap-2.5 px-4 py-3.5 text-[11px]"
          aria-label="Ricomincia la partita"
        >
          <IconRestart className="h-3.5 w-3.5" />
          Ricomincia
        </button>
      </div>

      {/* comandi */}
      <div className="panel p-5">
        <p className="font-body text-[11px] font-semibold uppercase tracking-[0.24em] text-pine-300">
          Comandi
        </p>
        <ul className="mt-3 flex flex-col gap-2.5 font-body text-xs text-pine-200">
          <li className="flex items-center justify-between gap-3">
            <span>Muovi il serpente</span>
            <span className="flex gap-1">
              <span className="keycap">↑↓←→</span>
              <span className="keycap">WASD</span>
            </span>
          </li>
          <li className="flex items-center justify-between gap-3">
            <span>Pausa / riprendi</span>
            <span className="keycap">SPAZIO</span>
          </li>
          <li className="flex items-center justify-between gap-3">
            <span>Riavvia la partita</span>
            <span className="keycap">R</span>
          </li>
          <li className="flex items-center justify-between gap-3">
            <span>Audio on / off</span>
            <span className="keycap">M</span>
          </li>
        </ul>
      </div>
    </aside>
  );
}
