import { useEffect, useMemo } from "react";
import type { CSSProperties } from "react";
import { useSnake } from "./game/useSnake";
import type { Status } from "./game/types";
import { Overlays } from "./components/Overlays";
import { SidePanel } from "./components/SidePanel";
import { DifficultyPicker } from "./components/DifficultyPicker";
import { TouchPad } from "./components/TouchPad";
import { CompactHud } from "./components/CompactHud";
import { IconSoundOff, IconSoundOn, SnakeLogo } from "./components/icons";

const STATUS_META: Record<Status, { label: string; dot: string }> = {
  idle: { label: "Pronto", dot: "bg-pine-300 text-pine-300" },
  running: { label: "In gioco", dot: "bg-lime-400 text-lime-400" },
  paused: { label: "Pausa", dot: "bg-gold-400 text-gold-400" },
  over: { label: "Game over", dot: "bg-coral-400 text-coral-400" },
};

const TICKER_ITEMS = [
  "MANGIA LA MELA",
  "+10 PUNTI",
  "LA STELLA ORO VALE 50",
  "NON MORDERTI LA CODA",
  "OGNI 4 MELE ACCELERI",
  "SPAZIO = PAUSA",
  "R = RIAVVIA",
  "M = AUDIO",
];

function Ambient() {
  const flies = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => {
        const colors = ["#a3e635", "#ffd24a", "#5fe3a5", "#ff9c8f"];
        const size = 2 + Math.random() * 3;
        return {
          left: Math.random() * 100,
          top: Math.random() * 100,
          size,
          dur: 7 + Math.random() * 9,
          delay: -Math.random() * 12,
          fx: (Math.random() - 0.5) * 90,
          fy: (Math.random() - 0.5) * 70,
          color: colors[i % colors.length],
        };
      }),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="bg-gridlines absolute inset-0" />
      <div className="drift absolute -left-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(163,230,53,0.07),transparent_62%)]" />
      <div className="drift-slow absolute -bottom-52 -right-40 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(255,201,60,0.06),transparent_62%)]" />
      <div className="absolute right-1/4 top-1/3 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(95,227,165,0.05),transparent_65%)]" />
      {flies.map((f, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={
            {
              left: `${f.left}%`,
              top: `${f.top}%`,
              width: f.size,
              height: f.size,
              background: f.color,
              boxShadow: `0 0 ${f.size * 3}px ${f.color}`,
              opacity: 0.5,
              animation: `firefly ${f.dur}s ease-in-out ${f.delay}s infinite`,
              "--fx": `${f.fx}px`,
              "--fy": `${f.fy}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

function Ticker() {
  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center">
      {TICKER_ITEMS.map((it, i) => (
        <span key={i} className="flex items-center">
          <span className="px-5 font-display text-[8px] tracking-widest text-pine-300">{it}</span>
          <span className="text-[10px] text-coral-500">✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <footer className="ticker relative z-10 overflow-hidden border-t-2 border-pine-700 bg-pine-900/90 py-2">
      <div className="ticker-track flex w-max">{[row("a"), row("b")]}</div>
    </footer>
  );
}

export default function App() {
  const game = useSnake();
  const { hud, def } = game;
  const meta = STATUS_META[hud.status];

  useEffect(() => {
    if (document.fonts?.load) {
      document.fonts.load('12px "Press Start 2P"').catch(() => {});
    }
  }, []);

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-pine-950">
      <Ambient />

      <div className="relative z-10 flex flex-1 flex-col">
        {/* intestazione */}
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <SnakeLogo className="h-10 w-10 drop-shadow-[0_0_12px_rgba(163,230,53,0.45)]" />
            <div>
              <p
                className="font-display text-base leading-none text-lime-300 sm:text-lg"
                style={{ textShadow: "3px 3px 0 rgba(240,76,94,0.85)" }}
              >
                SNAKE
              </p>
              <p className="mt-1.5 font-body text-[9px] font-semibold uppercase tracking-[0.32em] text-pine-300 sm:text-[10px]">
                Arcade Edition
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex items-center gap-2 rounded-lg border-2 border-pine-600 bg-pine-800/80 px-3 py-2">
              <span className={`led h-2 w-2 rounded-full ${meta.dot}`} />
              <span className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-pine-200">
                {meta.label}
              </span>
            </div>
            <button
              onClick={game.toggleMute}
              className="btn-pixel p-2.5"
              aria-label={game.muted ? "Attiva audio" : "Disattiva audio"}
            >
              {game.muted ? (
                <IconSoundOff className="h-4 w-4" />
              ) : (
                <IconSoundOn className="h-4 w-4" />
              )}
            </button>
          </div>
        </header>

        {/* corpo */}
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 pb-6 md:grid md:grid-cols-[minmax(0,1fr)_330px] md:items-start md:gap-8">
          <CompactHud hud={hud} onPrimary={game.primaryAction} onRestart={game.restart} />

          <section className="flex flex-col items-center gap-3.5">
            <div className="relative w-[min(92vw,52dvh)] md:w-[min(42rem,66vh,100%)]">
              {/* angoli arcade */}
              {[
                "-left-2 -top-2 border-l-4 border-t-4",
                "-right-2 -top-2 border-r-4 border-t-4",
                "-bottom-2 -left-2 border-b-4 border-l-4",
                "-bottom-2 -right-2 border-b-4 border-r-4",
              ].map((c) => (
                <span
                  key={c}
                  className={`pointer-events-none absolute z-20 h-6 w-6 rounded-[4px] border-lime-400/70 ${c}`}
                />
              ))}

              <div
                ref={game.boardRef}
                onTouchStart={game.onTouchStart}
                onTouchMove={game.onTouchMove}
                onTouchEnd={game.onTouchEnd}
                onContextMenu={(e) => e.preventDefault()}
                className="relative aspect-square w-full touch-none select-none overflow-hidden rounded-xl border-4 border-pine-500 bg-pine-800 shadow-[10px_10px_0_rgba(0,0,0,0.45),0_0_70px_rgba(163,230,53,0.08)]"
              >
                <canvas ref={game.canvasRef} className="absolute inset-0 h-full w-full" />
                <Overlays
                  hud={hud}
                  diffLabel={def.label}
                  diffTag={def.tag}
                  onPrimary={game.overlayAction}
                />
              </div>
            </div>

            {/* suggerimenti */}
            <div className="hidden items-center gap-2 font-body text-[11px] text-pine-300 md:flex">
              <span className="keycap">SPAZIO</span>
              <span>pausa / riprendi</span>
              <span className="keycap ml-4">R</span>
              <span>riavvia</span>
              <span className="keycap ml-4">M</span>
              <span>audio</span>
            </div>
            <p className="text-center font-body text-[11px] text-pine-300 md:hidden">
              Scorri sul tabellone per guidare il serpente, oppure usa il pad qui sotto.
            </p>
          </section>

          {/* controlli touch (mobile) */}
          <div className="flex flex-col gap-4 md:hidden">
            <TouchPad
              status={hud.status}
              onDir={(x, y) => game.queueDir({ x, y })}
              onCenter={game.primaryAction}
            />
            <div className="panel p-4">
              <p className="font-body text-[11px] font-semibold uppercase tracking-[0.24em] text-pine-300">
                Difficoltà
              </p>
              <div className="mt-3">
                <DifficultyPicker value={game.difficultyId} onChange={game.setDifficulty} />
              </div>
            </div>
          </div>

          <SidePanel
            hud={hud}
            def={def}
            onDifficulty={game.setDifficulty}
            onPrimary={game.primaryAction}
            onRestart={game.restart}
          />
        </main>

        <Ticker />
      </div>

      {/* strati CRT */}
      <div className="vignette pointer-events-none fixed inset-0 z-30" />
      <div className="scanlines pointer-events-none fixed inset-0 z-40 opacity-70" />
    </div>
  );
}
