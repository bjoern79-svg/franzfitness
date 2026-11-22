"use strict";
/* Eigene schematische Übungsfiguren. Keine Fotos, keine fremden Vorlagen. */
const FIG = (function () {
  const RED = "#d40000";
  const RED2 = "#ff6a3d";
  const SKIN = "#f6d0ae";
  const SKIN2 = "#e7b48e";
  const LINE = "#1b130f";
  const HAIR = "#241c16";
  const SHORTS = "#1a1a1a";
  const SHOE = "#f4f4f4";
  const GEAR = "#2a2a2a";
  const PAD = "#3c3c3c";

  const r = n => Math.round(n * 10) / 10;
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const mul = (a, s) => [a[0] * s, a[1] * s];
  const len = a => Math.hypot(a[0], a[1]);
  const norm = a => { const l = len(a) || 1; return [a[0] / l, a[1] / l]; };
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

  function snapPerp(a, b, prefer) {
    const u = norm(sub(b, a));
    const p = [-u[1], u[0]];
    const pref = norm(prefer && len(prefer) ? prefer : [1, 0]);
    const sign = p[0] * pref[0] + p[1] * pref[1] >= 0 ? 1 : -1;
    return [p[0] * sign, p[1] * sign];
  }

  function bone(a, b, w, color) {
    return `<line x1="${r(a[0])}" y1="${r(a[1])}" x2="${r(b[0])}" y2="${r(b[1])}" stroke="${LINE}" stroke-width="${r(w + 5)}" stroke-linecap="round"/>` +
      `<line x1="${r(a[0])}" y1="${r(a[1])}" x2="${r(b[0])}" y2="${r(b[1])}" stroke="${color}" stroke-width="${r(w)}" stroke-linecap="round"/>`;
  }
  function circ(c, rad, fill, stroke) {
    return `<circle cx="${r(c[0])}" cy="${r(c[1])}" r="${r(rad)}" fill="${fill}" stroke="${stroke || LINE}" stroke-width="2.4"/>`;
  }
  function ell(c, rx, ry, deg, fill, stroke) {
    return `<ellipse cx="${r(c[0])}" cy="${r(c[1])}" rx="${r(rx)}" ry="${r(ry)}" fill="${fill}" stroke="${stroke || "#7a0000"}" stroke-width="2" transform="rotate(${r(deg)} ${r(c[0])} ${r(c[1])})"/>`;
  }
  function band(a, b, dir, dist, w, color, t0, t1) {
    const a2 = add(lerp(a, b, t0), mul(dir, dist));
    const b2 = add(lerp(a, b, t1), mul(dir, dist));
    return bone(a2, b2, w, color);
  }
  function poly(pts, fill, stroke) {
    return `<polygon points="${pts.map(p => r(p[0]) + "," + r(p[1])).join(" ")}" fill="${fill}" stroke="${stroke || LINE}" stroke-width="3" stroke-linejoin="round"/>`;
  }

  function torso(hip, sh, front) {
    const u = norm(sub(sh, hip));
    const L = len(sub(sh, hip)) || 1;
    const back = mul(front, -1);
    const rows = [[0.02, 22, 18], [0.42, 16, 15], [0.72, 18, 16], [1, 24, 18]];
    const pf = rows.map(([t, wf]) => add(add(hip, mul(u, L * t)), mul(front, wf)));
    const pb = rows.map(([t, , wb]) => add(add(hip, mul(u, L * t)), mul(back, wb))).reverse();
    return poly(pf.concat(pb), SKIN, LINE);
  }

  function head(hc, face, up) {
    const hairC = add(hc, add(mul(up, 4), mul(face, -6)));
    const ear = add(hc, add(mul(face, -2), mul(up, -4)));
    const eye = add(hc, add(mul(face, 9), mul(up, -2)));
    const n1 = add(hc, add(mul(face, 14), mul(up, -6)));
    const n2 = add(hc, add(mul(face, 24), mul(up, -12)));
    const ang = Math.atan2(up[1], up[0]) * 180 / Math.PI;
    return circ(hairC, 23, HAIR, HAIR) + circ(hc, 22, SKIN) +
      ell(ear, 5.5, 8, ang, SKIN, LINE) +
      circ(eye, 2.6, "#140e0c", "#140e0c") +
      `<line x1="${r(n1[0])}" y1="${r(n1[1])}" x2="${r(n2[0])}" y2="${r(n2[1])}" stroke="${LINE}" stroke-width="3.2" stroke-linecap="round"/>`;
  }

  function shoe(ankle, toe) {
    const back = add(ankle, mul(norm(sub(ankle, toe)), 10));
    const soleA = add(back, [0, 5]);
    const soleB = add(toe, [0, 4]);
    return bone(back, toe, 13, SHOE) +
      `<line x1="${r(soleA[0])}" y1="${r(soleA[1])}" x2="${r(soleB[0])}" y2="${r(soleB[1])}" stroke="#222" stroke-width="3.5" stroke-linecap="round"/>`;
  }

  function dumbbell(x, y, mode) {
    if (mode === "hammer") {
      return `<line x1="${r(x)}" y1="${r(y - 20)}" x2="${r(x)}" y2="${r(y + 20)}" stroke="#c8c8c8" stroke-width="5" stroke-linecap="round"/>` +
        `<line x1="${r(x - 14)}" y1="${r(y - 16)}" x2="${r(x + 14)}" y2="${r(y - 16)}" stroke="#111" stroke-width="9" stroke-linecap="round"/>` +
        `<line x1="${r(x - 14)}" y1="${r(y + 16)}" x2="${r(x + 14)}" y2="${r(y + 16)}" stroke="#111" stroke-width="9" stroke-linecap="round"/>`;
    }
    return `<line x1="${r(x - 12)}" y1="${r(y)}" x2="${r(x + 14)}" y2="${r(y)}" stroke="#bdbdbd" stroke-width="5" stroke-linecap="round"/>` +
      circ([x - 8, y], 13, "#161616", "#000") + circ([x + 8, y], 13, "#0c0c0c", "#000") +
      `<circle cx="${r(x + 8)}" cy="${r(y)}" r="4.5" fill="#d5d5d5"/>`;
  }

  function person(o) {
    const hip = o.hip, sh = o.shoulder;
    const headUp = norm(sub(sh, hip));
    const frontRaw = norm(o.front || [1, 0]);
    const front = snapPerp(hip, sh, frontRaw);
    const back = mul(front, -1);
    const legPrefer = norm(o.legFront || frontRaw);
    const peek = add(mul(back, 10), mul(headUp, 8));
    const hc = add(add(sh, mul(headUp, 38)), mul(front, 2));
    const legs = o.legs || [];
    const arms = o.arms || [];
    const resolved = [];
    let s = "";

    function drawLeg(leg, color) {
      const ghost = !!leg.ghost;
      const knee = ghost ? add(leg.knee, peek) : leg.knee;
      const ankle = ghost ? add(leg.ankle, peek) : leg.ankle;
      const toe = ghost ? add(leg.toe || add(leg.ankle, [26, 10]), peek) : (leg.toe || add(leg.ankle, [26, 10]));
      resolved.push({ kind: "leg", leg, hip, knee, ankle, toe });
      return bone(hip, knee, leg.thin ? 14 : 20, color) + bone(knee, ankle, leg.thin ? 10 : 13, color) + shoe(ankle, toe);
    }
    function drawArm(arm, color) {
      const ghost = !!arm.ghost;
      const elbow = ghost ? add(arm.elbow, peek) : arm.elbow;
      const hand = ghost ? add(arm.hand, peek) : arm.hand;
      resolved.push({ kind: "arm", arm, sh, elbow, hand });
      return bone(sh, elbow, 15, color) + bone(elbow, hand, 11, color) + circ(hand, 8, color);
    }

    legs.filter(l => l.far).forEach(l => { s += drawLeg(l, SKIN2); });
    arms.filter(a => a.far).forEach(a => { s += drawArm(a, SKIN2); });
    s += torso(hip, sh, front);
    legs.filter(l => !l.far).forEach(l => { s += drawLeg(l, SKIN); });
    s += circ(hip, 22, SHORTS, "#000");
    resolved.filter(x => x.kind === "leg").forEach(x => {
      s += bone(hip, lerp(hip, x.knee, 0.46), 22, SHORTS);
    });
    arms.filter(a => !a.far).forEach(a => { s += drawArm(a, SKIN); });
    s += bone(sh, add(sh, mul(headUp, 14)), 13, SKIN);
    s += head(hc, front, headUp);

    const muscles = o.muscles || [];
    const primary = muscles[0];
    const col = m => m === primary ? RED : RED2;
    const ang = Math.atan2(sh[1] - hip[1], sh[0] - hip[0]) * 180 / Math.PI;
    const has = m => muscles.indexOf(m) >= 0;
    if (has("chest")) s += ell(add(lerp(sh, hip, 0.28), mul(front, 8)), 16, 13, ang, col("chest"));
    if (has("abs")) s += ell(add(lerp(sh, hip, 0.64), mul(front, 9)), 11, 16, ang, col("abs"));
    if (has("obliques")) s += ell(add(lerp(sh, hip, 0.56), mul(front, 8)), 14, 16, ang, col("obliques"));
    if (has("lats")) s += ell(add(lerp(sh, hip, 0.4), mul(back, 11)), 16, 26, ang, col("lats"));
    if (has("traps")) s += ell(add(sh, add(mul(back, 4), mul(headUp, 8))), 12, 9, ang, col("traps"));
    if (has("erectors")) s += band(hip, sh, back, 6, 9, col("erectors"), 0.08, 0.72);
    if (has("glutes")) s += circ(add(hip, add(mul(back, 12), mul(headUp, -2))), 13, col("glutes"));
    if (has("fdelt")) s += circ(add(sh, mul(front, 12)), 9, col("fdelt"));
    if (has("rdelt")) s += circ(add(sh, mul(back, 11)), 9, col("rdelt"));
    if (has("mdelt")) s += circ(add(sh, mul(headUp, 12)), 9, col("mdelt"));

    resolved.forEach(part => {
      if (part.arm && part.arm.work === false) return;
      if (part.leg && part.leg.work === false) return;
      if (part.kind === "arm") {
        const dir = snapPerp(part.sh, part.elbow, front);
        if (has("biceps")) s += band(part.sh, part.elbow, dir, 5, 8, col("biceps"), 0.18, 0.78);
        if (has("triceps")) s += band(part.sh, part.elbow, mul(dir, -1), 5, 8, col("triceps"), 0.16, 0.8);
      } else {
        const dir = snapPerp(part.hip, part.knee, legPrefer);
        if (has("quads")) s += band(part.hip, part.knee, dir, 6, 10, col("quads"), 0.4, 0.9);
        if (has("hams")) s += band(part.hip, part.knee, mul(dir, -1), 6, 10, col("hams"), 0.38, 0.88);
      }
    });
    resolved.forEach(part => {
      if (part.kind === "arm" && part.arm.db) s += dumbbell(part.hand[0], part.hand[1], part.arm.db);
    });
    return s;
  }

  function personFront(o) {
    const cx = o.cx, sw = o.sw || 30, hw = o.hw || 22;
    const shL = [cx - sw, o.shY], shR = [cx + sw, o.shY];
    const hipL = [cx - hw, o.hipY], hipR = [cx + hw, o.hipY];
    const muscles = o.muscles || [];
    const primary = muscles[0];
    const col = m => m === primary ? RED : RED2;
    const has = m => muscles.indexOf(m) >= 0;
    let s = "";
    (o.legs || []).forEach(leg => {
      s += bone(leg.hip, leg.knee, 18, SKIN);
      s += bone(leg.knee, leg.ankle, 12, SKIN);
      s += shoe(leg.ankle, leg.toe);
    });
    s += poly([shL, [cx - hw - 4, o.hipY], [cx + hw + 4, o.hipY], shR], SKIN, LINE);
    s += `<rect x="${r(cx - hw - 8)}" y="${r(o.hipY - 8)}" width="${r((hw + 8) * 2)}" height="36" rx="8" fill="${SHORTS}"/>`;
    (o.legs || []).forEach(leg => { s += bone(leg.hip, lerp(leg.hip, leg.knee, 0.42), 20, SHORTS); });
    const hy = o.headY;
    s += circ([cx, hy - 3], 23, HAIR, HAIR);
    s += circ([cx, hy], 22, SKIN);
    s += circ([cx - 8, hy - 1], 2.5, "#140e0c", "#140e0c");
    s += circ([cx + 8, hy - 1], 2.5, "#140e0c", "#140e0c");
    s += `<path d="M ${r(cx - 6)} ${r(hy + 8)} Q ${r(cx)} ${r(hy + 12)} ${r(cx + 6)} ${r(hy + 8)}" fill="none" stroke="${LINE}" stroke-width="2" stroke-linecap="round"/>`;
    (o.arms || []).forEach(arm => {
      s += bone(arm.shoulder, arm.elbow, 14, SKIN);
      s += bone(arm.elbow, arm.hand, 11, SKIN);
      s += circ(arm.hand, 8, SKIN);
    });
    if (has("chest")) {
      s += ell([cx - 12, o.shY + 28], 12, 14, 0, col("chest"));
      s += ell([cx + 12, o.shY + 28], 12, 14, 0, col("chest"));
    }
    if (has("abs")) s += ell([cx, (o.shY + o.hipY) / 2 + 16], 12, 18, 0, col("abs"));
    if (has("obliques")) {
      s += ell([cx - 16, (o.shY + o.hipY) / 2 + 10], 7, 16, 0, col("obliques"));
      s += ell([cx + 16, (o.shY + o.hipY) / 2 + 10], 7, 16, 0, col("obliques"));
    }
    if (has("mdelt")) {
      s += circ(add(shL, [-8, -4]), 10, col("mdelt"));
      s += circ(add(shR, [8, -4]), 10, col("mdelt"));
    }
    if (has("fdelt")) {
      s += circ(add(shL, [6, 6]), 8, col("fdelt"));
      s += circ(add(shR, [-6, 6]), 8, col("fdelt"));
    }
    (o.arms || []).forEach(arm => {
      if (arm.work === false) return;
      const dir = snapPerp(arm.shoulder, arm.elbow, [0, -1]);
      if (has("biceps")) s += band(arm.shoulder, arm.elbow, dir, 4, 7, col("biceps"), 0.2, 0.75);
      if (has("triceps")) s += band(arm.shoulder, arm.elbow, mul(dir, -1), 4, 7, col("triceps"), 0.2, 0.75);
    });
    (o.legs || []).forEach(leg => {
      if (leg.work === false) return;
      const dir = snapPerp(leg.hip, leg.knee, [0, -1]);
      if (has("quads")) s += band(leg.hip, leg.knee, dir, 5, 8, col("quads"), 0.42, 0.88);
    });
    return s;
  }

  function api(parts) {
    const g = {
      raw: s => parts.push(s),
      person: o => parts.push(person(o)),
      front: o => parts.push(personFront(o)),
      floor: y => parts.push(`<line x1="16" y1="${y}" x2="340" y2="${y}" stroke="#e3e3e3" stroke-width="4" stroke-linecap="round"/>`),
      mat: (x, y, w) => parts.push(`<rect x="${x}" y="${y}" width="${w}" height="16" rx="7" fill="#d5dbe3" stroke="#b4bcc6" stroke-width="2"/>`),
      bench: (x, y, len) => parts.push(`<g transform="translate(${x} ${y})"><rect x="0" y="0" width="${len}" height="18" rx="7" fill="${PAD}" stroke="${LINE}" stroke-width="2.5"/><rect x="18" y="18" width="12" height="64" fill="${GEAR}"/><rect x="${len - 30}" y="18" width="12" height="64" fill="${GEAR}"/><rect x="8" y="76" width="32" height="8" rx="2" fill="#111"/><rect x="${len - 40}" y="76" width="32" height="8" rx="2" fill="#111"/></g>`),
      incline: (seatX, seatY, len, deg) => {
        parts.push(`<g transform="translate(${seatX} ${seatY}) rotate(${-deg})"><rect x="${-len}" y="-12" width="${len}" height="20" rx="7" fill="${PAD}" stroke="${LINE}" stroke-width="2.5"/></g>`);
        parts.push(`<rect x="${seatX - 6}" y="${seatY}" width="14" height="72" fill="${GEAR}"/>`);
        parts.push(`<rect x="${seatX - 28}" y="${seatY + 66}" width="64" height="9" rx="2" fill="#111"/>`);
      },
      seat: (x, y) => parts.push(`<rect x="${x}" y="${y - 78}" width="16" height="78" rx="4" fill="${GEAR}"/><rect x="${x}" y="${y - 8}" width="78" height="18" rx="6" fill="${PAD}" stroke="${LINE}" stroke-width="2"/>`),
      tower: (x, y, h) => {
        let stack = "";
        for (let i = 0; i < 5; i++) stack += `<rect x="${x - 8}" y="${y + h - 78 + i * 12}" width="32" height="9" fill="#3a3a3a" stroke="#111"/>`;
        parts.push(`<rect x="${x}" y="${y}" width="16" height="${h}" rx="3" fill="${GEAR}"/>${stack}<circle cx="${x + 8}" cy="${y + 12}" r="8" fill="#111" stroke="#9a9a9a" stroke-width="3"/>`);
      },
      cable: (x1, y1, x2, y2) => parts.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#5c5c5c" stroke-width="3.5" stroke-linecap="round"/>`),
      bar: (x1, y1, x2, y2) => parts.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#111" stroke-width="8" stroke-linecap="round"/>`),
      rope: (x, y, open) => {
        const s = open ? 18 : 7;
        parts.push(`<line x1="${x}" y1="${y - 6}" x2="${x - s}" y2="${y + 16}" stroke="#222" stroke-width="4" stroke-linecap="round"/><line x1="${x}" y1="${y - 6}" x2="${x + s}" y2="${y + 16}" stroke="#222" stroke-width="4" stroke-linecap="round"/>`);
      },
      db: (x, y, mode) => parts.push(dumbbell(x, y, mode || "plate")),
      pad: (x, y, w, h) => parts.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${PAD}" stroke="${LINE}" stroke-width="2"/>`)
    };
    return g;
  }

  function stand(mods) {
    const p = {
      front: [1, 0],
      hip: [150, 198],
      shoulder: [144, 96],
      legs: [
        { knee: [176, 272], ankle: [170, 342], toe: [202, 356], far: true, ghost: true },
        { knee: [152, 276], ankle: [146, 346], toe: [180, 360] }
      ],
      arms: [
        { elbow: [168, 154], hand: [174, 216], far: true, ghost: true },
        { elbow: [156, 158], hand: [162, 220] }
      ],
      muscles: []
    };
    if (!mods) return p;
    Object.keys(mods).forEach(k => { if (mods[k] !== undefined) p[k] = mods[k]; });
    return p;
  }

  function legsStand() {
    return [
      { knee: [176, 272], ankle: [170, 342], toe: [202, 356], far: true, ghost: true },
      { knee: [152, 276], ankle: [146, 346], toe: [180, 360] }
    ];
  }

  const CUE = {
    kh_bank: ["An der Brust", "Nach oben drücken"],
    hs_schraeg: ["Griffe an der Brust", "Nach oben drücken"],
    latzug: ["Arme lang oben", "Stange zur Brust"],
    kh_rudern: ["Arm hängt lang", "Hantel zur Hüfte"],
    goblet: ["Hantel vor der Brust", "Tief in die Knie"],
    bizeps: ["Arme hängen lang", "Hoch zur Schulter"],
    trizeps_seil: ["Unterarme oben", "Nach unten strecken"],
    schraegbank: ["An der oberen Brust", "Schräg nach oben"],
    fliegende: ["Arme weit offen", "Vor der Brust"],
    rudern: ["Arme lang nach vorn", "Griffe an die Hüfte"],
    seitheben: ["Hanteln an den Seiten", "Bis auf Schulterhöhe"],
    rdl: ["Aufrecht, Hanteln vorn", "Hüfte nach hinten"],
    hammer: ["Daumen nach oben", "Hoch zur Schulter"],
    trizeps_strecker: ["Unterarme gebeugt", "Unterarme strecken"],
    brustpresse: ["Griffe an der Brust", "Nach vorn drücken"],
    multipresse: ["Stange an der Brust", "Nach oben drücken"],
    deadbug: ["Arme und Beine oben", "Strecken im Wechsel"],
    trizeps_ueberkopf: ["Hände hinter dem Kopf", "Arme nach oben"],
    beinpresse: ["Knie gebeugt", "Beine strecken"],
    hipthrust: ["Hüfte unten", "Hüfte nach oben"],
    liegestuetz: ["Körper gerade", "Brust Richtung Boden"],
    bandrudern: ["Arme lang nach vorn", "Hände an die Rippen"],
    kniebeuge: ["Aufrecht stehen", "Tief in die Knie"],
    plank: ["Auf den Knien", "Körper eine Linie"],
    seitstutz: ["Auf dem Unterarm", "Hüfte hoch"],
    birddog: ["Auf Händen und Knien", "Arm und Bein strecken"],
    crunch: ["Schultern liegen", "Schultern anheben"],
    revcrunch: ["Beine oben angewinkelt", "Hüfte anheben"],
    pallof: ["Hände an der Brust", "Arme nach vorn"]
  };

  const DRAW = {
    kh_bank: {
      start(g) {
        g.bench(28, 214, 300);
        g.person({
          front: [0, -1], hip: [236, 196], shoulder: [118, 190],
          legs: [
            { knee: [292, 188], ankle: [308, 268], toe: [338, 282] }
          ],
          arms: [
            { elbow: [162, 228], hand: [128, 158], db: "plate" }
          ],
          muscles: ["chest", "triceps", "fdelt"]
        });
      },
      end(g) {
        g.bench(28, 214, 300);
        g.person({
          front: [0, -1], hip: [236, 196], shoulder: [118, 190],
          legs: [
            { knee: [292, 188], ankle: [308, 268], toe: [338, 282] }
          ],
          arms: [
            { elbow: [145, 140], hand: [122, 88], db: "plate" }
          ],
          muscles: ["chest", "triceps", "fdelt"]
        });
      }
    },
    hs_schraeg: {
      start(g) {
        g.seat(78, 236);
        g.tower(40, 40, 250);
        g.person(stand({
          hip: [118, 220], shoulder: [112, 118],
          legs: [
            { knee: [176, 268], ankle: [196, 338], toe: [228, 350], far: true, ghost: true },
            { knee: [164, 274], ankle: [186, 344], toe: [220, 354] }
          ],
          arms: [
            { elbow: [150, 150], hand: [186, 132], far: true, ghost: true },
            { elbow: [142, 156], hand: [178, 138] }
          ],
          muscles: ["chest", "fdelt", "triceps"]
        }));
        g.bar(168, 128, 196, 146);
      },
      end(g) {
        g.seat(78, 236);
        g.tower(40, 40, 250);
        g.person(stand({
          hip: [118, 220], shoulder: [112, 118],
          legs: [
            { knee: [176, 268], ankle: [196, 338], toe: [228, 350], far: true, ghost: true },
            { knee: [164, 274], ankle: [186, 344], toe: [220, 354] }
          ],
          arms: [
            { elbow: [168, 96], hand: [214, 64], far: true, ghost: true },
            { elbow: [156, 100], hand: [206, 70] }
          ],
          muscles: ["chest", "fdelt", "triceps"]
        }));
        g.bar(198, 58, 224, 78);
      }
    },
    latzug: {
      start(g) {
        g.tower(250, 18, 300);
        g.seat(96, 250);
        g.person({
          front: [1, 0], hip: [132, 236], shoulder: [126, 132],
          legs: [
            { knee: [186, 286], ankle: [196, 344], toe: [228, 356], far: true, ghost: true },
            { knee: [174, 292], ankle: [184, 348], toe: [218, 360] }
          ],
          arms: [
            { elbow: [168, 70], hand: [196, 42] }
          ],
          muscles: ["lats", "biceps", "traps"]
        });
        g.bar(176, 36, 230, 48);
        g.cable(258, 30, 210, 40);
      },
      end(g) {
        g.tower(250, 18, 300);
        g.seat(96, 250);
        g.person({
          front: [1, 0], hip: [132, 236], shoulder: [126, 132],
          legs: [
            { knee: [186, 286], ankle: [196, 344], toe: [228, 356], far: true, ghost: true },
            { knee: [174, 292], ankle: [184, 348], toe: [218, 360] }
          ],
          arms: [
            { elbow: [92, 156], hand: [150, 168] }
          ],
          muscles: ["lats", "biceps", "traps"]
        });
        g.bar(132, 160, 176, 176);
        g.cable(258, 30, 168, 166);
      }
    },
    kh_rudern: {
      start(g) {
        g.bench(36, 198, 250);
        g.person({
          front: [0, 1], hip: [198, 162], shoulder: [102, 150],
          legs: [
            { knee: [168, 196], ankle: [122, 204], toe: [98, 208], work: false },
            { knee: [236, 236], ankle: [246, 322], toe: [278, 336] }
          ],
          arms: [
            { elbow: [78, 172], hand: [56, 196], work: false },
            { elbow: [128, 205], hand: [132, 278], db: "plate" }
          ],
          muscles: ["lats", "biceps", "traps"]
        });
      },
      end(g) {
        g.bench(36, 198, 250);
        g.person({
          front: [0, 1], hip: [198, 162], shoulder: [102, 150],
          legs: [
            { knee: [168, 196], ankle: [122, 204], toe: [98, 208], work: false },
            { knee: [236, 236], ankle: [246, 322], toe: [278, 336] }
          ],
          arms: [
            { elbow: [78, 172], hand: [56, 196], work: false },
            { elbow: [148, 112], hand: [188, 148], db: "plate" }
          ],
          muscles: ["lats", "biceps", "traps"]
        });
      }
    },
    goblet: {
      start(g) {
        g.floor(368);
        const p = stand({
          muscles: ["quads", "glutes"],
          arms: [
            { elbow: [186, 132], hand: [158, 118], far: true, ghost: true },
            { elbow: [176, 136], hand: [150, 122], db: "plate" }
          ]
        });
        g.person(p);
      },
      end(g) {
        g.floor(368);
        g.person({
          front: [1, 0], hip: [172, 236], shoulder: [138, 132],
          legs: [
            { knee: [214, 292], ankle: [156, 346], toe: [190, 358], far: true, ghost: true },
            { knee: [198, 300], ankle: [142, 350], toe: [176, 362] }
          ],
          arms: [
            { elbow: [186, 176], hand: [156, 158], far: true, ghost: true },
            { elbow: [174, 182], hand: [148, 164], db: "plate" }
          ],
          muscles: ["quads", "glutes"]
        });
      }
    },
    bizeps: {
      start(g) {
        g.floor(368);
        g.person(stand({
          muscles: ["biceps"],
          arms: [
            { elbow: [176, 156], hand: [180, 224], far: true, ghost: true, db: "plate" },
            { elbow: [164, 160], hand: [168, 228], db: "plate" }
          ]
        }));
      },
      end(g) {
        g.floor(368);
        g.person(stand({
          muscles: ["biceps"],
          arms: [
            { elbow: [176, 150], hand: [186, 104], far: true, ghost: true, db: "plate" },
            { elbow: [164, 154], hand: [174, 108], db: "plate" }
          ]
        }));
      }
    },
    trizeps_seil: {
      start(g) {
        g.floor(368);
        g.tower(250, 16, 300);
        g.person(stand({
          muscles: ["triceps"],
          arms: [
            { elbow: [176, 156], hand: [196, 128], far: true, ghost: true },
            { elbow: [166, 160], hand: [188, 134] }
          ]
        }));
        g.cable(258, 28, 196, 120);
        g.rope(196, 128, false);
      },
      end(g) {
        g.floor(368);
        g.tower(250, 16, 300);
        g.person(stand({
          muscles: ["triceps"],
          arms: [
            { elbow: [176, 156], hand: [184, 228], far: true, ghost: true },
            { elbow: [166, 160], hand: [174, 232] }
          ]
        }));
        g.cable(258, 28, 184, 210);
        g.rope(180, 236, true);
      }
    },
    schraegbank: {
      start(g) {
        g.incline(250, 210, 200, 34);
        g.person({
          front: [-0.45, -0.9], hip: [236, 196], shoulder: [132, 132],
          legs: [
            { knee: [286, 220], ankle: [300, 292], toe: [328, 306], far: true, ghost: true },
            { knee: [274, 226], ankle: [292, 298], toe: [322, 312] }
          ],
          arms: [
            { elbow: [150, 186], hand: [146, 150], far: true, ghost: true, db: "plate" },
            { elbow: [138, 194], hand: [136, 156], db: "plate" }
          ],
          muscles: ["chest", "fdelt", "triceps"]
        });
      },
      end(g) {
        g.incline(250, 210, 200, 34);
        g.person({
          front: [-0.45, -0.9], hip: [236, 196], shoulder: [132, 132],
          legs: [
            { knee: [286, 220], ankle: [300, 292], toe: [328, 306], far: true, ghost: true },
            { knee: [274, 226], ankle: [292, 298], toe: [322, 312] }
          ],
          arms: [
            { elbow: [156, 96], hand: [128, 58], far: true, ghost: true, db: "plate" },
            { elbow: [140, 88], hand: [118, 50], db: "plate" }
          ],
          muscles: ["chest", "fdelt", "triceps"]
        });
      }
    },
    fliegende: {
      start(g) {
        g.seat(150, 250);
        const cx = 176;
        g.front({
          cx, headY: 62, shY: 108, hipY: 214, sw: 32, hw: 22,
          muscles: ["chest", "fdelt"],
          legs: [
            { hip: [cx - 16, 214], knee: [cx - 28, 286], ankle: [cx - 24, 346], toe: [cx + 6, 356] },
            { hip: [cx + 16, 214], knee: [cx + 30, 286], ankle: [cx + 34, 346], toe: [cx + 64, 356] }
          ],
          arms: [
            { shoulder: [cx - 32, 108], elbow: [cx - 78, 132], hand: [cx - 112, 156] },
            { shoulder: [cx + 32, 108], elbow: [cx + 78, 132], hand: [cx + 112, 156] }
          ]
        });
      },
      end(g) {
        g.seat(150, 250);
        const cx = 176;
        g.front({
          cx, headY: 62, shY: 108, hipY: 214, sw: 32, hw: 22,
          muscles: ["chest", "fdelt"],
          legs: [
            { hip: [cx - 16, 214], knee: [cx - 28, 286], ankle: [cx - 24, 346], toe: [cx + 6, 356] },
            { hip: [cx + 16, 214], knee: [cx + 30, 286], ankle: [cx + 34, 346], toe: [cx + 64, 356] }
          ],
          arms: [
            { shoulder: [cx - 32, 108], elbow: [cx - 46, 128], hand: [cx - 16, 150] },
            { shoulder: [cx + 32, 108], elbow: [cx + 46, 128], hand: [cx + 16, 150] }
          ]
        });
      }
    },
    rudern: {
      start(g) {
        g.pad(196, 124, 22, 78);
        g.seat(78, 236);
        g.tower(300, 70, 230);
        g.person({
          front: [1, 0], hip: [118, 220], shoulder: [150, 132],
          legs: [
            { knee: [176, 270], ankle: [196, 340], toe: [228, 352], far: true, ghost: true },
            { knee: [164, 276], ankle: [184, 344], toe: [218, 356] }
          ],
          arms: [
            { elbow: [196, 150], hand: [236, 156] }
          ],
          muscles: ["lats", "traps", "biceps"]
        });
        g.bar(220, 148, 252, 164);
        g.cable(308, 150, 246, 156);
      },
      end(g) {
        g.pad(196, 124, 22, 78);
        g.seat(78, 236);
        g.tower(300, 70, 230);
        g.person({
          front: [1, 0], hip: [118, 220], shoulder: [150, 132],
          legs: [
            { knee: [176, 270], ankle: [196, 340], toe: [228, 352], far: true, ghost: true },
            { knee: [164, 276], ankle: [184, 344], toe: [218, 356] }
          ],
          arms: [
            { elbow: [118, 108], hand: [158, 158] }
          ],
          muscles: ["lats", "traps", "biceps"]
        });
        g.bar(148, 150, 176, 166);
        g.cable(308, 150, 172, 158);
      }
    },
    seitheben: {
      start(g) {
        g.floor(368);
        const cx = 176;
        g.front({
          cx, headY: 52, shY: 100, hipY: 206, sw: 32, hw: 22,
          muscles: ["mdelt"],
          legs: [
            { hip: [cx - 16, 206], knee: [cx - 22, 280], ankle: [cx - 20, 346], toe: [cx + 8, 358] },
            { hip: [cx + 16, 206], knee: [cx + 24, 280], ankle: [cx + 26, 346], toe: [cx + 56, 358] }
          ],
          arms: [
            { shoulder: [cx - 32, 100], elbow: [cx - 48, 160], hand: [cx - 52, 214], db: "plate" },
            { shoulder: [cx + 32, 100], elbow: [cx + 48, 160], hand: [cx + 52, 214], db: "plate" }
          ]
        });
        g.db(cx - 52, 214, "plate");
        g.db(cx + 52, 214, "plate");
      },
      end(g) {
        g.floor(368);
        const cx = 176;
        g.front({
          cx, headY: 52, shY: 100, hipY: 206, sw: 32, hw: 22,
          muscles: ["mdelt"],
          legs: [
            { hip: [cx - 16, 206], knee: [cx - 22, 280], ankle: [cx - 20, 346], toe: [cx + 8, 358] },
            { hip: [cx + 16, 206], knee: [cx + 24, 280], ankle: [cx + 26, 346], toe: [cx + 56, 358] }
          ],
          arms: [
            { shoulder: [cx - 32, 100], elbow: [cx - 70, 108], hand: [cx - 112, 96], db: "plate" },
            { shoulder: [cx + 32, 100], elbow: [cx + 70, 108], hand: [cx + 112, 96], db: "plate" }
          ]
        });
        g.db(cx - 112, 96, "plate");
        g.db(cx + 112, 96, "plate");
      }
    },
    rdl: {
      start(g) {
        g.floor(368);
        g.person(stand({
          muscles: ["hams", "glutes"],
          arms: [
            { elbow: [176, 168], hand: [178, 214], far: true, ghost: true, db: "plate" },
            { elbow: [164, 172], hand: [166, 218], db: "plate" }
          ]
        }));
      },
      end(g) {
        g.floor(368);
        g.person({
          front: [0.2, 1], legFront: [1, 0], hip: [196, 176], shoulder: [92, 148],
          legs: [
            { knee: [214, 250], ankle: [176, 342], toe: [210, 356], far: true, ghost: true },
            { knee: [200, 256], ankle: [162, 346], toe: [196, 360] }
          ],
          arms: [
            { elbow: [118, 196], hand: [108, 250], far: true, ghost: true, db: "plate" },
            { elbow: [108, 202], hand: [98, 256], db: "plate" }
          ],
          muscles: ["hams", "glutes", "erectors"]
        });
      }
    },
    hammer: {
      start(g) {
        g.floor(368);
        g.person(stand({
          muscles: ["biceps"],
          arms: [
            { elbow: [178, 168], hand: [182, 250], far: true, ghost: true, db: "hammer" },
            { elbow: [166, 172], hand: [170, 254], db: "hammer" }
          ]
        }));
      },
      end(g) {
        g.floor(368);
        g.person(stand({
          muscles: ["biceps"],
          arms: [
            { elbow: [176, 150], hand: [188, 108], far: true, ghost: true, db: "hammer" },
            { elbow: [164, 154], hand: [176, 112], db: "hammer" }
          ]
        }));
      }
    },
    trizeps_strecker: {
      start(g) {
        g.seat(70, 250);
        g.pad(150, 168, 90, 16);
        g.person({
          front: [1, 0], hip: [112, 234], shoulder: [108, 128],
          legs: [
            { knee: [176, 286], ankle: [196, 344], toe: [228, 356], far: true, ghost: true },
            { knee: [164, 292], ankle: [184, 348], toe: [218, 360] }
          ],
          arms: [
            { elbow: [196, 160], hand: [188, 118], far: true, ghost: true },
            { elbow: [188, 164], hand: [180, 122] }
          ],
          muscles: ["triceps"]
        });
      },
      end(g) {
        g.seat(70, 250);
        g.pad(150, 168, 90, 16);
        g.person({
          front: [1, 0], hip: [112, 234], shoulder: [108, 128],
          legs: [
            { knee: [176, 286], ankle: [196, 344], toe: [228, 356], far: true, ghost: true },
            { knee: [164, 292], ankle: [184, 348], toe: [218, 360] }
          ],
          arms: [
            { elbow: [196, 160], hand: [250, 156], far: true, ghost: true },
            { elbow: [188, 164], hand: [242, 160] }
          ],
          muscles: ["triceps"]
        });
      }
    },
    brustpresse: {
      start(g) {
        g.seat(70, 236);
        g.tower(40, 80, 200);
        g.person(stand({
          hip: [112, 220], shoulder: [118, 124],
          legs: [
            { knee: [176, 276], ankle: [196, 340], toe: [228, 352], far: true, ghost: true },
            { knee: [164, 282], ankle: [184, 344], toe: [218, 356] }
          ],
          arms: [
            { elbow: [150, 168], hand: [186, 140], far: true, ghost: true },
            { elbow: [142, 174], hand: [178, 146] }
          ],
          muscles: ["chest", "triceps", "fdelt"]
        }));
        g.bar(168, 136, 196, 154);
      },
      end(g) {
        g.seat(70, 236);
        g.tower(40, 80, 200);
        g.person(stand({
          hip: [112, 220], shoulder: [118, 124],
          legs: [
            { knee: [176, 276], ankle: [196, 340], toe: [228, 352], far: true, ghost: true },
            { knee: [164, 282], ankle: [184, 344], toe: [218, 356] }
          ],
          arms: [
            { elbow: [176, 124], hand: [230, 118], far: true, ghost: true },
            { elbow: [168, 128], hand: [222, 122] }
          ],
          muscles: ["chest", "triceps", "fdelt"]
        }));
        g.bar(214, 112, 242, 128);
      }
    },
    multipresse: {
      start(g) {
        g.bench(36, 214, 280);
        g.raw(`<rect x="318" y="36" width="14" height="250" rx="3" fill="#2a2a2a"/>`);
        g.person({
          front: [0, -1], hip: [228, 196], shoulder: [116, 190],
          legs: [
            { knee: [286, 188], ankle: [302, 262], toe: [332, 276] }
          ],
          arms: [
            { elbow: [158, 226], hand: [124, 162] }
          ],
          muscles: ["chest", "triceps", "fdelt"]
        });
        g.bar(96, 156, 150, 168);
      },
      end(g) {
        g.bench(36, 214, 280);
        g.raw(`<rect x="318" y="36" width="14" height="250" rx="3" fill="#2a2a2a"/>`);
        g.person({
          front: [0, -1], hip: [228, 196], shoulder: [116, 190],
          legs: [
            { knee: [286, 188], ankle: [302, 262], toe: [332, 276] }
          ],
          arms: [
            { elbow: [142, 138], hand: [120, 96] }
          ],
          muscles: ["chest", "triceps", "fdelt"]
        });
        g.bar(96, 88, 154, 102);
      }
    },
    deadbug: {
      start(g) {
        g.mat(28, 228, 300);
        g.person({
          front: [0, -1], hip: [188, 208], shoulder: [112, 204],
          legs: [
            { knee: [196, 132], ankle: [156, 118], toe: [138, 114] }
          ],
          arms: [
            { elbow: [112, 148], hand: [112, 88] }
          ],
          muscles: ["abs"]
        });
      },
      end(g) {
        g.mat(16, 228, 330);
        g.person({
          front: [0, -1], hip: [176, 208], shoulder: [112, 204],
          legs: [
            { knee: [240, 202], ankle: [300, 198], toe: [332, 196] }
          ],
          arms: [
            { elbow: [72, 202], hand: [24, 198] }
          ],
          muscles: ["abs"]
        });
      }
    },
    trizeps_ueberkopf: {
      start(g) {
        g.floor(368);
        g.tower(36, 20, 280);
        g.person(stand({
          muscles: ["triceps"],
          arms: [
            { elbow: [176, 92], hand: [156, 130], far: true, ghost: true },
            { elbow: [168, 96], hand: [148, 134] }
          ]
        }));
        g.cable(44, 32, 140, 140);
        g.rope(148, 138, false);
      },
      end(g) {
        g.floor(368);
        g.tower(36, 20, 280);
        g.person(stand({
          muscles: ["triceps"],
          arms: [
            { elbow: [178, 90], hand: [214, 78], far: true, ghost: true },
            { elbow: [170, 94], hand: [206, 82] }
          ]
        }));
        g.cable(44, 32, 200, 90);
        g.rope(210, 78, true);
      }
    },
    beinpresse: {
      start(g) {
        g.raw(`<rect x="40" y="150" width="20" height="150" rx="4" fill="#2a2a2a"/><rect x="40" y="168" width="70" height="18" rx="5" fill="#3c3c3c"/>`);
        g.pad(230, 70, 18, 150);
        g.person({
          front: [1, 0], hip: [96, 160], shoulder: [70, 168],
          legs: [
            { knee: [160, 120], ankle: [214, 150], toe: [236, 140], far: true, ghost: true },
            { knee: [150, 132], ankle: [206, 160], toe: [230, 150] }
          ],
          arms: [
            { elbow: [86, 200], hand: [70, 214], far: true, ghost: true, work: false },
            { elbow: [78, 206], hand: [62, 220], work: false }
          ],
          muscles: ["quads", "glutes"]
        });
      },
      end(g) {
        g.raw(`<rect x="40" y="150" width="20" height="150" rx="4" fill="#2a2a2a"/><rect x="40" y="168" width="70" height="18" rx="5" fill="#3c3c3c"/>`);
        g.pad(300, 78, 18, 150);
        g.person({
          front: [1, 0], hip: [96, 160], shoulder: [70, 168],
          legs: [
            { knee: [176, 108], ankle: [268, 128], toe: [300, 120], far: true, ghost: true },
            { knee: [166, 118], ankle: [258, 138], toe: [292, 130] }
          ],
          arms: [
            { elbow: [86, 200], hand: [70, 214], far: true, ghost: true, work: false },
            { elbow: [78, 206], hand: [62, 220], work: false }
          ],
          muscles: ["quads", "glutes"]
        });
      }
    },
    hipthrust: {
      start(g) {
        g.bench(36, 168, 120);
        g.floor(300);
        g.person({
          front: [0, -1], hip: [168, 210], shoulder: [92, 176],
          legs: [
            { knee: [210, 168], ankle: [214, 250], toe: [246, 292], far: true, ghost: true },
            { knee: [198, 176], ankle: [202, 258], toe: [236, 298] }
          ],
          arms: [
            { elbow: [70, 196], hand: [48, 188], far: true, ghost: true, work: false },
            { elbow: [64, 202], hand: [42, 194], work: false }
          ],
          muscles: ["glutes", "hams"]
        });
      },
      end(g) {
        g.bench(36, 168, 120);
        g.floor(300);
        g.person({
          front: [0, -1], hip: [176, 150], shoulder: [96, 168],
          legs: [
            { knee: [230, 150], ankle: [230, 250], toe: [262, 292], far: true, ghost: true },
            { knee: [216, 156], ankle: [216, 258], toe: [250, 298] }
          ],
          arms: [
            { elbow: [74, 190], hand: [50, 184], far: true, ghost: true, work: false },
            { elbow: [66, 196], hand: [44, 190], work: false }
          ],
          muscles: ["glutes", "hams"]
        });
      }
    },
    liegestuetz: {
      start(g) {
        g.floor(250);
        g.person({
          front: [0, 1], hip: [196, 148], shoulder: [112, 140],
          legs: [
            { knee: [250, 156], ankle: [304, 164], toe: [332, 210], far: true, ghost: true },
            { knee: [240, 164], ankle: [294, 172], toe: [322, 218] }
          ],
          arms: [
            { elbow: [112, 176], hand: [112, 232], far: true, ghost: true },
            { elbow: [100, 182], hand: [100, 238] }
          ],
          muscles: ["chest", "triceps", "fdelt"]
        });
      },
      end(g) {
        g.floor(250);
        g.person({
          front: [0, 1], hip: [196, 196], shoulder: [112, 190],
          legs: [
            { knee: [250, 202], ankle: [304, 208], toe: [332, 236], far: true, ghost: true },
            { knee: [240, 208], ankle: [294, 214], toe: [322, 242] }
          ],
          arms: [
            { elbow: [78, 196], hand: [112, 236], far: true, ghost: true },
            { elbow: [66, 202], hand: [100, 242] }
          ],
          muscles: ["chest", "triceps", "fdelt"]
        });
      }
    },
    bandrudern: {
      start(g) {
        g.floor(368);
        g.raw(`<rect x="286" y="70" width="18" height="250" rx="3" fill="#2a2a2a"/>`);
        g.person(stand({
          muscles: ["lats", "biceps", "traps"],
          arms: [
            { elbow: [196, 150], hand: [236, 146], far: true, ghost: true },
            { elbow: [186, 156], hand: [226, 152] }
          ]
        }));
        g.cable(294, 150, 230, 148);
      },
      end(g) {
        g.floor(368);
        g.raw(`<rect x="286" y="70" width="18" height="250" rx="3" fill="#2a2a2a"/>`);
        g.person(stand({
          muscles: ["lats", "biceps", "traps"],
          arms: [
            { elbow: [132, 124], hand: [168, 168], far: true, ghost: true },
            { elbow: [122, 130], hand: [158, 174] }
          ]
        }));
        g.cable(294, 150, 170, 168);
      }
    },
    kniebeuge: {
      start(g) {
        g.floor(368);
        g.person(stand({
          muscles: ["quads", "glutes"],
          arms: [
            { elbow: [120, 130], hand: [96, 108], far: true, ghost: true },
            { elbow: [112, 136], hand: [88, 114] }
          ]
        }));
      },
      end(g) {
        g.floor(368);
        g.person({
          front: [0.85, 0.4], hip: [176, 240], shoulder: [140, 136],
          legs: [
            { knee: [214, 296], ankle: [156, 346], toe: [190, 358], far: true, ghost: true },
            { knee: [198, 304], ankle: [142, 350], toe: [176, 362] }
          ],
          arms: [
            { elbow: [112, 168], hand: [86, 150], far: true, ghost: true },
            { elbow: [104, 174], hand: [78, 156] }
          ],
          muscles: ["quads", "glutes"]
        });
      }
    },
    plank: {
      start(g) {
        g.floor(250);
        g.person({
          front: [0, 1], hip: [176, 196], shoulder: [112, 168],
          legs: [
            { knee: [210, 230], ankle: [176, 236], toe: [160, 242], work: false }
          ],
          arms: [
            { elbow: [112, 210], hand: [78, 236] }
          ],
          muscles: ["abs"]
        });
      },
      end(g) {
        g.floor(250);
        g.person({
          front: [0, 1], hip: [200, 156], shoulder: [112, 150],
          legs: [
            { knee: [256, 162], ankle: [310, 168], toe: [338, 214], far: true, ghost: true },
            { knee: [246, 170], ankle: [300, 176], toe: [328, 222] }
          ],
          arms: [
            { elbow: [112, 196], hand: [78, 232], far: true, ghost: true },
            { elbow: [100, 202], hand: [68, 238] }
          ],
          muscles: ["abs"]
        });
      }
    },
    seitstutz: {
      start(g) {
        g.floor(250);
        g.person({
          front: [0, 1], hip: [150, 196], shoulder: [214, 188],
          legs: [
            { knee: [96, 230], ankle: [70, 236], toe: [48, 242] }
          ],
          arms: [
            { elbow: [230, 214], hand: [214, 242] }
          ],
          muscles: ["obliques", "abs"]
        });
      },
      end(g) {
        g.floor(250);
        g.person({
          front: [0, 1], hip: [150, 150], shoulder: [230, 146],
          legs: [
            { knee: [90, 156], ankle: [40, 162], toe: [22, 200], far: true, ghost: true },
            { knee: [84, 164], ankle: [34, 170], toe: [16, 208] }
          ],
          arms: [
            { elbow: [248, 186], hand: [236, 236] },
            { elbow: [210, 124], hand: [176, 118], far: true, work: false }
          ],
          muscles: ["obliques", "abs"]
        });
      }
    },
    birddog: {
      start(g) {
        g.mat(40, 230, 270);
        g.person({
          front: [0, 1], hip: [210, 160], shoulder: [120, 156],
          legs: [
            { knee: [210, 220], ankle: [168, 226], toe: [150, 230], far: true },
            { knee: [224, 226], ankle: [184, 232], toe: [166, 236] }
          ],
          arms: [
            { elbow: [120, 190], hand: [120, 226], far: true },
            { elbow: [108, 196], hand: [108, 232] }
          ],
          muscles: ["abs", "erectors", "glutes"]
        });
      },
      end(g) {
        g.mat(70, 230, 200);
        g.person({
          front: [0, 1], hip: [200, 160], shoulder: [130, 156],
          legs: [
            { knee: [200, 220], ankle: [164, 226], toe: [146, 230], far: true, work: false },
            { knee: [250, 150], ankle: [310, 142], toe: [340, 138] }
          ],
          arms: [
            { elbow: [130, 196], hand: [130, 228], far: true, work: false },
            { elbow: [70, 150], hand: [24, 146] }
          ],
          muscles: ["abs", "erectors", "glutes"]
        });
      }
    },
    crunch: {
      start(g) {
        g.mat(40, 220, 280);
        g.person({
          front: [0, -1], hip: [200, 200], shoulder: [120, 196],
          legs: [
            { knee: [250, 150], ankle: [210, 230], toe: [184, 236], far: true, ghost: true },
            { knee: [262, 158], ankle: [222, 236], toe: [196, 242] }
          ],
          arms: [
            { elbow: [96, 170], hand: [78, 150], far: true, ghost: true, work: false },
            { elbow: [88, 176], hand: [70, 156], work: false }
          ],
          muscles: ["abs"]
        });
      },
      end(g) {
        g.mat(40, 220, 280);
        g.person({
          front: [0.2, -1], hip: [210, 200], shoulder: [150, 150],
          legs: [
            { knee: [258, 146], ankle: [214, 226], toe: [188, 234], far: true, ghost: true },
            { knee: [270, 154], ankle: [226, 232], toe: [200, 240] }
          ],
          arms: [
            { elbow: [124, 124], hand: [108, 108], far: true, ghost: true, work: false },
            { elbow: [116, 130], hand: [100, 114], work: false }
          ],
          muscles: ["abs"]
        });
      }
    },
    revcrunch: {
      start(g) {
        g.mat(36, 230, 290);
        g.person({
          front: [0, -1], hip: [160, 210], shoulder: [90, 206],
          legs: [
            { knee: [200, 140], ankle: [160, 128], toe: [142, 124], far: true, ghost: true },
            { knee: [212, 148], ankle: [172, 136], toe: [154, 132] }
          ],
          arms: [
            { elbow: [60, 214], hand: [30, 210], far: true, ghost: true, work: false },
            { elbow: [52, 220], hand: [24, 216], work: false }
          ],
          muscles: ["abs"]
        });
      },
      end(g) {
        g.mat(36, 230, 290);
        g.person({
          front: [0, -1], hip: [150, 168], shoulder: [90, 206],
          legs: [
            { knee: [176, 112], ankle: [140, 104], toe: [122, 100], far: true, ghost: true },
            { knee: [188, 120], ankle: [152, 112], toe: [134, 108] }
          ],
          arms: [
            { elbow: [60, 214], hand: [30, 210], far: true, ghost: true, work: false },
            { elbow: [52, 220], hand: [24, 216], work: false }
          ],
          muscles: ["abs"]
        });
      }
    },
    pallof: {
      start(g) {
        g.floor(368);
        g.tower(40, 40, 270);
        g.person(stand({
          muscles: ["abs", "obliques"],
          arms: [
            { elbow: [176, 150], hand: [156, 140], far: true, ghost: true },
            { elbow: [166, 156], hand: [148, 146] }
          ]
        }));
        g.cable(48, 150, 140, 146);
      },
      end(g) {
        g.floor(368);
        g.tower(40, 40, 270);
        g.person(stand({
          muscles: ["abs", "obliques"],
          arms: [
            { elbow: [190, 146], hand: [236, 142], far: true, ghost: true },
            { elbow: [182, 152], hand: [228, 148] }
          ]
        }));
        g.cable(48, 150, 220, 148);
      }
    }
  };

  function render(draw) {
    const parts = [];
    draw(api(parts));
    return parts.join("");
  }

  function illustration(id, mode) {
    const spec = DRAW[id];
    const cue = CUE[id] || ["", ""];
    if (!spec) {
      return `<svg class="fig" viewBox="0 0 740 400" role="img"><rect width="740" height="400" fill="#fff"/><text x="370" y="200" text-anchor="middle" font-size="28" font-family="sans-serif" fill="#111">${id}</text></svg>`;
    }
    const left = render(spec.start);
    const right = render(spec.end);
    const label = cue[0] + ". " + cue[1];
    if (mode === "start") {
      return `<svg class="fig" viewBox="0 0 368 400" role="img" aria-label="${label}"><rect width="368" height="400" fill="#fff"/><g>${left}</g></svg>`;
    }
    if (mode === "end") {
      return `<svg class="fig" viewBox="0 0 368 400" role="img" aria-label="${label}"><rect width="368" height="400" fill="#fff"/><g>${right}</g></svg>`;
    }
    return `<svg class="fig" viewBox="0 0 740 400" role="img" aria-label="${label}"><rect width="740" height="400" fill="#fff"/><g>${left}</g><line x1="370" y1="18" x2="370" y2="382" stroke="#ececec" stroke-width="3"/><g transform="translate(372,0)">${right}</g></svg>`;
  }

  function cue(id) { return CUE[id] || null; }
  function has(id) { return !!DRAW[id] && !!CUE[id]; }

  return { illustration, cue, has };
})();
