import type { GameState } from "./types";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function circle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function star4(ctx: CanvasRenderingContext2D, outer: number, inner: number) {
  const spikes = 4;
  const step = Math.PI / spikes;
  let rot = -Math.PI / 2;
  ctx.beginPath();
  ctx.moveTo(Math.cos(rot) * outer, Math.sin(rot) * outer);
  for (let i = 0; i < spikes; i++) {
    rot += step;
    ctx.lineTo(Math.cos(rot) * inner, Math.sin(rot) * inner);
    rot += step;
    ctx.lineTo(Math.cos(rot) * outer, Math.sin(rot) * outer);
  }
  ctx.closePath();
}

/* ---------- effetti: aggiornamento ---------- */

export function updateFx(g: GameState, dt: number) {
  if (g.shake > 0) g.shake = Math.max(0, g.shake - dt * 34);
  if (g.flash > 0) g.flash = Math.max(0, g.flash - dt * 1.7);

  for (let i = g.particles.length - 1; i >= 0; i--) {
    const p = g.particles[i];
    p.life -= dt;
    if (p.life <= 0) {
      g.particles.splice(i, 1);
      continue;
    }
    if (p.kind === "dot") {
      p.vy += p.grav * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    } else {
      p.size += p.grow * dt;
    }
  }
  for (let i = g.popups.length - 1; i >= 0; i--) {
    const p = g.popups[i];
    p.life -= dt;
    p.y -= 1.15 * dt;
    if (p.life <= 0) g.popups.splice(i, 1);
  }
}

export function burst(g: GameState, x: number, y: number, color: string, count: number) {
  for (let i = 0; i < count; i++) {
    const ang = Math.random() * Math.PI * 2;
    const sp = 1.5 + Math.random() * 5;
    g.particles.push({
      x,
      y,
      vx: Math.cos(ang) * sp,
      vy: Math.sin(ang) * sp - 1.2,
      life: 0.5 + Math.random() * 0.4,
      max: 0.9,
      size: 0.08 + Math.random() * 0.11,
      color,
      grav: 7,
      kind: "dot",
      grow: 0,
    });
  }
  if (g.particles.length > 240) g.particles.splice(0, g.particles.length - 240);
}

export function ringFx(g: GameState, x: number, y: number, color: string) {
  g.particles.push({ x, y, vx: 0, vy: 0, life: 0.45, max: 0.45, size: 0.22, color, grav: 0, kind: "ring", grow: 3.4 });
}

export function popup(g: GameState, x: number, y: number, text: string, color: string) {
  g.popups.push({ x, y: y - 0.25, text, color, life: 0.95, max: 0.95 });
}

/* ---------- scena ---------- */

export function drawGame(
  ctx: CanvasRenderingContext2D,
  g: GameState,
  px: number,
  time: number
) {
  const grid = g.grid;
  const cell = px / grid;

  // sfondo scacchiera
  ctx.fillStyle = "#0b1d14";
  ctx.fillRect(0, 0, px, px);
  ctx.fillStyle = "rgba(255,255,255,0.022)";
  for (let y = 0; y < grid; y++) {
    for (let x = y % 2; x < grid; x += 2) {
      ctx.fillRect(x * cell, y * cell, cell, cell);
    }
  }
  ctx.strokeStyle = "rgba(143,240,192,0.05)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 1; i < grid; i++) {
    ctx.moveTo(i * cell, 0);
    ctx.lineTo(i * cell, px);
    ctx.moveTo(0, i * cell);
    ctx.lineTo(px, i * cell);
  }
  ctx.stroke();

  ctx.save();
  if (g.shake > 0) {
    const s = g.shake * 0.55;
    ctx.translate((Math.random() - 0.5) * s, (Math.random() - 0.5) * s);
  }

  const t = g.status === "running" ? Math.min(1, g.acc / g.interval) : 1;

  // ---- mela ----
  const fx = (g.food.x + 0.5) * cell;
  const fy = (g.food.y + 0.5) * cell;
  const pulse = 1 + 0.08 * Math.sin(time * 0.006);
  const fr = cell * 0.32 * pulse;
  ctx.shadowColor = "rgba(255,107,107,0.9)";
  ctx.shadowBlur = cell * 0.55;
  const grad = ctx.createRadialGradient(fx - fr * 0.35, fy - fr * 0.4, fr * 0.12, fx, fy, fr);
  grad.addColorStop(0, "#ff9c8f");
  grad.addColorStop(1, "#e8404f");
  ctx.fillStyle = grad;
  circle(ctx, fx, fy, fr);
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "#8b5a2b";
  ctx.lineWidth = Math.max(1.5, cell * 0.07);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(fx, fy - fr * 0.85);
  ctx.lineTo(fx + cell * 0.07, fy - fr * 1.35);
  ctx.stroke();
  ctx.fillStyle = "#4ade80";
  ctx.beginPath();
  ctx.ellipse(fx + cell * 0.17, fy - fr * 1.12, cell * 0.15, cell * 0.07, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  circle(ctx, fx - fr * 0.35, fy - fr * 0.42, fr * 0.16);

  // ---- stella bonus ----
  if (g.bonus) {
    const bx = (g.bonus.x + 0.5) * cell;
    const by = (g.bonus.y + 0.5) * cell;
    const frac = Math.max(0.02, g.bonusTtl / g.bonusTtlMax);
    const low = frac < 0.25;
    const alpha = low ? 0.4 + 0.6 * Math.abs(Math.sin(time * 0.012)) : 1;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(bx, by);
    ctx.rotate(time * 0.0022);
    ctx.shadowColor = "rgba(255,201,60,0.95)";
    ctx.shadowBlur = cell * 0.7;
    ctx.fillStyle = "#ffd24a";
    star4(ctx, cell * 0.36, cell * 0.16);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#fff3c4";
    circle(ctx, 0, 0, cell * 0.07);
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = alpha * 0.9;
    ctx.strokeStyle = "#ffc93c";
    ctx.lineWidth = Math.max(2, cell * 0.07);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(bx, by, cell * 0.58, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac);
    ctx.stroke();
    ctx.restore();
  }

  // ---- serpente (coda → testa) ----
  const n = g.snake.length;
  for (let i = n - 1; i >= 0; i--) {
    const cur = g.snake[i];
    const prev = g.prevSnake[i] ?? g.prevSnake[g.prevSnake.length - 1] ?? cur;
    const cx = (lerp(prev.x, cur.x, t) + 0.5) * cell;
    const cy = (lerp(prev.y, cur.y, t) + 0.5) * cell;
    const f = n === 1 ? 0 : i / (n - 1);
    const r = cell * (0.46 - 0.16 * f);

    if (i === 0) {
      ctx.shadowColor = "rgba(163,230,53,0.85)";
      ctx.shadowBlur = cell * 0.5;
      ctx.fillStyle = "#c9f76f";
    } else {
      ctx.fillStyle = `hsl(${Math.round(84 + 88 * f)}, 74%, ${Math.round(56 - 15 * f)}%)`;
    }
    circle(ctx, cx, cy, r);
    ctx.shadowBlur = 0;

    if (i === 0) {
      ctx.strokeStyle = "rgba(6,17,12,0.55)";
      ctx.lineWidth = Math.max(1, cell * 0.05);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      const d = g.dir;
      const px2 = -d.y;
      const py2 = d.x;

      // lingua ogni tanto
      if (g.status === "running" && Math.sin(time * 0.006) > 0.86) {
        ctx.strokeStyle = "#ff6b6b";
        ctx.lineWidth = Math.max(1.5, cell * 0.07);
        ctx.beginPath();
        ctx.moveTo(cx + d.x * r * 0.9, cy + d.y * r * 0.9);
        ctx.lineTo(cx + d.x * (r + cell * 0.26), cy + d.y * (r + cell * 0.26));
        ctx.stroke();
      }

      for (const s of [-1, 1]) {
        const ex = cx + d.x * cell * 0.13 + px2 * s * cell * 0.18;
        const ey = cy + d.y * cell * 0.13 + py2 * s * cell * 0.18;
        if (g.status === "over" && !g.win) {
          // occhi a X
          ctx.strokeStyle = "#0b1d14";
          ctx.lineWidth = Math.max(1.5, cell * 0.055);
          const e = cell * 0.08;
          ctx.beginPath();
          ctx.moveTo(ex - e, ey - e);
          ctx.lineTo(ex + e, ey + e);
          ctx.moveTo(ex + e, ey - e);
          ctx.lineTo(ex - e, ey + e);
          ctx.stroke();
        } else {
          ctx.fillStyle = "#f4ffe8";
          circle(ctx, ex, ey, cell * 0.115);
          ctx.fillStyle = "#0b1d14";
          circle(ctx, ex + d.x * cell * 0.045, ey + d.y * cell * 0.045, cell * 0.055);
        }
      }
    }
  }

  // ---- particelle ----
  for (const p of g.particles) {
    const a = Math.max(0, p.life / p.max);
    if (p.kind === "dot") {
      ctx.globalAlpha = a;
      ctx.fillStyle = p.color;
      circle(ctx, p.x * cell, p.y * cell, Math.max(0.6, p.size * cell * (0.4 + 0.6 * a)));
    } else {
      ctx.globalAlpha = a * 0.85;
      ctx.strokeStyle = p.color;
      ctx.lineWidth = Math.max(1.5, cell * 0.06);
      ctx.beginPath();
      ctx.arc(p.x * cell, p.y * cell, p.size * cell, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;

  // ---- popup punteggio ----
  for (const p of g.popups) {
    const a = Math.max(0, p.life / p.max);
    ctx.globalAlpha = a;
    ctx.font = `${Math.max(9, Math.round(cell * 0.46))}px "Press Start 2P", monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(2, cell * 0.14);
    ctx.strokeStyle = "rgba(5,15,11,0.8)";
    ctx.strokeText(p.text, p.x * cell, p.y * cell);
    ctx.fillStyle = p.color;
    ctx.fillText(p.text, p.x * cell, p.y * cell);
  }
  ctx.globalAlpha = 1;

  ctx.restore();

  // flash di danno
  if (g.flash > 0) {
    ctx.fillStyle = `rgba(240,76,94,${(g.flash * 0.3).toFixed(3)})`;
    ctx.fillRect(0, 0, px, px);
  }

  // cornice interna
  ctx.strokeStyle = "rgba(163,230,53,0.2)";
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, px - 2, px - 2);
}
