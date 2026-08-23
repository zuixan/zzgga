import { useEffect, useRef, useState } from "react";
import type { TouchEvent as ReactTouchEvent } from "react";
import type {
  DifficultyDef,
  DifficultyId,
  GameState,
  Status,
  Vec,
} from "./types";
import {
  APPLE_POINTS,
  BONUS_EVERY,
  BONUS_POINTS,
  DIFFICULTIES,
  MAX_SPEED_LEVEL,
  SPEED_GAIN,
  SPEED_STEP,
} from "./types";
import { burst, drawGame, popup, ringFx, updateFx } from "./render";
import { sfx } from "./audio";

export interface Hud {
  status: Status;
  score: number;
  best: number;
  length: number;
  apples: number;
  speedLevel: number;
  isNewRecord: boolean;
  win: boolean;
}

const REC_KEY = "snake-arcade-records-v1";
const DIFF_KEY = "snake-arcade-diff-v1";
const MUTE_KEY = "snake-arcade-muted-v1";

function loadRecords(): Partial<Record<DifficultyId, number>> {
  try {
    const raw = localStorage.getItem(REC_KEY);
    return raw ? (JSON.parse(raw) as Partial<Record<DifficultyId, number>>) : {};
  } catch {
    return {};
  }
}

function bestFor(id: DifficultyId): number {
  return loadRecords()[id] ?? 0;
}

function saveBest(id: DifficultyId, score: number): boolean {
  const recs = loadRecords();
  if (score > (recs[id] ?? 0)) {
    recs[id] = score;
    try {
      localStorage.setItem(REC_KEY, JSON.stringify(recs));
    } catch {
      /* ignore */
    }
    return true;
  }
  return false;
}

function loadDiff(): DifficultyId {
  try {
    const v = localStorage.getItem(DIFF_KEY) as DifficultyId | null;
    if (v && DIFFICULTIES.some((d) => d.id === v)) return v;
  } catch {
    /* ignore */
  }
  return "normale";
}

function loadMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

function freeCells(g: GameState, extra: Vec[] = []): Vec[] {
  const occ = new Set<number>();
  for (const s of g.snake) occ.add(s.y * g.grid + s.x);
  occ.add(g.food.y * g.grid + g.food.x);
  for (const e of extra) occ.add(e.y * g.grid + e.x);
  const out: Vec[] = [];
  for (let y = 0; y < g.grid; y++) {
    for (let x = 0; x < g.grid; x++) {
      if (!occ.has(y * g.grid + x)) out.push({ x, y });
    }
  }
  return out;
}

function placeFood(g: GameState): boolean {
  const free = freeCells(g, g.bonus ? [g.bonus] : []);
  if (free.length === 0) return false;
  g.food = free[(Math.random() * free.length) | 0];
  ringFx(g, g.food.x + 0.5, g.food.y + 0.5, "rgba(255,107,107,0.7)");
  return true;
}

function createInitial(def: DifficultyDef): GameState {
  const c = Math.floor(def.grid / 2);
  const snake: Vec[] = [
    { x: c, y: c },
    { x: c - 1, y: c },
    { x: c - 2, y: c },
  ];
  const g: GameState = {
    status: "idle",
    win: false,
    grid: def.grid,
    baseInterval: def.interval,
    interval: def.interval,
    snake,
    prevSnake: snake.map((s) => ({ ...s })),
    dir: { x: 1, y: 0 },
    queue: [],
    food: { x: c + 3, y: c },
    bonus: null,
    bonusTtl: 0,
    bonusTtlMax: 1,
    score: 0,
    apples: 0,
    speedLevel: 0,
    acc: 0,
    shake: 0,
    flash: 0,
    particles: [],
    popups: [],
  };
  placeFood(g);
  g.particles = [];
  return g;
}

const KEY_DIRS: Record<string, Vec> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  W: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  S: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  A: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
  D: { x: 1, y: 0 },
};

export function useSnake() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef({ px: 320 });

  const [difficultyId, setDifficultyId] = useState<DifficultyId>(() => loadDiff());
  const diffRef = useRef(difficultyId);
  const def = DIFFICULTIES.find((d) => d.id === difficultyId) ?? DIFFICULTIES[1];

  const [muted, setMuted] = useState<boolean>(() => loadMuted());
  const mutedRef = useRef(muted);

  const gRef = useRef<GameState>(createInitial(def));
  const [hud, setHud] = useState<Hud>(() => ({
    status: "idle",
    score: 0,
    best: bestFor(difficultyId),
    length: 3,
    apples: 0,
    speedLevel: 0,
    isNewRecord: false,
    win: false,
  }));

  const syncHud = (over?: Partial<Hud>) => {
    const g = gRef.current;
    setHud((prev) => ({
      status: g.status,
      score: g.score,
      best: bestFor(diffRef.current),
      length: g.snake.length,
      apples: g.apples,
      speedLevel: g.speedLevel,
      isNewRecord: prev.isNewRecord,
      win: g.win,
      ...over,
    }));
  };

  /* ---------- transizioni di stato ---------- */

  const start = () => {
    const g = gRef.current;
    if (g.status === "running") return;
    g.status = "running";
    g.acc = 0;
    sfx.start();
    syncHud();
  };

  const pause = () => {
    const g = gRef.current;
    if (g.status !== "running") return;
    g.status = "paused";
    sfx.pause();
    syncHud();
  };

  const resume = () => {
    const g = gRef.current;
    if (g.status !== "paused") return;
    g.status = "running";
    g.acc = 0;
    sfx.resume();
    syncHud();
  };

  const resetGame = () => {
    gRef.current = createInitial(
      DIFFICULTIES.find((d) => d.id === diffRef.current) ?? DIFFICULTIES[1]
    );
    syncHud({ isNewRecord: false });
  };

  const restart = () => {
    resetGame();
    start();
  };

  const primaryAction = () => {
    switch (gRef.current.status) {
      case "idle":
        start();
        break;
      case "running":
        pause();
        break;
      case "paused":
        resume();
        break;
      case "over":
        restart();
        break;
    }
  };

  const toggleMute = () => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    sfx.setMuted(next);
    try {
      localStorage.setItem(MUTE_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  };

  const setDifficulty = (id: DifficultyId) => {
    if (id === diffRef.current) return;
    diffRef.current = id;
    setDifficultyId(id);
    try {
      localStorage.setItem(DIFF_KEY, id);
    } catch {
      /* ignore */
    }
    resetGame();
  };

  /* ---------- logica di gioco ---------- */

  const queueDir = (d: Vec) => {
    const g = gRef.current;
    if (g.status === "over") return;
    if (g.status === "idle") start();
    const last = g.queue.length > 0 ? g.queue[g.queue.length - 1] : g.dir;
    if (d.x === -last.x && d.y === -last.y) return; // niente inversione a U
    if (d.x === last.x && d.y === last.y) return;
    if (g.queue.length < 3) g.queue.push(d);
  };

  const die = (g: GameState, win: boolean) => {
    g.status = "over";
    g.win = win;
    g.acc = g.interval; // ferma l'interpolazione a fine passo
    const h = g.snake[0];
    if (win) {
      sfx.bonus();
      burst(g, h.x + 0.5, h.y + 0.5, "#ffd24a", 26);
      burst(g, h.x + 0.5, h.y + 0.5, "#a3e635", 18);
    } else {
      g.flash = 1;
      g.shake = 16;
      sfx.die();
      burst(g, h.x + 0.5, h.y + 0.5, "#ff6b6b", 18);
      burst(g, h.x + 0.5, h.y + 0.5, "#f4ffe8", 8);
    }
    const newRec = saveBest(diffRef.current, g.score);
    syncHud({ isNewRecord: newRec });
  };

  const step = (g: GameState) => {
    // direzione dalla coda di input
    while (g.queue.length > 0) {
      const d = g.queue.shift()!;
      if (!(d.x === -g.dir.x && d.y === -g.dir.y) && !(d.x === g.dir.x && d.y === g.dir.y)) {
        g.dir = d;
        break;
      }
    }

    // stella in scadenza
    if (g.bonus && --g.bonusTtl <= 0) g.bonus = null;

    const head = { x: g.snake[0].x + g.dir.x, y: g.snake[0].y + g.dir.y };

    // muri
    if (head.x < 0 || head.y < 0 || head.x >= g.grid || head.y >= g.grid) {
      die(g, false);
      return;
    }

    const willEat = head.x === g.food.x && head.y === g.food.y;
    const willBonus = g.bonus !== null && head.x === g.bonus.x && head.y === g.bonus.y;
    const keepTail = willEat || willBonus;
    const limit = keepTail ? g.snake.length : g.snake.length - 1;
    for (let i = 0; i < limit; i++) {
      if (g.snake[i].x === head.x && g.snake[i].y === head.y) {
        die(g, false);
        return;
      }
    }

    g.prevSnake = g.snake.map((s) => ({ ...s }));
    g.snake.unshift(head);
    if (!keepTail) g.snake.pop();

    if (willEat) {
      g.score += APPLE_POINTS;
      g.apples += 1;
      burst(g, head.x + 0.5, head.y + 0.5, "#c9f76f", 10);
      ringFx(g, head.x + 0.5, head.y + 0.5, "rgba(201,247,111,0.9)");
      popup(g, head.x + 0.5, head.y + 0.5, `+${APPLE_POINTS}`, "#c9f76f");
      sfx.eat();

      g.speedLevel = Math.min(MAX_SPEED_LEVEL, Math.floor(g.apples / SPEED_STEP));
      g.interval = g.baseInterval * (1 - SPEED_GAIN * g.speedLevel);

      if (!placeFood(g)) {
        die(g, true); // tabellone pieno: vittoria!
        return;
      }

      if (g.apples % BONUS_EVERY === 0 && !g.bonus) {
        const free = freeCells(g);
        if (free.length > 0) {
          g.bonus = free[(Math.random() * free.length) | 0];
          const ttl = Math.round(6500 / g.interval);
          g.bonusTtl = ttl;
          g.bonusTtlMax = ttl;
          ringFx(g, g.bonus.x + 0.5, g.bonus.y + 0.5, "rgba(255,201,60,0.85)");
        }
      }

      if (g.snake.length >= g.grid * g.grid) {
        die(g, true);
        return;
      }
      syncHud();
    } else if (willBonus) {
      g.score += BONUS_POINTS;
      g.bonus = null;
      burst(g, head.x + 0.5, head.y + 0.5, "#ffd24a", 18);
      ringFx(g, head.x + 0.5, head.y + 0.5, "rgba(255,210,74,0.95)");
      popup(g, head.x + 0.5, head.y + 0.5, `+${BONUS_POINTS}`, "#ffd24a");
      sfx.bonus();
      syncHud();
    }
  };

  /* ---------- loop + resize ---------- */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      let dt = (now - last) / 1000;
      last = now;
      if (dt > 0.1) dt = 0.1;
      const g = gRef.current;
      if (g.status === "running") {
        g.acc += dt * 1000;
        while (g.acc >= g.interval && g.status === "running") {
          g.acc -= g.interval;
          step(g);
        }
      }
      updateFx(g, dt);
      drawGame(ctx, g, viewRef.current.px, now);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const board = boardRef.current;
    const canvas = canvasRef.current;
    if (!board || !canvas) return;
    const ro = new ResizeObserver(() => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const px = Math.max(120, Math.floor(Math.min(board.clientWidth, board.clientHeight)));
      canvas.width = Math.round(px * dpr);
      canvas.height = Math.round(px * dpr);
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      viewRef.current.px = px;
    });
    ro.observe(board);
    return () => ro.disconnect();
  }, []);

  /* ---------- tastiera + visibilità ---------- */

  useEffect(() => {
    sfx.setMuted(mutedRef.current);
    const onKey = (e: KeyboardEvent) => {
      const dir = KEY_DIRS[e.key];
      if (dir) {
        e.preventDefault();
        queueDir(dir);
        return;
      }
      if (e.key === " ") {
        e.preventDefault();
        primaryAction();
        return;
      }
      if (e.key === "Enter" || e.key === "r" || e.key === "R") {
        e.preventDefault();
        restart();
        return;
      }
      if (e.key === "m" || e.key === "M") {
        toggleMute();
        return;
      }
      if (e.key === "p" || e.key === "P") {
        const s = gRef.current.status;
        if (s === "running") pause();
        else if (s === "paused") resume();
      }
    };
    const onVis = () => {
      if (document.hidden && gRef.current.status === "running") pause();
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- touch (swipe sul tabellone) ---------- */

  const touchRef = useRef<{ x: number; y: number; t: number; moved: boolean } | null>(null);
  const lastTouchAt = useRef(0);

  // azione dai click sulle overlay: ignora i "ghost click" sintetizzati
  // subito dopo un tap touch (evita avvia→pausa istantaneo)
  const overlayAction = () => {
    if (performance.now() - lastTouchAt.current < 700) return;
    primaryAction();
  };

  const onTouchStart = (e: ReactTouchEvent) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY, t: performance.now(), moved: false };
  };

  const onTouchMove = (e: ReactTouchEvent) => {
    const s = touchRef.current;
    if (!s) return;
    const t = e.touches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    const ax = Math.abs(dx);
    const ay = Math.abs(dy);
    if (Math.max(ax, ay) > 24) {
      s.moved = true;
      queueDir(ax > ay ? { x: Math.sign(dx), y: 0 } : { x: 0, y: Math.sign(dy) });
      s.x = t.clientX;
      s.y = t.clientY;
    }
  };

  const onTouchEnd = () => {
    const s = touchRef.current;
    touchRef.current = null;
    if (s && !s.moved && performance.now() - s.t < 400) {
      lastTouchAt.current = performance.now();
      primaryAction();
    }
  };

  return {
    canvasRef,
    boardRef,
    hud,
    def,
    difficultyId,
    muted,
    setDifficulty,
    toggleMute,
    queueDir,
    primaryAction,
    overlayAction,
    restart,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
}
