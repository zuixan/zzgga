export type Vec = { x: number; y: number };

export type Status = "idle" | "running" | "paused" | "over";

export type DifficultyId = "facile" | "normale" | "difficile" | "estrema";

export interface DifficultyDef {
  id: DifficultyId;
  label: string;
  grid: number;
  interval: number;
  tag: string;
  blurb: string;
}

export const DIFFICULTIES: DifficultyDef[] = [
  { id: "facile", label: "Facile", grid: 17, interval: 155, tag: "17×17", blurb: "Andatura rilassata" },
  { id: "normale", label: "Normale", grid: 19, interval: 118, tag: "19×19", blurb: "La classica" },
  { id: "difficile", label: "Difficile", grid: 21, interval: 88, tag: "21×21", blurb: "Si fa sul serio" },
  { id: "estrema", label: "Estrema", grid: 23, interval: 64, tag: "23×23", blurb: "Riflessi d'acciaio" },
];

export const APPLE_POINTS = 10;
export const BONUS_POINTS = 50;
export const BONUS_EVERY = 5; // una stella ogni N mele
export const SPEED_STEP = 4; // mele per livello di velocità
export const MAX_SPEED_LEVEL = 10;
export const SPEED_GAIN = 0.04; // 4% più rapido per livello

export interface Particle {
  x: number; // coordinate in "celle", già centrate (+0.5)
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  color: string;
  grav: number;
  kind: "dot" | "ring";
  grow: number;
}

export interface Popup {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  max: number;
}

export interface GameState {
  status: Status;
  win: boolean;
  grid: number;
  baseInterval: number;
  interval: number;
  snake: Vec[];
  prevSnake: Vec[];
  dir: Vec;
  queue: Vec[];
  food: Vec;
  bonus: Vec | null;
  bonusTtl: number;
  bonusTtlMax: number;
  score: number;
  apples: number;
  speedLevel: number;
  acc: number;
  shake: number;
  flash: number;
  particles: Particle[];
  popups: Popup[];
}
