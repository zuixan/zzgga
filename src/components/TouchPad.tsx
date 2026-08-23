import type { Status } from "../game/types";
import { Chevron, IconPause, IconPlay } from "./icons";

interface Props {
  status: Status;
  onDir: (x: number, y: number) => void;
  onCenter: () => void;
}

const BTN =
  "btn-pixel flex aspect-square touch-none select-none items-center justify-center";

export function TouchPad({ status, onDir, onCenter }: Props) {
  return (
    <div
      className="mx-auto grid w-56 grid-cols-3 gap-2"
      onContextMenu={(e) => e.preventDefault()}
      aria-label="Controlli touch"
    >
      <span />
      <button className={BTN} onClick={() => onDir(0, -1)} aria-label="Su">
        <Chevron dir="up" className="h-6 w-6" />
      </button>
      <span />
      <button className={BTN} onClick={() => onDir(-1, 0)} aria-label="Sinistra">
        <Chevron dir="left" className="h-6 w-6" />
      </button>
      <button
        className={`${BTN} ${status === "running" ? "btn-gold" : "btn-lime"}`}
        onClick={onCenter}
        aria-label={status === "running" ? "Pausa" : "Gioca"}
      >
        {status === "running" ? (
          <IconPause className="h-5 w-5" />
        ) : (
          <IconPlay className="h-5 w-5" />
        )}
      </button>
      <button className={BTN} onClick={() => onDir(1, 0)} aria-label="Destra">
        <Chevron dir="right" className="h-6 w-6" />
      </button>
      <span />
      <button className={BTN} onClick={() => onDir(0, 1)} aria-label="Giù">
        <Chevron dir="down" className="h-6 w-6" />
      </button>
      <span />
    </div>
  );
}
