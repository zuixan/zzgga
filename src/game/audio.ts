let ctx: AudioContext | null = null;
let muted = false;

function ensure(): AudioContext | null {
  try {
    if (!ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(
  freq: number,
  end: number,
  dur: number,
  type: OscillatorType,
  vol: number,
  delay = 0
) {
  if (muted) return;
  const ac = ensure();
  if (!ac) return;
  try {
    const t0 = ac.currentTime + delay;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(30, freq), t0);
    osc.frequency.exponentialRampToValueAtTime(Math.max(30, end), t0 + dur);
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.03);
  } catch {
    /* audio mai bloccante */
  }
}

export const sfx = {
  setMuted(m: boolean) {
    muted = m;
  },
  eat() {
    tone(520, 780, 0.09, "square", 0.11);
    tone(1040, 1320, 0.06, "square", 0.045, 0.02);
  },
  bonus() {
    tone(660, 662, 0.08, "triangle", 0.13);
    tone(880, 882, 0.08, "triangle", 0.13, 0.07);
    tone(1320, 1322, 0.14, "triangle", 0.13, 0.14);
  },
  die() {
    tone(320, 52, 0.5, "sawtooth", 0.15);
    tone(180, 40, 0.62, "square", 0.07, 0.05);
  },
  start() {
    tone(392, 393, 0.07, "square", 0.09);
    tone(523, 524, 0.07, "square", 0.09, 0.08);
    tone(659, 660, 0.11, "square", 0.09, 0.16);
  },
  pause() {
    tone(440, 330, 0.12, "square", 0.07);
  },
  resume() {
    tone(330, 442, 0.12, "square", 0.07);
  },
};
