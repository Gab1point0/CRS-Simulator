// Musique et bruitages générés en direct avec la Web Audio API (aucun fichier son).
window.CRSAudio = (() => {
  let ctx, master, musicBus, sfxBus, noiseBuf, ambience;
  let muted = false;
  try { muted = localStorage.getItem("crs-muted") === "1"; } catch (e) {}

  function init() {
    if (ctx) { if (ctx.state === "suspended") ctx.resume(); return; }
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) { return; }
    const comp = ctx.createDynamicsCompressor();
    comp.connect(ctx.destination);
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.9;
    master.connect(comp);
    musicBus = ctx.createGain(); musicBus.gain.value = 0.45; musicBus.connect(master);
    sfxBus = ctx.createGain(); sfxBus.gain.value = 1; sfxBus.connect(master);

    // 2 s de bruit blanc réutilisable
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }

  const now = () => ctx.currentTime;
  const midi = n => 440 * Math.pow(2, (n - 69) / 12);

  // ---- Briques de base ----
  function tone({ freq, type = "square", t = now(), dur = .1, vol = .1, to, bus = sfxBus, attack = .005, filter }) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    let out = g;
    o.connect(g);
    if (filter) {
      const f = ctx.createBiquadFilter();
      f.type = "lowpass"; f.frequency.value = filter;
      g.connect(f); out = f;
    }
    out.connect(bus);
    o.start(t); o.stop(t + dur + .02);
    return o;
  }

  function noise({ t = now(), dur = .1, vol = .2, type = "bandpass", freq = 1000, to, q = 1, bus = sfxBus }) {
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noiseBuf;
    f.type = type; f.Q.value = q;
    f.frequency.setValueAtTime(freq, t);
    if (to) f.frequency.exponentialRampToValueAtTime(to, t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(bus);
    s.start(t, Math.random()); s.stop(t + dur + .02);
  }

  // Sifflet à roulette (trille rapide)
  function whistle(t, dur, vol = .08, freq = 2700) {
    const o = ctx.createOscillator(), lfo = ctx.createOscillator(), depth = ctx.createGain(), g = ctx.createGain();
    o.type = "sine"; o.frequency.value = freq;
    lfo.frequency.value = 28; depth.gain.value = freq * .07;
    lfo.connect(depth); depth.connect(o.frequency);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + .02);
    g.gain.setValueAtTime(vol, t + dur - .04);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(sfxBus);
    o.start(t); lfo.start(t); o.stop(t + dur + .02); lfo.stop(t + dur + .02);
  }

  // ---- Bruitages ----
  const sfx = {
    // Coup de matraque : impact sourd + claque
    hit() {
      if (!ctx) return;
      const t = now();
      tone({ freq: 180, to: 45, type: "sine", t, dur: .16, vol: .6 });
      noise({ t, dur: .09, vol: .5, freq: 1600, q: .8 });
      noise({ t: t + .01, dur: .05, vol: .25, type: "highpass", freq: 4000 });
    },
    // Petit "ding" de points en plus
    points(big) {
      if (!ctx) return;
      const t = now() + .05;
      tone({ freq: big ? 988 : 784, t, dur: .08, vol: .07 });
      tone({ freq: big ? 1319 : 1175, t: t + .07, dur: .12, vol: .07 });
    },
    // Lycéen : petit cri aigu "aïe !"
    squeak() {
      if (!ctx) return;
      tone({ freq: 900, to: 1500, type: "triangle", t: now() + .03, dur: .12, vol: .12 });
    },
    // Bavure : trombone triste "wah wah wah waaah"
    fail() {
      if (!ctx) return;
      const t = now();
      [[311, .18], [294, .18], [277, .18], [262, .55]].reduce((acc, [f, d]) => {
        tone({ freq: f, to: f * .97, type: "sawtooth", t: acc, dur: d, vol: .12, attack: .03, filter: 1200 });
        return acc + d + .02;
      }, t);
    },
    // Journaliste : flash d'appareil photo + "ohhh" de la foule
    camera() {
      if (!ctx) return;
      const t = now();
      noise({ t, dur: .04, vol: .4, type: "highpass", freq: 3000 });
      noise({ t: t + .06, dur: .05, vol: .3, type: "highpass", freq: 2500 });
      tone({ freq: 2200, to: 5000, type: "sine", t: t + .1, dur: .25, vol: .03 });
    },
    // Collègue en civil : coup de sifflet réglementaire
    whistle() { if (ctx) whistle(now(), .45, .07); },
    // Mamie : "ouuuh" qui descend
    oldLady() {
      if (!ctx) return;
      const t = now();
      const o = tone({ freq: 700, to: 380, type: "triangle", t, dur: .45, vol: .12, attack: .03 });
      const lfo = ctx.createOscillator(), dg = ctx.createGain();
      lfo.frequency.value = 9; dg.gain.value = 25;
      lfo.connect(dg); dg.connect(o.frequency);
      lfo.start(t); lfo.stop(t + .5);
    },
    // Clic dans le vide : coup de matraque qui fend l'air
    whoosh() {
      if (!ctx) return;
      noise({ dur: .13, vol: .12, freq: 600, to: 3000, q: 2 });
    },
    // Combo qui monte : arpège ascendant
    comboUp(level) {
      if (!ctx) return;
      const t = now();
      [0, 4, 7, 12].forEach((n, i) => tone({ freq: midi(72 + level * 2 + n), type: "square", t: t + i * .05, dur: .1, vol: .06, filter: 4000 }));
    },
    // Combo perdu
    comboLost() {
      if (!ctx) return;
      tone({ freq: 500, to: 150, type: "square", dur: .25, vol: .05, filter: 2000 });
    },
    // Jauge IGPN dans le rouge
    alarm() {
      if (!ctx) return;
      const t = now();
      for (let i = 0; i < 4; i++) tone({ freq: i % 2 ? 660 : 880, type: "square", t: t + i * .12, dur: .1, vol: .06, filter: 3000 });
    },
    // Renforts : mini-sirène + jingle
    bonus() {
      if (!ctx) return;
      const t = now();
      tone({ freq: 435, type: "square", t, dur: .2, vol: .06, filter: 1800 });
      tone({ freq: 488, type: "square", t: t + .2, dur: .2, vol: .06, filter: 1800 });
      [67, 72, 76, 79].forEach((n, i) => tone({ freq: midi(n), type: "triangle", t: t + .4 + i * .07, dur: .15, vol: .1 }));
    },
    // Grosse charge : la foule gronde
    charge() {
      if (!ctx) return;
      const t = now(), s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      s.buffer = noiseBuf; f.type = "bandpass"; f.frequency.value = 500; f.Q.value = .5;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(.35, t + .4);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
      s.connect(f); f.connect(g); g.connect(sfxBus);
      s.start(t); s.stop(t + 1.7);
      whistle(t + .1, .3, .05); whistle(t + .5, .5, .05, 2500);
    },
    // Sonnette de vélo "dring dring"
    bell() {
      if (!ctx) return;
      const t = now();
      [0, .14].forEach(d => { tone({ freq: 2100, type: "sine", t: t + d, dur: .25, vol: .08 }); tone({ freq: 2650, type: "sine", t: t + d, dur: .2, vol: .05 }); });
    },
    // Sonnerie du lycée
    schoolBell() {
      if (!ctx) return;
      const t = now(), o = ctx.createOscillator(), g = ctx.createGain(), lfo = ctx.createOscillator(), lg = ctx.createGain();
      o.type = "square"; o.frequency.value = 1150;
      lfo.type = "square"; lfo.frequency.value = 22; lg.gain.value = .03;
      g.gain.value = .03; lfo.connect(lg); lg.connect(g.gain);
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 3000;
      o.connect(g); g.connect(f); f.connect(sfxBus);
      o.start(t); lfo.start(t); o.stop(t + .5); lfo.stop(t + .5);
    },
    // La daronne débarque : roulement de tambour + gros boum
    bossIn() {
      if (!ctx) return;
      const t = now();
      for (let i = 0; i < 12; i++) noise({ t: t + i * .05, dur: .05, vol: .2 + i * .02, freq: 1500, q: .8 });
      tone({ freq: 110, to: 30, type: "sine", t: t + .65, dur: .6, vol: .9 });
      tone({ freq: 220, to: 55, type: "sawtooth", t: t + .65, dur: .5, vol: .15, filter: 800 });
    },
    // Coup sur la daronne : impact dont la hauteur varie
    bossHit(n) {
      if (!ctx) return;
      const t = now(), f = 160 + (n % 8) * 18;
      tone({ freq: f, to: f / 3, type: "sine", t, dur: .12, vol: .5 });
      noise({ t, dur: .06, vol: .35, freq: 1200 + (n % 5) * 300, q: 1 });
    },
    // K.O. : fanfare
    bossKo() {
      if (!ctx) return;
      const t = now();
      [60, 64, 67, 72, 67, 72, 76, 79].forEach((n, i) => tone({ freq: midi(n), type: "square", t: t + i * .1, dur: i === 7 ? .6 : .12, vol: .08, filter: 3500 }));
      tone({ freq: 80, to: 30, type: "sine", t, dur: .5, vol: .8 });
    },
    // Elle repart : "pfff"
    bossOut() {
      if (!ctx) return;
      noise({ dur: .5, vol: .2, freq: 900, to: 300, q: 1.5 });
    },
    // Apparition discrète
    pop() {
      if (!ctx) return;
      tone({ freq: 300, to: 600, type: "sine", dur: .06, vol: .04 });
    },
    // Tic-tac des 5 dernières secondes
    tick(last) {
      if (!ctx) return;
      tone({ freq: last ? 1320 : 1000, type: "square", dur: .06, vol: .06 });
    },
    // Sirène deux-tons "pin-pon"
    siren() {
      if (!ctx) return;
      const t = now();
      for (let i = 0; i < 4; i++) {
        tone({ freq: i % 2 ? 488 : 435, type: "square", t: t + i * .42, dur: .42, vol: .07, attack: .02, filter: 1800 });
      }
    },
    // Fin de partie : trois coups de sifflet + petit jingle
    end(good) {
      if (!ctx) return;
      const t = now();
      whistle(t, .2, .08); whistle(t + .28, .2, .08); whistle(t + .56, .55, .08);
      const notes = good ? [72, 76, 79, 84] : [67, 66, 65, 64];
      notes.forEach((n, i) => tone({ freq: midi(n), type: "square", t: t + 1.3 + i * .16, dur: i === 3 ? .5 : .15, vol: .07, filter: 3000 }));
    },
  };

  // ---- Musique de fond (séquenceur) ----
  // Une grille par niveau. Mélodie : index dans [fondamentale, tierce, quinte, octave], -1 = silence
  const THEMES = [
    { // Manif du 1er mai : marche en Lam – Fa – Do – Sol
      bpm: 132,
      chords: [{ root: 45, third: 3 }, { root: 41, third: 4 }, { root: 48, third: 4 }, { root: 43, third: 4 }],
      leads: [
        [3, -1, 2, -1, 1, -1, 2, 3, -1, 2, -1, 1, 0, -1, 1, -1],
        [0, -1, 1, 2, -1, 2, 3, -1, 2, -1, 1, -1, 2, -1, -1, -1],
      ],
    },
    { // Blocus du lycée : punk rapide en Mim – Do – Sol – Ré
      bpm: 152,
      chords: [{ root: 40, third: 3 }, { root: 48, third: 4 }, { root: 43, third: 4 }, { root: 50, third: 4 }],
      leads: [
        [0, 0, -1, 2, -1, 2, 3, -1, 2, 2, -1, 1, -1, 1, 0, -1],
        [3, -1, 3, 2, -1, 1, 2, -1, 0, -1, 0, 1, -1, 2, -1, -1],
      ],
    },
    { // Finale de Coupe du monde : chant de stade en Do – Sol – Lam – Fa
      bpm: 124,
      chords: [{ root: 48, third: 4 }, { root: 43, third: 4 }, { root: 45, third: 3 }, { root: 41, third: 4 }],
      leads: [
        [0, -1, 0, -1, 0, -1, 1, -1, 2, -1, -1, -1, 1, -1, -1, -1],
        [3, -1, 2, -1, 1, -1, 2, -1, 0, -1, -1, -1, -1, -1, -1, -1],
      ],
    },
  ];
  let theme = THEMES[0], bpm = 132, step = 0, nextTime = 0, seqTimer = null;

  function scheduleStep(s, t) {
    const sixteenth = 60 / bpm / 4;
    const bar = Math.floor(s / 16) % 4, pos = s % 16;
    const ch = theme.chords[bar];
    const tones = [0, ch.third, 7, 12];

    // Batterie
    if (pos % 4 === 0) tone({ freq: 140, to: 40, type: "sine", t, dur: .14, vol: .7, bus: musicBus });
    if (pos === 4 || pos === 12) noise({ t, dur: .12, vol: .35, freq: 1800, q: .7, bus: musicBus });
    if (pos % 2 === 0) noise({ t, dur: .03, vol: .12, type: "highpass", freq: 7000, bus: musicBus });

    // Basse en croches
    if (pos % 2 === 0) {
      const n = ch.root + (pos % 8 === 6 ? 12 : 0);
      tone({ freq: midi(n), type: "sawtooth", t, dur: sixteenth * 1.8, vol: .22, filter: 700, bus: musicBus });
    }

    // Mélodie
    const idx = theme.leads[Math.floor(s / 32) % 2][pos];
    if (idx >= 0) {
      tone({ freq: midi(ch.root + 24 + tones[idx]), type: "square", t, dur: sixteenth * 1.6, vol: .07, filter: 2600, bus: musicBus });
    }
  }

  function scheduler() {
    while (nextTime < ctx.currentTime + .12) {
      scheduleStep(step, nextTime);
      nextTime += 60 / bpm / 4;
      step++;
    }
  }

  // Ambiance : brouhaha de foule + sifflets lointains + grenades lacrymo
  function startAmbience() {
    const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    src.buffer = noiseBuf; src.loop = true;
    f.type = "bandpass"; f.frequency.value = 450; f.Q.value = .6;
    g.gain.value = .05;
    const lfo = ctx.createOscillator(), lg = ctx.createGain();
    lfo.frequency.value = .3; lg.gain.value = .025;
    lfo.connect(lg); lg.connect(g.gain);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(); lfo.start();
    const timer = setInterval(() => {
      const t = now();
      if (Math.random() < .5) whistle(t, .2 + Math.random() * .4, .015, 2400 + Math.random() * 800);
      if (Math.random() < .12) {
        tone({ freq: 90, to: 35, type: "sine", t, dur: .35, vol: .25 });
        noise({ t: t + .15, dur: 1.2, vol: .06, type: "lowpass", freq: 3000, to: 500 });
      }
    }, 1200);
    ambience = { src, lfo, timer };
  }

  function startMusic(themeIdx = 0) {
    if (!ctx || seqTimer) return;
    theme = THEMES[themeIdx] || THEMES[0];
    bpm = theme.bpm; step = 0; nextTime = ctx.currentTime + 1.8; // laisse passer la sirène
    seqTimer = setInterval(scheduler, 25);
    startAmbience();
  }

  function stopMusic() {
    clearInterval(seqTimer); seqTimer = null;
    if (ambience) {
      clearInterval(ambience.timer);
      try { ambience.src.stop(); ambience.lfo.stop(); } catch (e) {}
      ambience = null;
    }
  }

  // 0 -> 1 : la musique accélère au fil de la partie
  function setIntensity(x) { bpm = theme.bpm + 38 * x; }

  function toggleMute() {
    muted = !muted;
    try { localStorage.setItem("crs-muted", muted ? "1" : "0"); } catch (e) {}
    if (master) master.gain.setTargetAtTime(muted ? 0 : .9, ctx.currentTime, .05);
    return muted;
  }

  return { init, sfx, startMusic, stopMusic, setIntensity, toggleMute, isMuted: () => muted };
})();
