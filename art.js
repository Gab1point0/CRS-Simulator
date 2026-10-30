// Illustrations SVG générées aléatoirement : chaque personnage est unique.
window.CRSArt = (() => {
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const chance = p => Math.random() < p;

  const SKIN = ["#f6d5bd", "#eebf98", "#d9a074", "#b97a4f", "#8d5a3b", "#5e3b25", "#f1c27d"];
  const HAIR = ["#2b1d14", "#4a2f1b", "#7a4a22", "#c99a4c", "#e7c97c", "#151515", "#a33d1f"];
  const GREY = ["#ececec", "#d4d4dc", "#f4f1e8", "#c8b8de", "#bcc8dc"];
  const JEANS = ["#3b5b8c", "#2c3e60", "#22252b", "#5a6e3a", "#6b5a45", "#4a4f8a"];
  const SHOES = ["#f2f2f2", "#222", "#c0392b", "#2d6cdf", "#7a5230"];
  const BRIGHT = ["#e74c3c", "#27ae60", "#8e44ad", "#f39c12", "#16a085", "#d35400", "#2980b9", "#c2185b", "#455a64"];
  const PASTEL = ["#f3b6c8", "#b8d8f0", "#c9e4b4", "#e8d3f2", "#f6e0a8", "#d9c2a7"];

  // ---- Coiffures ----
  function hairBack(style, c) {
    switch (style) {
      case "long": return `<rect x="33" y="20" width="34" height="36" rx="11" fill="${c}"/>`;
      case "afro": return `<circle cx="50" cy="24" r="21" fill="${c}"/>`;
      case "ponytail": return `<ellipse cx="67" cy="38" rx="5" ry="11" fill="${c}"/>`;
      case "bun": return `<circle cx="50" cy="11" r="7" fill="${c}"/>`;
      default: return "";
    }
  }
  function hairFront(style, c) {
    switch (style) {
      case "short":
      case "ponytail":
      case "bun":
        return `<path d="M35 30 Q34 13 50 13 Q66 13 65 30 Q62 21 50 20 Q38 21 35 30Z" fill="${c}"/>`;
      case "long":
        return `<path d="M35 32 Q34 13 50 13 Q66 13 65 32 Q60 22 46 21 Q39 23 35 32Z" fill="${c}"/>`;
      case "spiky":
        return `<path d="M36 26 L38 10 L43 18 L47 6 L51 17 L56 7 L58 18 L64 11 L64 26 Q57 19 50 19 Q42 19 36 26Z" fill="${c}"/>`;
      case "slick":
        return `<path d="M35 29 Q35 14 52 14 Q66 15 65 29 Q63 19 45 20 Q39 21 35 29Z" fill="${c}"/><path d="M45 15 Q47 18 46 21" stroke="rgba(255,255,255,.35)" stroke-width="1.2" fill="none"/>`;
      case "perm": {
        let s = "";
        for (let a = 195; a <= 345; a += 21) {
          const r = a * Math.PI / 180;
          s += `<circle cx="${(50 + 15 * Math.cos(r)).toFixed(1)}" cy="${(29 + 15 * Math.sin(r)).toFixed(1)}" r="5.5" fill="${c}"/>`;
        }
        return s + `<circle cx="50" cy="16" r="6" fill="${c}"/>`;
      }
      case "bald":
        return `<ellipse cx="44" cy="20" rx="4" ry="2" fill="rgba(255,255,255,.35)"/>`;
      default: return "";
    }
  }

  // ---- Chapeaux ----
  const HATS = {
    beret: c => `<ellipse cx="48" cy="17" rx="18" ry="6.5" fill="${c}"/><rect x="47" y="8" width="2.5" height="4" fill="${c}"/>`,
    beanie: c => `<path d="M34 24 Q34 9 50 9 Q66 9 66 24Z" fill="${c}"/><rect x="33" y="21" width="34" height="5" rx="2" fill="rgba(0,0,0,.25)"/><circle cx="50" cy="8" r="4" fill="#fff"/>`,
    cap: c => `<path d="M34 23 Q34 9 50 9 Q66 9 66 23Z" fill="${c}"/><path d="M34 21 L18 23 Q20 26 34 25Z" fill="${c}"/>`,
    capFront: c => `<path d="M34 23 Q34 9 50 9 Q66 9 66 23Z" fill="${c}"/><ellipse cx="50" cy="23" rx="18" ry="3.5" fill="${c}"/><rect x="47" y="12" width="6" height="5" rx="1" fill="rgba(255,255,255,.6)"/>`,
    helmet: c => `<path d="M33 25 Q33 8 50 8 Q67 8 67 25Z" fill="${c}"/><path d="M42 10 L41 20 M50 8.5 L50 19 M58 10 L59 20" stroke="rgba(0,0,0,.35)" stroke-width="2"/><rect x="33" y="22" width="34" height="4" rx="2" fill="#222"/>`,
    bob: c => `<ellipse cx="50" cy="20" rx="22" ry="5" fill="${c}"/><path d="M36 20 Q36 7 50 7 Q64 7 64 20Z" fill="${c}"/><rect x="36" y="16" width="28" height="3" fill="rgba(0,0,0,.15)"/>`,
    fancy: c => `<ellipse cx="50" cy="16" rx="21" ry="4" fill="${c}"/><path d="M38 16 Q38 4 50 4 Q62 4 62 16Z" fill="${c}"/><rect x="38" y="12" width="24" height="3" fill="#7a2d4a"/><circle cx="60" cy="10" r="3" fill="#f5a3c7"/>`,
  };

  // ---- Bonhomme de base ----
  function person(o) {
    const skin = o.skin;
    let s = `<ellipse cx="50" cy="114" rx="24" ry="4.5" fill="rgba(0,0,0,.3)"/>`;
    s += o.back || "";

    // Jambes / jupe
    if (o.skirt) {
      s += `<rect x="40" y="96" width="5" height="14" fill="${o.tights || skin}"/><rect x="55" y="96" width="5" height="14" fill="${o.tights || skin}"/>`;
      s += `<path d="M34 78 L66 78 L71 100 L29 100Z" fill="${o.skirt}"/>`;
    } else if (o.shorts) {
      s += `<rect x="39" y="84" width="8" height="26" rx="3" fill="${skin}"/><rect x="53" y="84" width="8" height="26" rx="3" fill="${skin}"/>`;
      s += `<rect x="39" y="101" width="8" height="7" fill="#fff"/><rect x="53" y="101" width="8" height="7" fill="#fff"/>`;
      s += `<rect x="36" y="78" width="28" height="17" rx="3" fill="${o.shorts}"/><path d="M50 84 L50 95" stroke="rgba(0,0,0,.2)" stroke-width="1"/>`;
    } else {
      s += `<rect x="37" y="80" width="12" height="30" rx="3" fill="${o.pants}"/><rect x="51" y="80" width="12" height="30" rx="3" fill="${o.pants}"/>`;
    }
    s += `<ellipse cx="42" cy="111" rx="8" ry="4" fill="${o.shoes}"/><ellipse cx="58" cy="111" rx="8" ry="4" fill="${o.shoes}"/>`;

    // Cou + torse
    s += `<rect x="45.5" y="40" width="9" height="9" fill="${skin}"/>`;
    s += `<rect x="32" y="46" width="36" height="38" rx="9" fill="${o.shirt}"/>`;
    s += o.torso || "";

    // Bras
    const sleeve = o.sleeve || o.shirt;
    s += `<rect x="24" y="48" width="9" height="30" rx="4.5" fill="${sleeve}"/><circle cx="28.5" cy="80" r="4.5" fill="${skin}"/>`;
    if (o.armR === "up") {
      s += `<rect x="67" y="16" width="9" height="36" rx="4.5" fill="${sleeve}"/><circle cx="71.5" cy="14" r="5.5" fill="${skin}"/><path d="M68 13 L75 13" stroke="rgba(0,0,0,.25)" stroke-width="1"/>`;
    } else if (o.armR === "forward") {
      s += `<rect x="66" y="48" width="9" height="27" rx="4.5" fill="${sleeve}" transform="rotate(-50 70.5 50)"/><circle cx="90" cy="67" r="4.5" fill="${skin}"/>`;
    } else {
      s += `<rect x="67" y="48" width="9" height="30" rx="4.5" fill="${sleeve}"/><circle cx="71.5" cy="80" r="4.5" fill="${skin}"/>`;
    }
    s += o.arms || "";

    // Tête
    s += hairBack(o.hairStyle, o.hair);
    s += `<circle cx="35" cy="31" r="3.2" fill="${skin}"/><circle cx="65" cy="31" r="3.2" fill="${skin}"/>`;
    s += `<circle cx="50" cy="30" r="15" fill="${skin}"/>`;
    if (o.blush) s += `<circle cx="41" cy="35" r="2.6" fill="#f08a9a" opacity=".6"/><circle cx="59" cy="35" r="2.6" fill="#f08a9a" opacity=".6"/>`;

    // Yeux
    if (o.eyes === "sunglasses") {
      s += `<rect x="39.5" y="26.5" width="9.5" height="6" rx="2.2" fill="#0d0d0d"/><rect x="51" y="26.5" width="9.5" height="6" rx="2.2" fill="#0d0d0d"/><path d="M49 28.5 L51 28.5" stroke="#0d0d0d" stroke-width="1.5"/><path d="M41 28 L44 28" stroke="rgba(255,255,255,.5)" stroke-width="1"/>`;
    } else {
      s += `<circle cx="44" cy="30" r="1.9" fill="#222"/><circle cx="56" cy="30" r="1.9" fill="#222"/>`;
      if (o.eyes === "glasses") s += `<circle cx="44" cy="30" r="4.2" fill="none" stroke="#444" stroke-width="1.2"/><circle cx="56" cy="30" r="4.2" fill="none" stroke="#444" stroke-width="1.2"/><path d="M48.2 30 L51.8 30" stroke="#444" stroke-width="1.2"/>`;
      if (o.angry) s += `<path d="M40.5 25.5 L46.5 27.5 M59.5 25.5 L53.5 27.5" stroke="#222" stroke-width="1.6" stroke-linecap="round"/>`;
    }

    // Bouche
    if (o.moustache) s += `<path d="M44 36 Q50 33 56 36 Q50 35.5 44 36Z" fill="${o.moustache}" stroke="${o.moustache}" stroke-width="1.5"/>`;
    switch (o.mouth) {
      case "shout": s += `<ellipse cx="50" cy="38.5" rx="3.6" ry="3" fill="#5a1a1a"/>`; break;
      case "flat": s += `<path d="M46 38 L54 38" stroke="#5a2a2a" stroke-width="1.6" stroke-linecap="round"/>`; break;
      case "grin": s += `<path d="M44.5 36.5 Q50 42 55.5 36.5Z" fill="#fff" stroke="#5a2a2a" stroke-width="1.2"/>`; break;
      default: s += `<path d="M45.5 37 Q50 40.5 54.5 37" stroke="#5a2a2a" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    }

    s += hairFront(o.hairStyle, o.hair);
    if (o.hat) s += HATS[o.hat](o.hatColor || pick(BRIGHT));
    s += o.front || "";
    return `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
  }

  // ---- Personnages ----
  function manif() {
    const o = {
      skin: pick(SKIN), hair: pick(HAIR),
      hairStyle: pick(["short", "long", "afro", "spiky", "ponytail", "bald", "bun"]),
      shirt: pick(BRIGHT), pants: pick(JEANS), shoes: pick(SHOES),
      mouth: pick(["shout", "shout", "grin"]), angry: chance(.5),
      armR: chance(.6) ? "up" : "down", torso: "", front: "",
    };
    const extra = pick(["gilet", "badge", "bandana", "none"]);
    if (extra === "gilet") {
      o.torso = `<path d="M33 48 L67 48 L68 84 L32 84Z" fill="#e3f53b"/><path d="M50 48 L50 84" stroke="#b8c72a" stroke-width="1"/><rect x="32" y="70" width="36" height="4" fill="#c8c8c8"/>`;
    } else if (extra === "badge") {
      o.torso = `<circle cx="58" cy="58" r="6.5" fill="#d32f2f" stroke="#fff" stroke-width="1.2"/><text x="58" y="60.3" font-size="5" font-weight="900" text-anchor="middle" fill="#fff" font-family="Arial">GRÈVE</text>`;
    } else if (extra === "bandana") {
      o.torso = `<path d="M40 45 L60 45 L50 58Z" fill="#c62828"/><circle cx="47" cy="49" r="1" fill="#fff"/><circle cx="53" cy="49" r="1" fill="#fff"/><circle cx="50" cy="53" r="1" fill="#fff"/>`;
    }
    if (o.hairStyle !== "afro" && chance(.35)) { o.hat = pick(["beret", "beanie"]); o.hatColor = pick(["#c62828", "#222", "#1b5e20", "#283593"]); }
    if (chance(.25)) o.eyes = "glasses";
    // Mégaphone de temps en temps (bras gauche)
    if (chance(.25)) o.arms = `<path d="M20 70 L10 64 L10 80 L20 74Z" fill="#f1f1f1" stroke="#c62828" stroke-width="1.5"/><rect x="20" y="69" width="7" height="6" fill="#c62828"/>`;
    return person(o);
  }

  function lyceen() {
    const bag = pick(["#1e88e5", "#43a047", "#e53935", "#fdd835", "#8e24aa", "#212121", "#ff7043"]);
    const hoodie = chance(.55);
    const shirt = pick(BRIGHT.concat(["#9e9e9e", "#37474f"]));
    const o = {
      skin: pick(SKIN), hair: pick(HAIR),
      hairStyle: pick(["short", "long", "spiky", "afro", "ponytail", "slick"]),
      shirt, pants: pick(JEANS.concat(["#9e9e9e", "#212121"])), shoes: pick(SHOES),
      mouth: pick(["grin", "smile", "shout"]), armR: chance(.3) ? "up" : "down",
      back: `<rect x="27" y="47" width="46" height="34" rx="8" fill="${bag}"/><rect x="27" y="66" width="46" height="12" rx="4" fill="rgba(0,0,0,.15)"/>`,
      torso: `<rect x="36" y="46" width="4" height="32" rx="2" fill="${bag}"/><rect x="60" y="46" width="4" height="32" rx="2" fill="${bag}"/>`,
    };
    if (hoodie) {
      o.torso = `<path d="M37 46 Q50 54 63 46 L63 50 Q50 58 37 50Z" fill="rgba(0,0,0,.2)"/><path d="M46 51 L45 62 M54 51 L55 62" stroke="#fff" stroke-width="1.2"/><rect x="40" y="68" width="20" height="9" rx="3" fill="rgba(0,0,0,.15)"/>` + o.torso;
    } else if (chance(.6)) {
      o.torso = `<path d="M38 46 Q50 58 62 46" stroke="#222" stroke-width="3.5" fill="none"/><circle cx="38" cy="48" r="4" fill="#222"/><circle cx="62" cy="48" r="4" fill="#222"/>` + o.torso;
    }
    if (o.hairStyle !== "afro" && chance(.4)) { o.hat = pick(["cap", "capFront", "beanie"]); }
    if (chance(.2)) o.eyes = "glasses";
    // Téléphone dans la main gauche
    if (chance(.4)) o.arms = `<rect x="23" y="76" width="7" height="11" rx="1.5" fill="#111"/><rect x="24" y="77.5" width="5" height="7.5" fill="#64b5f6"/>`;
    return person(o);
  }

  function cnews() {
    const jacket = pick(["#1c2333", "#2e2e2e", "#3d4a5c", "#4a3b2f", "#1a3550"]);
    const tie = pick(["#c62828", "#1565c0", "#6a1b9a", "#ad8b00"]);
    const o = {
      skin: pick(SKIN), hair: pick(HAIR.slice(0, 6).concat(GREY.slice(0, 2))),
      hairStyle: pick(["slick", "slick", "long", "short", "bald"]),
      shirt: jacket, pants: jacket, shoes: "#111", mouth: pick(["smile", "flat", "grin"]),
      armR: "forward",
      torso: `<path d="M43 46 L57 46 L50 64Z" fill="#fff"/><path d="M49 48 L51 48 L52.5 61 L50 65 L47.5 61Z" fill="${tie}"/><path d="M43 46 L48 56 L44 58Z M57 46 L52 56 L56 58Z" fill="rgba(255,255,255,.12)"/>`,
      arms: `<rect x="88.5" y="52" width="3.5" height="16" rx="1.5" fill="#222"/><circle cx="90.2" cy="49" r="5.5" fill="#888"/><rect x="84" y="55" width="12.5" height="7" rx="1" fill="#e3001b"/><text x="90.2" y="60.4" font-size="5.2" font-weight="900" text-anchor="middle" fill="#fff" font-family="Arial">CN</text>`,
      front: `<path d="M65 30 Q69 33 66 40" stroke="#ddd" stroke-width="1.3" fill="none"/>`,
    };
    if (chance(.3)) o.eyes = "glasses";
    if (o.hairStyle === "bald" && chance(.5)) o.moustache = "#4a2f1b";
    return person(o);
  }

  function civil() {
    const jacket = pick(["#3b2a20", "#1f1f1f", "#4e3524", "#26324a", "#3a3f2a"]);
    const o = {
      skin: pick(SKIN), hair: pick(HAIR.slice(0, 6)),
      hairStyle: pick(["short", "bald", "short", "slick"]),
      shirt: jacket, pants: pick(["#2c3e60", "#22252b", "#555"]), shoes: pick(["#111", "#f2f2f2"]),
      eyes: "sunglasses", mouth: "flat",
      moustache: chance(.45) ? pick(["#2b1d14", "#4a2f1b", "#151515"]) : null,
      torso: `<path d="M50 48 L50 84" stroke="#999" stroke-width="1"/><path d="M40 46 L50 52 L46 58Z M60 46 L50 52 L54 58Z" fill="rgba(255,255,255,.1)"/>` +
        // Brassard POLICE qui dépasse de la poche
        `<rect x="54" y="64" width="12" height="11" rx="1.5" fill="rgba(0,0,0,.35)"/><rect x="56" y="58" width="8" height="9" fill="#ff6d00"/><path d="M56 61.5 L64 61.5" stroke="#fff" stroke-width="1"/><text x="60" y="66.5" font-size="2.6" font-weight="900" text-anchor="middle" fill="#fff" font-family="Arial">POLICE</text>`,
      // Oreillette
      front: `<path d="M65 32 Q68 36 64 38 Q60 40 64 42 Q68 44 63 47" stroke="#cfd8dc" stroke-width="1.1" fill="none"/>`,
    };
    if (chance(.5)) { o.hat = pick(["capFront", "beanie"]); o.hatColor = pick(["#111", "#263238", "#3e2723"]); }
    // Talkie-walkie
    if (chance(.4)) o.arms = `<rect x="68" y="76" width="7" height="13" rx="1.5" fill="#222"/><rect x="72" y="71" width="1.6" height="6" fill="#222"/>`;
    return person(o);
  }

  function mamie() {
    const cardigan = pick(PASTEL.concat(["#7b5e57", "#8d6e63", "#5c6bc0"]));
    const o = {
      skin: pick(SKIN.slice(0, 6)), hair: pick(GREY),
      hairStyle: pick(["perm", "bun", "perm"]),
      shirt: cardigan, skirt: pick(["#5d4037", "#37474f", "#6d4c41", "#4a148c", "#33691e", "#880e4f"]),
      tights: pick(["#c8a98d", "#a1887f", "#d7ccc8"]), shoes: pick(["#3e2723", "#111", "#5d4037"]),
      eyes: chance(.75) ? "glasses" : "dots", mouth: "smile", blush: true,
      torso: `<path d="M50 48 L50 82" stroke="rgba(0,0,0,.2)" stroke-width="1"/><circle cx="52.5" cy="56" r="1.3" fill="#fff"/><circle cx="52.5" cy="64" r="1.3" fill="#fff"/><circle cx="52.5" cy="72" r="1.3" fill="#fff"/>` +
        [42, 44.5, 47, 50, 53, 55.5, 58].map((x, i) => `<circle cx="${x}" cy="${47 + [0, 2, 3.3, 3.8, 3.3, 2, 0][i]}" r="1.4" fill="#fdfdfd"/>`).join(""),
    };
    const acc = pick(["cane", "caddy", "bag"]);
    if (acc === "cane") {
      o.arms = `<path d="M72 80 L76 114" stroke="#6d4c41" stroke-width="3" stroke-linecap="round"/><path d="M72 80 Q71 74 66 76" stroke="#6d4c41" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    } else if (acc === "caddy") {
      const c = pick(["#c62828", "#2e7d32", "#1565c0"]);
      o.back = `<path d="M72 80 L82 60" stroke="#555" stroke-width="2"/><rect x="76" y="82" width="18" height="24" rx="3" fill="${c}"/><path d="M76 88 H94 M76 96 H94 M82 82 V106 M88 82 V106" stroke="rgba(0,0,0,.3)" stroke-width="1.5"/><circle cx="79" cy="109" r="3" fill="#222"/><circle cx="91" cy="109" r="3" fill="#222"/>`;
      o.arms = `<path d="M72 80 L80 84" stroke="#555" stroke-width="2"/>`;
    } else {
      o.arms = `<path d="M24 82 Q28 74 33 82" stroke="#4e342e" stroke-width="1.6" fill="none"/><rect x="20" y="81" width="17" height="13" rx="3" fill="${pick(["#6d4c41", "#880e4f", "#212121", "#bf360c"])}"/><circle cx="28.5" cy="87" r="1.5" fill="#d4af37"/>`;
    }
    if (chance(.3)) { o.hat = "fancy"; o.hatColor = pick(["#9575cd", "#4db6ac", "#f48fb1", "#8d6e63"]); }
    return person(o);
  }


  // ---- Personnages des niveaux ----
  function blackbloc() {
    const o = {
      skin: pick(SKIN), hair: "#111", hairStyle: "none",
      shirt: "#1c1c1c", pants: "#141414", shoes: pick(["#111", "#2b2b2b"]),
      angry: true, mouth: "flat", armR: chance(.6) ? "up" : "down",
      back: `<circle cx="50" cy="28" r="19.5" fill="#1a1a1a"/>`,
      torso: `<path d="M44 48 L46 70 M56 48 L54 70" stroke="#333" stroke-width="1.5"/>`,
    };
    o.front = `<path d="M34 29 Q34 11 50 11 Q66 11 66 29 Q60 19 50 19 Q40 19 34 29Z" fill="#1a1a1a"/>` +
      `<path d="M35.4 32.5 L64.6 32.5 Q64 44 50 46 Q36 44 35.4 32.5Z" fill="#101010"/>`;
    if (chance(.4)) o.front += `<rect x="38.5" y="25.5" width="23" height="8" rx="3.5" fill="#ff9800" opacity=".85" stroke="#111" stroke-width="1.5"/>`;
    if (o.armR === "up" && chance(.6)) {
      o.front += `<path d="M71.5 14 L71.5 4" stroke="#333" stroke-width="2"/><path d="M48 9 Q71.5 -12 95 9 Q89 5 83.5 9 Q77.5 5 71.5 9 Q65.5 5 59.5 9 Q54 5 48 9Z" fill="#0d0d0d"/>`;
    }
    return person(o);
  }

  function prof() {
    const jacket = pick(["#7b5b3a", "#5d6b3a", "#34495e", "#6d4c41", "#455a64"]);
    const scarf = pick(BRIGHT);
    const o = {
      skin: pick(SKIN), hair: pick(HAIR.concat(GREY.slice(0, 2))),
      hairStyle: pick(["short", "long", "bald", "bun", "slick"]),
      shirt: jacket, pants: pick(["#4e4e4e", "#2c3e60", "#6b5a45"]), shoes: "#3e2723",
      eyes: chance(.7) ? "glasses" : "dots", mouth: pick(["shout", "smile"]), armR: chance(.45) ? "up" : "down",
      torso: `<rect x="42" y="44" width="16" height="6" rx="3" fill="${scarf}"/><rect x="52" y="48" width="5" height="22" rx="1" fill="${scarf}"/>`,
      arms: `<ellipse cx="28.5" cy="68" rx="3.5" ry="5" fill="rgba(0,0,0,.25)"/>` +
        `<rect x="17" y="66" width="17" height="13" fill="#fff" stroke="#ccc"/><path d="M19 70 H31 M19 73 H29 M19 76 H30" stroke="#999" stroke-width=".8"/><path d="M27 68 L31 72" stroke="#e53935" stroke-width="1.2"/>`,
    };
    if (o.hairStyle !== "long" && chance(.45)) o.front = `<path d="M36 33 Q37 47 50 47 Q63 47 64 33 Q61 41 50 41.5 Q39 41 36 33Z" fill="${o.hair}"/>`;
    return person(o);
  }

  const TRICO = `<rect x="24" y="46" width="18" height="46" fill="#0055a4"/><rect x="42" y="46" width="16" height="46" fill="#fff"/><rect x="58" y="46" width="18" height="46" fill="#ef4135"/>`;
  const FLAG = `<path d="M71.5 13 L71.5 0" stroke="#8d6e63" stroke-width="2"/><rect x="72" y="0.5" width="6" height="11" fill="#0055a4"/><rect x="78" y="0.5" width="6" height="11" fill="#fff"/><rect x="84" y="0.5" width="6" height="11" fill="#ef4135"/>`;

  function supporter() {
    const o = {
      skin: pick(SKIN), hair: pick(HAIR), hairStyle: pick(["short", "long", "afro", "spiky", "ponytail", "bald"]),
      shirt: "#1d3c8f", pants: pick(JEANS), shoes: pick(SHOES),
      mouth: pick(["shout", "grin"]), armR: chance(.7) ? "up" : "down",
      back: chance(.5) ? TRICO : "",
      torso: `<text x="50" y="74" font-size="15" font-weight="900" text-anchor="middle" fill="#fff" font-family="Arial">${pick(["10", "7", "9", "11", "23"])}</text><path d="M44 46 L50 51 L56 46" stroke="#ef4135" stroke-width="2" fill="none"/>`,
      front: `<rect x="38" y="33" width="1.6" height="5" fill="#0055a4"/><rect x="39.6" y="33" width="1.6" height="5" fill="#fff"/><rect x="41.2" y="33" width="1.6" height="5" fill="#ef4135"/>`,
    };
    if (o.armR === "up" && chance(.5)) o.front += FLAG;
    if (o.hairStyle !== "afro" && chance(.35)) { o.hat = pick(["beanie", "capFront"]); o.hatColor = pick(["#1d3c8f", "#ef4135", "#fff"]); }
    return person(o);
  }

  function ultra() {
    const scarf = pick(["#1d3c8f", "#c62828", "#111"]);
    const o = {
      skin: pick(SKIN), hair: pick(HAIR), hairStyle: "short",
      shirt: pick(["#222", "#1d3c8f", "#37474f"]), pants: pick(["#111", "#2c3e60"]), shoes: "#f2f2f2",
      angry: true, mouth: "shout", armR: "up", hat: "beanie", hatColor: pick(["#111", "#1d3c8f"]),
      torso: `<path d="M44 48 L46 70 M56 48 L54 70" stroke="rgba(255,255,255,.2)" stroke-width="1.5"/>`,
    };
    o.front = `<path d="M35.4 33 L64.6 33 Q64 44 50 46 Q36 44 35.4 33Z" fill="${scarf}"/><path d="M37 37 H63 M39 41 H61" stroke="#fff" stroke-width="1.6"/>` +
      `<circle cx="60" cy="6" r="7" fill="rgba(255,120,120,.35)"/><circle cx="84" cy="5" r="8" fill="rgba(255,120,120,.3)"/>` +
      `<rect x="69" y="3" width="5" height="11" rx="1" fill="#c62828"/><circle cx="71.5" cy="3" r="8" fill="#ff5722" opacity=".55"/><circle cx="71.5" cy="3" r="4.5" fill="#ffeb3b"/>`;
    return person(o);
  }

  function depute() {
    const suit = pick(["#1c2333", "#2e2e2e", "#3d4a5c", "#1a3550"]);
    const o = {
      skin: pick(SKIN), hair: pick(GREY.slice(0, 2).concat(HAIR.slice(0, 4))),
      hairStyle: pick(["slick", "bald", "short", "bun"]),
      shirt: suit, pants: suit, shoes: "#111", mouth: "grin", eyes: chance(.4) ? "glasses" : "dots",
      torso: `<path d="M43 46 L57 46 L50 62Z" fill="#fff"/><path d="M49 48 L51 48 L52 58 L50 61 L48 58Z" fill="#283593"/>` +
        `<g transform="rotate(-40 50 64)"><rect x="29" y="58" width="42" height="3.5" fill="#0055a4"/><rect x="29" y="61.5" width="42" height="3.5" fill="#fff"/><rect x="29" y="65" width="42" height="3.5" fill="#ef4135"/></g>` +
        `<path d="M36 78 L35 86 M38 78 L38 86 M40 78 L41 86" stroke="#d4af37" stroke-width="1.5"/>`,
    };
    if (chance(.35)) o.moustache = "#9e9e9e";
    return person(o);
  }

  function livreur() {
    const box = pick(["#00b3a4", "#ff6f00", "#e91e63", "#43a047"]);
    const o = {
      skin: pick(SKIN), hair: pick(HAIR), hairStyle: "short",
      shirt: pick(["#263238", box, "#37474f"]), pants: pick(["#111", "#2c3e60", "#555"]), shoes: pick(SHOES),
      mouth: "flat", hat: "helmet", hatColor: pick(["#fafafa", "#212121", box]),
      back: `<circle cx="22" cy="104" r="12" fill="none" stroke="#222" stroke-width="3"/><circle cx="78" cy="104" r="12" fill="none" stroke="#222" stroke-width="3"/>` +
        `<path d="M22 104 L40 88 L64 88 L78 104 M40 88 L50 104 L64 88 M64 88 L68 78 L74 78" stroke="${box}" stroke-width="3" fill="none" stroke-linecap="round"/>` +
        `<rect x="25" y="34" width="50" height="42" rx="4" fill="${box}"/><rect x="25" y="48" width="50" height="5" fill="rgba(255,255,255,.6)"/>`,
    };
    return person(o);
  }

  function proviseur() {
    const suit = pick(["#5f6368", "#4e4e4e", "#3d4a5c"]);
    const o = {
      skin: pick(SKIN), hair: pick(GREY.slice(0, 2).concat(["#4a2f1b", "#151515"])),
      hairStyle: pick(["bald", "short", "slick", "bun"]),
      shirt: suit, pants: suit, shoes: "#111", eyes: "glasses", angry: true, mouth: pick(["shout", "flat"]),
      moustache: chance(.5) ? "#757575" : null,
      torso: `<path d="M43 46 L57 46 L50 62Z" fill="#f5f5f5"/><path d="M49 48 L51 48 L52.5 61 L50 65 L47.5 61Z" fill="#5d4037"/>`,
      arms: `<rect x="16" y="68" width="15" height="19" rx="1.5" fill="#8d6e63"/><rect x="18" y="71" width="11" height="14" fill="#fff"/><rect x="21" y="66.5" width="5" height="3" fill="#bbb"/><path d="M20 75 H27 M20 78 H27 M20 81 H25" stroke="#888" stroke-width=".8"/>`,
    };
    return person(o);
  }

  function touriste() {
    const base = pick(["#ff7043", "#26c6da", "#ffca28", "#ec407a", "#66bb6a"]);
    let flowers = "";
    for (let i = 0; i < 6; i++) flowers += `<circle cx="${36 + Math.random() * 28}" cy="${50 + Math.random() * 30}" r="2.3" fill="${pick(["#fff", "#e91e63", "#ffeb3b", "#1e88e5"])}"/>`;
    const o = {
      skin: pick(SKIN), hair: pick(HAIR.concat(GREY.slice(0, 1))), hairStyle: pick(["short", "bald", "long", "ponytail"]),
      shirt: base, shorts: pick(["#d7ccc8", "#bcaaa4", "#8d6e63", "#90a4ae"]), shoes: "#8d6e63",
      eyes: chance(.4) ? "sunglasses" : "dots", mouth: pick(["grin", "smile"]), blush: true,
      hat: chance(.6) ? "bob" : null, hatColor: pick(["#f5f5dc", "#fff", "#c8e6c9"]),
      torso: flowers + `<path d="M40 46 Q50 60 60 46" stroke="#333" stroke-width="1.2" fill="none"/><rect x="44" y="56" width="13" height="9" rx="2" fill="#222"/><circle cx="50.5" cy="60.5" r="3" fill="#90caf9" stroke="#555"/>`,
      arms: `<rect x="17" y="72" width="16" height="12" fill="#fff59d" stroke="#c0b05a"/><path d="M22 72 V84 M27 72 V84" stroke="#c0b05a" stroke-width=".8"/><path d="M19 76 Q24 80 31 77" stroke="#e53935" stroke-width="1" fill="none"/>`,
    };
    return person(o);
  }

  function renforts() {
    return `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="104" rx="46" ry="5" fill="rgba(0,0,0,.3)"/>
      <circle cx="50" cy="40" r="11" fill="#2196f3" opacity=".35"/>
      <rect x="44" y="38" width="12" height="7" rx="2" fill="#1e88e5"/><rect x="47" y="35" width="6" height="4" rx="2" fill="#bbdefb"/>
      <rect x="4" y="44" width="92" height="52" rx="7" fill="#f5f5f5" stroke="#cfd8dc"/>
      <rect x="10" y="50" width="18" height="16" rx="2" fill="#37474f"/><rect x="32" y="50" width="18" height="16" rx="2" fill="#37474f"/><rect x="54" y="50" width="18" height="16" rx="2" fill="#37474f"/><rect x="76" y="50" width="15" height="16" rx="2" fill="#546e7a"/>
      <path d="M12 54 L20 54 M34 54 L42 54" stroke="#90a4ae" stroke-width="2"/>
      <rect x="4" y="72" width="92" height="6" fill="#1a3d8f"/><rect x="4" y="78" width="92" height="3" fill="#ef4135"/>
      <text x="48" y="91" font-size="9" font-weight="900" text-anchor="middle" fill="#1a3d8f" font-family="Arial">POLICE</text>
      <circle cx="24" cy="97" r="8" fill="#222"/><circle cx="24" cy="97" r="3" fill="#9e9e9e"/><circle cx="76" cy="97" r="8" fill="#222"/><circle cx="76" cy="97" r="3" fill="#9e9e9e"/>
    </svg>`;
  }

  // Boss : la daronne de TT (bigoudis, robe de chambre léopard, claquette à la main)
  function daronne() {
    const robe = pick(["#d81b60", "#8e24aa", "#c2185b", "#6a1b9a"]);
    let spots = "";
    for (let i = 0; i < 14; i++) {
      const x = 34 + Math.random() * 32, y = 50 + Math.random() * 46;
      spots += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="2.4" ry="1.8" fill="none" stroke="#2b1a10" stroke-width="1"/>`;
    }
    let curlers = "";
    [[38, 15], [46, 11], [54, 11], [62, 15], [34, 23], [66, 23]].forEach(([x, y], i) => {
      curlers += `<rect x="${x - 3.5}" y="${y - 2.5}" width="7" height="5" rx="2" fill="${["#ff80ab", "#80d8ff", "#ccff90"][i % 3]}" stroke="rgba(0,0,0,.3)" stroke-width=".6"/>`;
    });
    const o = {
      skin: pick(SKIN), hair: pick(["#4a2f1b", "#2b1d14", "#7a4a22", "#a33d1f"]), hairStyle: "long",
      shirt: robe, skirt: robe, tights: null, shoes: "#ff80ab",
      angry: true, mouth: "shout", armR: "up", blush: true,
      torso: spots + `<rect x="32" y="74" width="36" height="4" fill="#ffd54f"/><path d="M50 46 L44 74 M50 46 L56 74" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/>`,
      front: curlers +
        // Claquette brandie
        `<g transform="rotate(-25 72 8)"><rect x="64" y="-6" width="15" height="26" rx="7" fill="#1565c0"/><rect x="64" y="4" width="15" height="5" fill="#fff"/></g>` +
        // Pantoufles à pompons
        `<circle cx="42" cy="108" r="3.5" fill="#fff"/><circle cx="58" cy="108" r="3.5" fill="#fff"/>`,
    };
    return person(o).replace('viewBox="0 0 100 120"', 'viewBox="0 -10 100 130"');
  }

  return { manif, lyceen, cnews, civil, mamie, blackbloc, prof, supporter, ultra, depute, livreur, proviseur, touriste, renforts, daronne };
})();
