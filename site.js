// BlitX · "Una noche" · código propio de la página (el motor scrollcraft.js no se toca)
(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (id) => document.getElementById(id);
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const root = document.documentElement;

  /* ================================================================
     1. Santiago dibujado en código: cordillera y edificios (SVG)
     ================================================================ */
  function rng(seed) { // mulberry32: determinista, el skyline es siempre el mismo
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const NS = "http://www.w3.org/2000/svg";
  const el = (name, attrs) => { const n = document.createElementNS(NS, name); for (const k in attrs) n.setAttribute(k, attrs[k]); return n; };

  function ridge(r, base, amp, step) {
    const pts = [];
    for (let x = -20; x <= 1620; x += step) {
      const y = base
        - amp * (0.55 * Math.sin(x / 210 + 1.3) + 0.3 * Math.sin(x / 83 + 0.4) + 0.15 * Math.sin(x / 31))
        - amp * 0.35 * r();
      pts.push([x, y]);
    }
    return pts;
  }
  function drawAndes(svg) {
    const dawn = svg.classList.contains("andes--dawn");
    const r = rng(7);
    const back = ridge(r, 250, 95, 24);
    const front = ridge(r, 300, 70, 18);
    const toPath = (pts) => "M" + pts.map((p) => p[0] + " " + p[1].toFixed(1)).join(" L") + " L1620 420 L-20 420 Z";
    const toLine = (pts) => "M" + pts.map((p) => p[0] + " " + p[1].toFixed(1)).join(" L");
    const defs = el("defs", {});
    const g1 = el("linearGradient", { id: "ag" + (dawn ? "d" : "n"), x1: 0, y1: 0, x2: 0, y2: 1 });
    g1.append(el("stop", { offset: 0, "stop-color": dawn ? "#2A2B55" : "#121A3E" }), el("stop", { offset: 1, "stop-color": dawn ? "#141633" : "#0A0F26" }));
    defs.append(g1);
    svg.append(defs);
    svg.append(el("path", { d: toPath(back), fill: dawn ? "#22234A" : "#0E1534", opacity: dawn ? 0.9 : 0.85 }));
    svg.append(el("path", { d: toLine(back), fill: "none", stroke: dawn ? "rgba(255,196,160,.38)" : "rgba(205,218,255,.16)", "stroke-width": 1.4 }));
    svg.append(el("path", { d: toPath(front), fill: "url(#ag" + (dawn ? "d" : "n") + ")" }));
    svg.append(el("path", { d: toLine(front), fill: "none", stroke: dawn ? "rgba(255,196,160,.22)" : "rgba(205,218,255,.09)", "stroke-width": 1.2 }));
  }

  function drawCity(svg) {
    const dawn = svg.dataset.city === "dawn";
    const r = rng(dawn ? 11 : 11); // la misma ciudad, de noche y al amanecer
    const lit = dawn ? 0.05 : 0.13;
    const back = el("g", { fill: dawn ? "#121530" : "#0A0F26" });
    const front = el("g", { fill: dawn ? "#0A0C1E" : "#060915" });
    const wins = el("g", {});
    const addWindows = (x, y, w, h, rr) => {
      for (let wy = y + 10; wy < 412; wy += 13) {
        for (let wx = x + 6; wx < x + w - 6; wx += 9) {
          if (rr() < lit) {
            const warm = rr() < (dawn ? 0.6 : 0.25);
            wins.append(el("rect", { x: wx, y: wy, width: 3.2, height: 5, rx: 0.6,
              fill: warm ? "#FFD9A8" : "#DCE7FF", opacity: (0.35 + rr() * 0.5).toFixed(2) }));
          }
        }
      }
    };
    // fila de atrás: más alta y más clara (distancia)
    let x = -10;
    while (x < 1610) {
      const w = 40 + r() * 70, h = 90 + r() * 150;
      back.append(el("rect", { x: x.toFixed(1), y: (420 - h).toFixed(1), width: w.toFixed(1), height: h.toFixed(1) }));
      x += w + 2;
    }
    // fila de adelante, con ventanas
    const wr = rng(dawn ? 23 : 5);
    x = -10;
    while (x < 1610) {
      const w = 34 + r() * 76, h = 40 + r() * 120 * (r() < 0.15 ? 1.8 : 1);
      if (x > 1040 && x < 1130) { // Gran Torre Costanera
        const cx = 1100, top = 18;
        front.append(el("path", { d: `M${cx - 30} 420 L${cx - 24} ${top + 30} L${cx - 14} ${top} L${cx + 14} ${top} L${cx + 24} ${top + 30} L${cx + 30} 420 Z` }));
        addWindows(cx - 22, top + 40, 44, 380, wr);
        wins.append(el("rect", { x: cx - 1, y: top - 16, width: 2, height: 16, fill: dawn ? "#2A2D55" : "#1A2040" }));
        wins.append(el("circle", { cx: cx, cy: top - 17, r: 2.2, fill: "#FF5B5B", opacity: dawn ? 0.4 : 0.9, class: "beacon" }));
        x = cx + 34;
        continue;
      }
      front.append(el("rect", { x: x.toFixed(1), y: (420 - h).toFixed(1), width: w.toFixed(1), height: h.toFixed(1) }));
      addWindows(x, 420 - h, w, h, wr);
      x += w + 1.5 + r() * 6;
    }
    svg.append(back, front, wins);
  }
  document.querySelectorAll("[data-andes]").forEach(drawAndes);
  document.querySelectorAll("[data-city]").forEach(drawCity);

  /* ================================================================
     2. Motor de scroll
     ================================================================ */
  if (window.ScrollCraft) window.ScrollCraft.mount(document.body);

  /* ================================================================
     3. Demo de chat del hero (contenido idéntico al sitio publicado)
     ================================================================ */
  const DEMOS = {
    pasteleria: {
      name: "Dulce Hogar Pastelería", avatar: "D", clock: "23:47",
      steps: [
        { from: "in", text: "hola! tienen torta mil hojas para 20 personas? es para el sábado", t: "23:47" },
        { from: "out", text: "¡Hola! Sí 🙌 La Mil Hojas de 20 personas está a $32.000. ¿La quieres con manjar o con manjar y frambuesa?", t: "23:47" },
        { from: "in", text: "con frambuesa porfa. y le pueden poner feliz cumple sofi?", t: "23:48" },
        { from: "out", text: "¡Claro! La dedicatoria va sin costo. Te resumo:\n• Mil Hojas frambuesa, 20 personas\n• \"Feliz cumple Sofi\"\n• Retiro el sábado\n¿A nombre de quién la dejo y a qué hora pasas?", t: "23:48" },
        { from: "in", text: "Camila, tipo 12", t: "23:49" },
        { from: "out", text: "Listo, Camila. Te paso con el equipo para que te confirmen el pedido y te manden los datos de pago a primera hora 😊", t: "23:49" },
        { from: "note", text: "Pedido completo enviado al panel del dueño" }
      ]
    },
    restaurante: {
      name: "Sabor de Barrio", avatar: "S", clock: "21:12",
      steps: [
        { from: "in", text: "buenas, hacen delivery a Ñuñoa?", t: "21:12" },
        { from: "out", text: "¡Buenas! Sí, despachamos a Ñuñoa. El envío cuesta $2.500 y demora entre 35 y 45 minutos. ¿Qué te gustaría pedir?", t: "21:12" },
        { from: "audio", text: "0:09", t: "21:13" },
        { from: "out", text: "Anotado 🎧 Entonces:\n• 2 lomitos completos ($7.900 c/u)\n• 1 papas fritas grandes ($3.500)\n• 2 bebidas 1,5 L ($2.200 c/u)\nTotal con despacho: $25.700\n¿Me das la dirección?", t: "21:13" },
        { from: "in", text: "Irarrázaval 3400 depto 502", t: "21:14" },
        { from: "out", text: "Perfecto. Le paso tu pedido a la cocina para que te confirmen y te digan cómo pagar 🙌", t: "21:14" },
        { from: "note", text: "Entendió un audio y armó el pedido con precios de la carta" }
      ]
    },
    barberia: {
      name: "Barbería Norte", avatar: "B", clock: "06:58",
      steps: [
        { from: "in", text: "hola, tienen hora hoy para corte y barba?", t: "06:58" },
        { from: "out", text: "¡Hola! Corte + barba está a $14.000 y dura unos 50 minutos. Hoy abrimos a las 10:00. ¿Prefieres en la mañana o en la tarde?", t: "06:58" },
        { from: "in", text: "en la tarde, después de las 6", t: "06:59" },
        { from: "out", text: "Después de las 18:00 suelen quedar horas a las 18:30 y 19:30. ¿Te anoto para alguna? Te la confirma el barbero apenas abra.", t: "06:59" },
        { from: "in", text: "19:30, a nombre de Matías", t: "07:00" },
        { from: "out", text: "Anotado, Matías: corte + barba, hoy a las 19:30. Te escribimos para confirmar antes de las 10 💈", t: "07:00" },
        { from: "note", text: "Solicitud de hora lista para que el barbero confirme" }
      ]
    }
  };

  // Lo que el visitante vio esta noche: alimenta el resumen del amanecer
  const SUMMARY = {
    pasteleria: ["Dulce Hogar Pastelería", "Mil Hojas para 20 personas, pedido listo para confirmar"],
    restaurante: ["Sabor de Barrio", "delivery a Ñuñoa, pedido armado con los precios de la carta"],
    barberia: ["Barbería Norte", "corte + barba hoy a las 19:30, lista para que el barbero confirme"]
  };
  const seen = new Set();

  const chat = $("demoChat");
  const statusEl = $("demoStatus");
  let runId = 0, autoRotate = true;
  const wait = (ms) => new Promise((r) => setTimeout(r, reduce ? Math.min(ms, 120) : ms));
  const esc = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

  function bubble(step) {
    const b = document.createElement("div");
    if (step.from === "note") {
      b.className = "msg msg--note";
      b.textContent = "✓ " + step.text;
    } else if (step.from === "audio") {
      b.className = "msg msg--in msg--audio";
      b.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg><span class="wave"></span><span style="font-size:.75rem;opacity:.7">' + step.text + "</span>";
      b.setAttribute("aria-label", "Mensaje de voz del cliente");
    } else {
      b.className = "msg msg--" + step.from;
      b.innerHTML = esc(step.text).replace(/\n/g, "<br>") + "<small>" + step.t + "</small>";
    }
    return b;
  }

  async function play(key) {
    const id = ++runId;
    const d = DEMOS[key];
    $("demoName").textContent = d.name;
    $("demoAvatar").textContent = d.avatar;
    $("demoClock").textContent = d.clock;
    chat.innerHTML = "";
    statusEl.textContent = "en línea";
    for (const step of d.steps) {
      if (id !== runId) return;
      if (step.from === "out") {
        statusEl.textContent = "escribiendo...";
        const t = document.createElement("div");
        t.className = "typing";
        t.innerHTML = "<i></i><i></i><i></i>";
        chat.appendChild(t);
        chat.scrollTop = chat.scrollHeight;
        await wait(1100);
        if (id !== runId) return;
        t.remove();
        statusEl.textContent = "en línea";
      } else {
        await wait(step.from === "note" ? 500 : 900);
        if (id !== runId) return;
      }
      chat.appendChild(bubble(step));
      chat.scrollTo({ top: chat.scrollHeight, behavior: reduce ? "auto" : "smooth" });
      if (step.from === "out") seen.add(key);
      await wait(step.from === "in" || step.from === "audio" ? 700 : 1500);
    }
    await wait(4500);
    if (id === runId && autoRotate) {
      const keys = Object.keys(DEMOS);
      select(keys[(keys.indexOf(key) + 1) % keys.length]);
    }
  }
  const tabs = document.querySelectorAll(".demo-tab");
  function select(key) {
    tabs.forEach((b) => {
      const on = b.dataset.demo === key;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-selected", on);
    });
    play(key);
  }
  tabs.forEach((b) => b.addEventListener("click", () => { autoRotate = false; select(b.dataset.demo); }));
  const phoneObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { play("pasteleria"); phoneObs.disconnect(); }
  }, { threshold: 0.3 });
  phoneObs.observe(document.querySelector(".phone"));

  /* ================================================================
     4. Calculadora (misma fórmula que el sitio publicado)
     ================================================================ */
  const clp = (n) => "$" + Math.round(n).toLocaleString("es-CL");
  let lossValue = 810000;
  function fill(input) {
    const p = (input.value - input.min) / (input.max - input.min) * 100;
    input.style.setProperty("--fill", p + "%");
  }
  function calc() {
    const msgs = +$("cMsgs").value, ticket = +$("cTicket").value, rate = +$("cRate").value;
    $("oMsgs").textContent = msgs;
    $("oTicket").textContent = clp(ticket);
    $("oRate").textContent = rate;
    lossValue = msgs * 30 * (rate / 10) * ticket;
    $("cLoss").textContent = clp(lossValue);
    ["cMsgs", "cTicket", "cRate"].forEach((i) => fill($(i)));
  }
  ["cMsgs", "cTicket", "cRate"].forEach((i) => $(i).addEventListener("input", () => { calc(); renderMorning(); }));
  calc();

  /* ================================================================
     5. FIRMA: el reloj de la noche. La posición del scroll ES la hora.
     ================================================================ */
  const toMin = (s) => { const [h, m] = s.split(":").map(Number); return h >= 12 ? (h - 24) * 60 + m : h * 60 + m; };
  const fmt = (min) => { const m = ((Math.round(min) % 1440) + 1440) % 1440; return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"); };
  const anchors = Array.from(document.querySelectorAll("[data-hour]")).map((s) => ({ el: s, min: toMin(s.dataset.hour), y: 0 }));
  const navLinks = Array.from(document.querySelectorAll(".night__list a"));
  function measure() { anchors.forEach((a) => { a.y = a.el.getBoundingClientRect().top + window.scrollY; }); }

  // El fondo de la página se aclara de a poco: noche cerrada a amanecer
  const GROUND = [[-13, [5, 6, 14]], [150, [7, 10, 30]], [330, [8, 12, 36]], [432, [12, 18, 46]]];
  function ground(min) {
    for (let i = 0; i < GROUND.length - 1; i++) {
      const [a, ca] = GROUND[i], [b, cb] = GROUND[i + 1];
      if (min <= b) {
        const t = clamp01((min - a) / (b - a));
        return "rgb(" + ca.map((v, k) => Math.round(v + (cb[k] - v) * t)).join(",") + ")";
      }
    }
    return "rgb(" + GROUND[GROUND.length - 1][1].join(",") + ")";
  }

  function nowMinutes() {
    const y = window.scrollY, vh = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    if (y >= max - 4) return anchors[anchors.length - 1].min;
    const r = y + vh * 0.35;
    if (r <= anchors[0].y + vh * 0.35) return anchors[0].min;
    for (let i = 0; i < anchors.length - 1; i++) {
      const a = anchors[i], b = anchors[i + 1];
      if (r < b.y) return a.min + (b.min - a.min) * clamp01((r - a.y) / Math.max(b.y - a.y, 1));
    }
    return anchors[anchors.length - 1].min;
  }

  let lastShown = "";
  let currentMin = anchors[0].min, prevMin = currentMin;
  function updateClock() {
    currentMin = nowMinutes();
    const label = fmt(currentMin);
    if (label !== lastShown) {
      lastShown = label;
      $("clockTime").textContent = label;
      $("clockDay").textContent = currentMin < 0 ? "dom" : "lun";
      root.style.setProperty("--sc-canvas", ground(currentMin));
      root.classList.toggle("is-dawn", currentMin >= 395);
      navLinks.forEach((a, i) => {
        const m = anchors[i] ? anchors[i].min : 0;
        const next = anchors[i + 1] ? anchors[i + 1].min : Infinity;
        a.classList.toggle("is-past", currentMin >= m);
        a.classList.toggle("is-now", currentMin >= m && currentMin < next);
      });
    }
    if (currentMin > prevMin) fireToasts(prevMin, currentMin);
    prevMin = Math.max(prevMin, currentMin);
  }

  // el reloj es la navegación
  const clockBtn = document.querySelector(".clock__btn");
  const night = $("noche");
  function setNight(open) {
    night.hidden = !open;
    clockBtn.setAttribute("aria-expanded", String(open));
    if (open) (night.querySelector(".is-now") || navLinks[0]).focus();
  }
  clockBtn.addEventListener("click", () => setNight(night.hidden));
  night.addEventListener("click", (e) => { if (e.target.closest("a")) setNight(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !night.hidden) { setNight(false); clockBtn.focus(); } });
  document.addEventListener("click", (e) => { if (!night.hidden && !e.target.closest(".clock")) setNight(false); });

  /* ================================================================
     6. Los mensajes de la noche (ejemplos de la demo, rotulados)
     ================================================================ */
  const NOTIFS = [
    { at: 35, key: "restaurante", who: "Sabor de Barrio", msg: "buenas, hacen delivery a Ñuñoa?" },
    { at: 418, key: "barberia", who: "Barbería Norte", msg: "hola, tienen hora hoy para corte y barba?" }
  ];
  const fired = new Set();
  const dawn = $("amanecer");
  const toasts = $("toasts");
  const waIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-wa"/></svg>';
  function fireToasts(from, to) {
    // Si el visitante saltó varias horas de una vez, solo suena la última; y nunca encima del cierre
    const crossed = NOTIFS.filter((n) => !fired.has(n.at) && n.at > from && n.at <= to);
    if (!crossed.length) return;
    crossed.forEach((n) => fired.add(n.at));
    const atDawn = dawn.getBoundingClientRect().top < window.innerHeight * 0.85;
    if (!atDawn && to - from < 90) toast(crossed[crossed.length - 1]);
  }
  function toast(n) {
    const t = document.createElement("div");
    t.className = "toast is-entering";
    t.innerHTML =
      '<p class="toast__top">' + waIcon + "WhatsApp · " + fmt(n.at) + "<em>ejemplo</em></p>" +
      '<p class="toast__who">' + esc(n.who) + "</p>" +
      '<p class="toast__msg">' + esc(n.msg) + "</p>" +
      '<p class="toast__status">Tu agente está escribiendo...</p>';
    toasts.appendChild(t);
    requestAnimationFrame(() => requestAnimationFrame(() => t.classList.remove("is-entering")));
    setTimeout(() => {
      t.classList.add("is-done");
      t.querySelector(".toast__status").textContent = "✓ Respondido por tu agente, en segundos";
      seen.add(n.key);
      renderMorning();
    }, reduce ? 300 : 1500);
    setTimeout(() => { t.classList.add("is-leaving"); setTimeout(() => t.remove(), 320); }, reduce ? 4200 : 5200);
  }

  /* ================================================================
     7. El amanecer: resumen armado con lo que este visitante vio
     ================================================================ */
  function renderMorning() {
    const list = $("mList");
    const keys = ["pasteleria", "restaurante", "barberia"].filter((k) => seen.has(k));
    if (!keys.length) keys.push("pasteleria");
    list.innerHTML = keys.map((k) => "<li><span><b>" + SUMMARY[k][0] + ":</b> " + SUMMARY[k][1] + "</span></li>").join("") +
      "<li><span><b>" + (keys.length === 1 ? "1 conversación" : keys.length + " conversaciones") + "</b> contestadas por tu agente, sin que nadie quedara en visto</span></li>";
    $("mCalc").innerHTML = "Con tus números de la calculadora: <strong>" + clp(lossValue) + "</strong> al mes en ventas que podrías estar perdiendo.";
  }
  renderMorning();

  /* ================================================================
     8. Hero en capas: cordillera, bruma, ciudad, teléfono, tarjeta cercana
     ================================================================ */
  const hero = document.querySelector(".hero");
  const planes = {
    far: document.querySelector('[data-depth="far"]'),
    haze: document.querySelector('[data-depth="haze"]'),
    mid: document.querySelector('[data-depth="mid"]'),
    focal: document.querySelector('[data-depth="focal"]'),
    near: document.querySelector('[data-depth="near"]')
  };
  // [desplazamiento vertical por scroll (fracción del alto del hero), respuesta al puntero en px]
  const RATES = { far: [0.30, -7], haze: [0.22, -10], mid: [0.15, -14], focal: [-0.03, 6], near: [-0.06, 20] };
  let px = 0, py = 0, tx = 0, ty = 0;
  if (finePointer && !reduce) {
    hero.addEventListener("pointermove", (e) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
    });
    hero.addEventListener("pointerleave", () => { tx = 0; ty = 0; });
  }
  function updateHero() {
    if (reduce) return;
    const H = hero.offsetHeight;
    const y = window.scrollY;
    if (y > H * 1.1) return;
    px += (tx - px) * 0.08; py += (ty - py) * 0.08;
    const t = clamp01(y / H);
    for (const k in planes) {
      const [sr, pr] = RATES[k];
      const n = planes[k];
      if (!n) continue;
      n.style.transform = "translate3d(" + (px * pr).toFixed(2) + "px," + (t * H * sr + py * pr * 0.4).toFixed(2) + "px,0)";
    }
  }

  /* ================================================================
     9. Caso Kaiser: las tres sucursales se encienden con el scroll
     ================================================================ */
  const caseEl = document.querySelector(".case");
  const branches = Array.from(document.querySelectorAll(".branch"));
  function updateCase() {
    const p = parseFloat(caseEl.style.getPropertyValue("--sc-p")) || 0;
    branches.forEach((b) => b.classList.toggle("is-lit", reduce ? p > 0 : p >= parseFloat(b.dataset.at)));
    caseEl.style.setProperty("--route", (reduce ? (p > 0 ? 0 : 1) : 1 - clamp01((p - 0.18) / 0.36)).toFixed(3));
  }

  /* ================================================================
     9b. La bandeja del problema: llegan mensajes y nadie contesta
     ================================================================ */
  const inboxRows = Array.from(document.querySelectorAll(".inbox__row"));
  const inboxCount = $("inboxCount");
  let lastCount = -1;
  function updateInbox() {
    // cada mensaje llega cuando el reloj de la barra marca su hora
    let n = 0;
    inboxRows.forEach((r) => {
      const on = reduce || currentMin >= toMin(r.dataset.min);
      if (r.classList.contains("is-in") !== on) r.classList.toggle("is-in", on);
      if (on) n++;
    });
    // en el teléfono solo se ven los 3 más recientes; el contador sigue sumando todos
    inboxRows.forEach((r, i) => r.classList.toggle("is-old", i < n - 3));
    if (n !== lastCount) { lastCount = n; inboxCount.textContent = n; }
  }

  /* ================================================================
     10. Garantía: el sello se dibuja solo
     ================================================================ */
  const guarantee = document.querySelector(".guarantee");
  function updateSeal() {
    const r = guarantee.getBoundingClientRect(), vh = window.innerHeight;
    let g = clamp01((vh * 0.9 - r.top) / (vh * 0.5));
    if (reduce) g = r.top < vh ? 1 : 0;
    guarantee.style.setProperty("--g", g.toFixed(3));
  }

  /* ================================================================
     11. Botón flotante de WhatsApp: aparece después del hero
     ================================================================ */
  const floatWa = document.querySelector(".float-wa");
  function updateFloat() {
    const pastHero = window.scrollY > hero.offsetHeight * 0.8;
    const atDawn = dawn.getBoundingClientRect().top < window.innerHeight * 0.6;
    floatWa.classList.toggle("is-on", pastHero && !atDawn);
  }

  /* ================================================================
     Un solo loop
     ================================================================ */
  measure();
  window.addEventListener("resize", measure);
  window.addEventListener("load", measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  setTimeout(measure, 1200);

  function frame() {
    updateClock();
    updateHero();
    updateCase();
    updateInbox();
    updateSeal();
    updateFloat();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
