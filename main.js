// BlitX · Sitio web + Agente WhatsApp

/* ---------- Demo de chat ----------
   Conversaciones de ejemplo (negocios ficticios). Cada paso:
   { from: "in"|"out"|"note"|"audio", text, t: hora } */
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

const chat = document.getElementById("demoChat");
const statusEl = document.getElementById("demoStatus");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let runId = 0;

const wait = (ms) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));
const esc = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

function bubble(step) {
  const el = document.createElement("div");
  if (step.from === "note") {
    el.className = "msg msg--note";
    el.textContent = "✓ " + step.text;
  } else if (step.from === "audio") {
    el.className = "msg msg--in msg--audio";
    el.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg><span class="wave"></span><span style="font-size:.75rem;opacity:.7">' + step.text + "</span>";
    el.setAttribute("aria-label", "Mensaje de voz del cliente");
  } else {
    el.className = "msg msg--" + step.from;
    el.innerHTML = esc(step.text).replace(/\n/g, "<br>") + "<small>" + step.t + "</small>";
  }
  return el;
}

async function play(key) {
  const id = ++runId;
  const d = DEMOS[key];
  document.getElementById("demoName").textContent = d.name;
  document.getElementById("demoAvatar").textContent = d.avatar;
  document.getElementById("demoClock").textContent = d.clock;
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
    await wait(step.from === "in" || step.from === "audio" ? 700 : 1500);
  }
  // Pasa al siguiente rubro solo si nadie tocó las pestañas
  await wait(4500);
  if (id === runId && autoRotate) {
    const keys = Object.keys(DEMOS);
    select(keys[(keys.indexOf(key) + 1) % keys.length]);
  }
}

let autoRotate = true;
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

// Arranca cuando el teléfono es visible
const phoneObs = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) { play("pasteleria"); phoneObs.disconnect(); }
}, { threshold: 0.3 });
phoneObs.observe(document.querySelector(".phone"));

/* ---------- Calculadora ---------- */
const clp = (n) => "$" + Math.round(n).toLocaleString("es-CL");
const $ = (id) => document.getElementById(id);
function calc() {
  const msgs = +$("cMsgs").value, ticket = +$("cTicket").value, rate = +$("cRate").value;
  $("oMsgs").textContent = msgs;
  $("oTicket").textContent = clp(ticket);
  $("oRate").textContent = rate;
  $("cLoss").textContent = clp(msgs * 30 * (rate / 10) * ticket);
}
["cMsgs", "cTicket", "cRate"].forEach((id) => $(id).addEventListener("input", calc));
calc();

/* ---------- Reveal + botón flotante ---------- */
// Las clases se agregan ANTES de crear el observer: si no, esos elementos nunca se observan y quedan invisibles
const revealTargets = document.querySelectorAll("section h2, .calc, .svc, .abilities, .nots, .case__stats, .works, .steps, .plans, .guarantee__in, .founders__photos, .faq__list");
revealTargets.forEach((el) => el.classList.add("reveal"));
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
}, { threshold: 0.12 });
revealTargets.forEach((el) => io.observe(el));

const floatWa = document.querySelector(".float-wa");
const hero = document.querySelector(".hero");
new IntersectionObserver(([e]) => floatWa.classList.toggle("is-on", !e.isIntersecting), { threshold: 0.1 }).observe(hero);
