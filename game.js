/* OVERCLOCK — a masmorra do chip
   Um chefe por capítulo. Três fases por luta:
   1) Relâmpago (4 alternativas, tempo encolhendo)
   2) Chuva de Termos (clique no termo certo antes de cair)
   3) Digita aí (escreva o termo para o golpe final)                       */
(() => {
'use strict';

// ======================= utilidades =======================
const $ = (s, el = document) => el.querySelector(s);
const app = $('#app');
const rnd = (a) => a[Math.floor(Math.random() * a.length)];
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const SHORT = 22;
const isShort = (s) => s.length <= SHORT;
const byId = Object.fromEntries(ITEMS.map(i => [i.id, i]));
const bossById = Object.fromEntries(BOSSES.map(b => [b.id, b]));

function norm(s) {
  let t = String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  t = t.replace(/,/g, '.').replace(/[→×÷]/g, ' ').replace(/[^a-z0-9.ⁿ²³ ]/g, ' ');
  t = t.replace(/\s+/g, ' ').trim();
  t = t.replace(/^(o|a|os|as|um|uma|no|na|do|da) /, '');
  return t;
}
function lev(a, b) {
  const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}
function checkTyped(item, typed) {
  const t = norm(typed); if (!t) return false;
  const tn = t.replace(/ /g, '');
  const cands = [item.ok, ...(item.al || [])].map(norm);
  for (const c of cands) {
    const cn = c.replace(/ /g, '');
    if (t === c || tn === cn) return true;
    if (/\d/.test(c)) { if (tn.replace(/\./g, '') === cn.replace(/\./g, '') && /^\d+$/.test(cn.replace(/\./g, ''))) return true; continue; }
    const tol = cn.length <= 4 ? 0 : cn.length <= 8 ? 1 : 2;
    if (lev(tn, cn) <= tol) return true;
  }
  return false;
}

// ======================= salvamento =======================
const KEY = 'overclock_arqcomp_v1';
let save = load();
function load() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.box) return s; } catch (e) {}
  return { box: {}, bosses: {}, unlocked: 1, all: false, sound: true, arenaBest: 0, intro: false };
}
function persist() { try { localStorage.setItem(KEY, JSON.stringify(save)); } catch (e) {} }
const box = (id) => save.box[id] || 1;
const W = { 1: 8, 2: 5, 3: 3, 4: 2, 5: 1 };
function mastery(items) { if (!items.length) return 0; return Math.round(items.reduce((s, i) => s + (box(i.id) - 1) / 4, 0) / items.length * 100); }
const isUnlocked = (b) => save.all || (b.id === 'final' ? !!(save.bosses.b8 && save.bosses.b8.stars) : b.andar <= save.unlocked);

// ======================= som =======================
let actx = null;
function tone(f, d = .12, type = 'square', v = .06, to = null, delay = 0) {
  if (!save.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const t0 = actx.currentTime + delay;
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t0);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + d);
    g.gain.setValueAtTime(v, t0); g.gain.exponentialRampToValueAtTime(.0001, t0 + d);
    o.connect(g).connect(actx.destination); o.start(t0); o.stop(t0 + d + .02);
  } catch (e) {}
}
const sfx = {
  ok: () => { tone(660, .08); tone(990, .12, 'square', .06, null, .07); },
  bad: () => { tone(220, .25, 'sawtooth', .07, 90); },
  hit: () => { tone(140, .15, 'triangle', .12, 60); },
  crit: () => { [523, 659, 784, 1046].forEach((f, i) => tone(f, .09, 'square', .05, null, i * .05)); },
  phase: () => { tone(110, .6, 'sawtooth', .06, 440); },
  win: () => { [523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, .16, 'square', .06, null, i * .11)); },
  lose: () => { [392, 330, 262, 196].forEach((f, i) => tone(f, .22, 'triangle', .08, null, i * .16)); },
  click: () => tone(880, .03, 'square', .03),
};

// ======================= arte dos chefes (SVG original) =======================
function bossArt(id, c, cls = 'bossart') {
  const eye = (x, y, r = 7) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/><circle cx="${x}" cy="${y + 1}" r="${r * .45}" fill="#0b0f14"/>`;
  const brow = (x1, y1, x2, y2) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#0b0f14" stroke-width="5" stroke-linecap="round"/>`;
  const S = {
    b1: `<g>${[0,1,2,3,4].map(i=>`<rect x="34" y="${58+i*18}" width="14" height="6" fill="#9aa"/><rect x="152" y="${58+i*18}" width="14" height="6" fill="#9aa"/>`).join('')}
      <rect x="46" y="46" width="108" height="112" rx="10" fill="${c}"/><rect x="58" y="58" width="84" height="88" rx="6" fill="#0b1a12" opacity=".35"/>
      ${eye(80,92,10)}${eye(120,92,10)}${brow(68,74,90,82)}${brow(132,74,110,82)}<rect x="78" y="120" width="44" height="10" rx="3" fill="#0b0f14"/>
      <text x="100" y="152" text-anchor="middle" font-family="monospace" font-size="10" fill="#0b0f14">SiO₂</text></g>`,
    b2: `<g><path d="M100 170 Q60 140 50 90 M100 170 Q100 120 100 70 M100 170 Q140 140 150 90" stroke="${c}" stroke-width="16" fill="none" stroke-linecap="round"/>
      <ellipse cx="100" cy="176" rx="46" ry="16" fill="${c}"/>
      ${[[50,78,'ULA'],[100,56,'UC'],[150,78,'REG']].map(([x,y,t])=>`<circle cx="${x}" cy="${y}" r="24" fill="${c}"/>${eye(x-8,y-4,6)}${eye(x+8,y-4,6)}<text x="${x}" y="${y+14}" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="9" fill="#0b0f14">${t}</text>`).join('')}</g>`,
    b3: `<g><circle cx="100" cy="104" r="66" fill="${c}"/><circle cx="100" cy="104" r="44" fill="#fff"/>
      ${[...Array(12)].map((_,i)=>{const a=i*Math.PI/6;return `<rect x="${100+Math.cos(a)*36-2}" y="${104+Math.sin(a)*36-2}" width="4" height="4" fill="#0b0f14"/>`}).join('')}
      <circle cx="100" cy="104" r="16" fill="#0b0f14"/><path d="M100 104L100 74M100 104L122 110" stroke="${c}" stroke-width="4" stroke-linecap="round"/>
      ${brow(52,40,88,56)}${brow(148,40,112,56)}<path d="M70 170 l10 16 l10 -16 l10 16 l10 -16 l10 16 l10 -16" stroke="#fff" stroke-width="4" fill="none"/></g>`,
    b4: `<g>${[...Array(7)].map((_,i)=>`<rect x="${40+i*19}" y="22" width="8" height="18" fill="#bbb"/><rect x="${40+i*19}" y="162" width="8" height="18" fill="#bbb"/>`).join('')}
      <rect x="30" y="38" width="140" height="126" rx="8" fill="${c}"/><circle cx="46" cy="54" r="5" fill="#0b0f14" opacity=".5"/>
      ${eye(76,92,12)}${eye(124,92,12)}${brow(60,70,92,80)}${brow(140,70,108,80)}
      <path d="M68 132 Q100 112 132 132" stroke="#0b0f14" stroke-width="6" fill="none" stroke-linecap="round"/>
      <text x="100" y="156" text-anchor="middle" font-family="monospace" font-size="10" font-weight="bold" fill="#0b0f14">328P</text></g>`,
    b5: `<g><path d="M30 170 C 60 120, 20 90, 70 70 S 140 110, 150 60" stroke="#ff6b81" stroke-width="30" fill="none" stroke-linecap="round"/>
      <path d="M30 170 C 60 120, 20 90, 70 70 S 140 110, 150 60" stroke="${c}" stroke-width="20" fill="none" stroke-linecap="round"/>
      <path d="M30 170 C 60 120, 20 90, 70 70 S 140 110, 150 60" stroke="#54a0ff" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="6 8"/>
      <ellipse cx="156" cy="52" rx="28" ry="22" fill="${c}"/>${eye(150,46,7)}${eye(166,46,7)}<path d="M180 60 l14 4 l-14 4" stroke="#ff4757" stroke-width="3" fill="none"/></g>`,
    b6: `<g><path d="M100 22 L178 172 L22 172 Z" fill="${c}"/>
      <path d="M78 64 L122 64 M58 102 L142 102 M40 138 L160 138" stroke="#0b0f14" stroke-width="4" opacity=".55"/>
      <ellipse cx="100" cy="48" rx="15" ry="10" fill="#fff"/><circle cx="100" cy="48" r="6" fill="#0b0f14"/>
      ${eye(80,120,8)}${eye(120,120,8)}<path d="M84 154 L116 154" stroke="#0b0f14" stroke-width="5" stroke-linecap="round"/></g>`,
    b7: `<g>${[-60,-36,-12,12,36,60].map((dx,i)=>`<path d="M${100+dx*.5} 120 q ${dx*.4} 30 ${dx} 50 q 8 6 ${dx>0?10:-10} -4" stroke="${c}" stroke-width="12" fill="none" stroke-linecap="round"/>`).join('')}
      <ellipse cx="100" cy="88" rx="56" ry="50" fill="${c}"/>${eye(80,90,11)}${eye(120,90,11)}${brow(66,70,90,78)}${brow(134,70,110,78)}
      <rect x="14" y="170" width="18" height="14" rx="3" fill="#ffd32a"/><rect x="168" y="170" width="18" height="14" rx="3" fill="#18dcff"/>
      <text x="23" y="181" text-anchor="middle" font-family="monospace" font-size="8" fill="#0b0f14">01</text><text x="177" y="181" text-anchor="middle" font-family="monospace" font-size="8" fill="#0b0f14">10</text></g>`,
    b8: `<g><path d="M100 18 L168 58 L168 138 L100 178 L32 138 L32 58 Z" fill="${c}"/>
      <circle cx="100" cy="92" r="40" fill="#0b0f14"/><circle cx="100" cy="92" r="34" fill="#e8eef5"/>
      <path d="M100 92 L100 66 M100 92 L118 100" stroke="#0b0f14" stroke-width="4" stroke-linecap="round"/>
      ${brow(64,52,90,60)}${brow(136,52,110,60)}
      <path d="M46 158 h18 v-16 h18 v16 h18 v-16 h18 v16 h18 v-16 h18" stroke="#ffd32a" stroke-width="4" fill="none"/></g>`,
    final: `<g><rect x="24" y="30" width="152" height="112" rx="10" fill="#1a2433" stroke="${c}" stroke-width="6"/>
      <rect x="36" y="42" width="128" height="88" rx="4" fill="#0044cc"/>
      <text x="58" y="94" font-family="monospace" font-size="38" font-weight="bold" fill="#fff">:(</text>
      <text x="100" y="118" font-family="monospace" font-size="9" fill="#cfe" >KERNEL_PANIC</text>
      <rect x="86" y="142" width="28" height="18" fill="#1a2433"/><rect x="60" y="160" width="80" height="10" rx="4" fill="#1a2433"/>
      <rect x="36" y="70" width="128" height="4" fill="${c}" opacity=".7"/><rect x="36" y="104" width="60" height="3" fill="#fff" opacity=".5"/></g>`,
  };
  return `<svg class="${cls}" viewBox="0 0 200 200" aria-hidden="true">${S[id] || S.b1}</svg>`;
}

// ======================= toast / banner =======================
function toast(msg, k = 'g') { const t = $('#toast'); t.innerHTML = `<span class="${k}">${esc(msg)}</span>`; clearTimeout(toast._t); toast._t = setTimeout(() => (t.innerHTML = ''), 1000); }
function banner(big, small) {
  const d = document.createElement('div'); d.className = 'banner';
  d.innerHTML = `<div>${big}<small>${small || ''}</small></div>`; document.body.appendChild(d);
  setTimeout(() => d.remove(), 1700);
}
function shake(el) { if (!el) return; el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }

// ======================= telas =======================
let cleanup = null;
function setScreen(html) { if (cleanup) { cleanup(); cleanup = null; } app.innerHTML = html; window.scrollTo(0, 0); }

function titleScreen() {
  setScreen(`
  <section class="title">
    ${bossArt('b4', '#39ff88', 'chipart bossart')}
    <h1 class="logo">OVERCLOCK</h1>
    <p class="tag">// a masmorra do chip · Arquitetura Computacional</p>
    <p class="lead">Desça até o núcleo do processador. Cada andar é um capítulo do livro, e cada capítulo tem um chefe. Responda rápido, acerte em sequência e escreva o golpe final.</p>
    <div class="actions">
      <button class="btn primary" id="go">▶ Entrar na masmorra</button>
      <button class="btn" id="how">Como jogar</button>
    </div>
    <div id="howbox"></div>
  </section>`);
  $('#go').onclick = () => { sfx.click(); mapScreen(); };
  $('#how').onclick = () => { $('#howbox').innerHTML = howto(); };
  if (!save.intro) { $('#howbox').innerHTML = howto(); save.intro = true; persist(); }
}
function howto() {
  return `<div class="howto">
    <h3>⚡ FASE 1 · RELÂMPAGO</h3><p>Aparece uma dica e 4 alternativas. O tempo encolhe a cada acerto. Teclas <span class="kbd">1</span>–<span class="kbd">4</span>.</p>
    <h3>☔ FASE 2 · CHUVA DE TERMOS</h3><p>O chefe fica furioso. Termos caem do teto: clique no que combina com a dica antes de ele bater no chão. Teclas <span class="kbd">1</span>–<span class="kbd">4</span> da esquerda para a direita.</p>
    <h3>⌨ FASE 3 · DIGITA AÍ</h3><p>Golpe final: escreva o termo, sem alternativas. Acentos e maiúsculas não importam, e um errinho de digitação passa. Errou? O chefe recupera vida.</p>
    <h3>🔥 COMBO E CRÍTICO</h3><p>A cada 4 acertos seguidos você carrega um CRÍTICO: o próximo acerto causa dano dobrado. Um erro zera o combo e tira um coração. Cada mudança de fase devolve 1 coração.</p>
    <h3>🧠 O QUE FAZ VOCÊ APRENDER</h3><p>O que você erra volta mais vezes, nesta luta e nas próximas. No fim de cada luta, a <b>Lista de Vingança</b> mostra cada erro com a resposta certa: leia antes da revanche.</p>
  </div>`;
}

function mapScreen() {
  const all = mastery(ITEMS);
  const floor = (b) => {
    const items = b.id === 'final' ? ITEMS : ITEMS.filter(i => i.b === b.id);
    const m = mastery(items), st = (save.bosses[b.id] || {}).stars || 0, best = (save.bosses[b.id] || {}).best || 0;
    const lock = !isUnlocked(b);
    return `<button class="floor ${lock ? 'locked' : ''} ${b.id === 'final' ? 'final' : ''}" data-b="${b.id}" style="--c:${b.cor}" ${lock ? 'aria-disabled="true"' : ''}>
      <div class="ico">${bossArt(b.id, b.cor, 'ico')}</div>
      <div><div class="nm">${b.id === 'final' ? 'Chefão' : 'Andar ' + b.andar} · ${esc(b.nome)}</div>
        <div class="sub">${esc(b.cap)} — ${esc(b.tema)}${lock ? (b.id === 'final' ? ' · 🔒 vença o andar 8' : ' · 🔒 vença o andar anterior') : ''}</div>
        <div class="bar"><i style="width:${m}%"></i></div></div>
      <div class="right"><div class="stars">${[1, 2, 3].map(n => `<span class="${n <= st ? 'on' : ''}">★</span>`).join('')}</div>
        <div>domínio ${m}%</div>${best ? `<div>recorde ${best}</div>` : ''}</div>
    </button>`;
  };
  setScreen(`
    <div class="maphead"><h2>▼ A MASMORRA</h2><div class="mastery">domínio total: <b>${all}%</b> de ${ITEMS.length} conceitos</div></div>
    <div class="floors">${BOSSES.map(floor).join('')}</div>
    <div class="extra">
      <button class="btn" id="arena">🏟 Arena livre <span class="mute">(recorde ${save.arenaBest})</span></button>
      <button class="btn" id="title">↩ Tela inicial</button>
    </div>
    <div class="settings">
      <button class="btn small" id="snd">${save.sound ? '🔊 Som ligado' : '🔇 Som desligado'}</button>
      <button class="btn small" id="all">${save.all ? '🔓 Todos os andares liberados' : '🔒 Liberar todos os andares'}</button>
      <button class="btn small danger" id="reset">Zerar progresso</button>
    </div>`);
  app.querySelectorAll('.floor').forEach(el => el.onclick = () => {
    const b = bossById[el.dataset.b]; if (!isUnlocked(b)) { shake(el); sfx.bad(); return; }
    sfx.click(); startBattle(b.id);
  });
  $('#arena').onclick = () => { sfx.click(); startBattle('arena'); };
  $('#title').onclick = titleScreen;
  $('#snd').onclick = () => { save.sound = !save.sound; persist(); mapScreen(); };
  $('#all').onclick = () => { save.all = !save.all; persist(); mapScreen(); };
  const r = $('#reset'); r.onclick = () => {
    if (r.dataset.c) { const s = save.sound; localStorage.removeItem(KEY); save = { box: {}, bosses: {}, unlocked: 1, all: false, sound: s, arenaBest: 0, intro: true }; persist(); mapScreen(); toast('Progresso zerado', 'y'); }
    else { r.dataset.c = 1; r.textContent = 'Tem certeza? Clique de novo'; }
  };
}

// ======================= batalha =======================
let run = null;
function startBattle(id) {
  const arena = id === 'arena';
  const boss = arena ? { id: 'final', nome: 'Arena livre', cap: 'Livro todo', tema: 'Sobreviva o máximo que puder', cor: '#2de2ff', fala: 'Sem chefe. Só você, os conceitos e 5 corações.' } : bossById[id];
  const pool = (arena || id === 'final') ? ITEMS.slice() : ITEMS.filter(i => i.b === id);
  const seg = id === 'final' ? 5 : 3;
  run = {
    id, arena, boss, pool, seg, max: seg * 3, hp: seg * 3, hearts: 5, combo: 0, maxCombo: 0, crit: false,
    score: 0, answered: 0, correct: 0, missed: [], recent: [], phase: 1, arenaPhaseCount: 0, over: false,
  };
  document.documentElement.style.setProperty('--boss', boss.cor);
  setScreen(`
    <div class="hud">
      <button class="btn small" id="quit">← Mapa</button>
      <div class="grow"></div>
      <div class="combo" id="combo">COMBO 0</div>
      <div class="hearts" id="hearts"></div>
      <div class="score" id="score">0</div>
    </div>
    <div class="stage" id="stage">
      ${bossArt(boss.id, boss.cor)}
      <div>
        <p class="bossname">${esc(boss.nome)}</p>
        <div class="bosscap">${esc(boss.cap)} · ${esc(boss.tema)}</div>
        <div class="speech" id="speech">“${esc(boss.fala)}”</div>
        ${arena ? '<div class="phaselabel"><span>Modo infinito: as fases se alternam a cada 4 perguntas</span></div>' : `<div class="hp" id="hp"></div><div class="phaselabel"><span>⚡ Relâmpago</span><span>☔ Chuva</span><span>⌨ Digita aí</span></div>`}
      </div>
    </div>
    <div class="arena" id="arena"></div>`);
  $('#quit').onclick = () => { run.over = true; mapScreen(); };
  updateHud();
  banner(arena ? 'ARENA LIVRE' : `ANDAR ${boss.andar === 9 ? 'FINAL' : boss.andar}<br>${esc(boss.nome.toUpperCase())}`, 'Fase 1 · Relâmpago');
  sfx.phase();
  setTimeout(() => !run.over && nextQuestion(), 1700);
}

function phaseOf() {
  if (run.arena) return [1, 2, 3][Math.floor(run.arenaPhaseCount / 4) % 3];
  return run.hp > run.seg * 2 ? 1 : run.hp > run.seg ? 2 : 3;
}
function updateHud() {
  $('#hearts').innerHTML = [0, 1, 2, 3, 4].map(i => `<span class="${i < run.hearts ? '' : 'off'}">❤️</span>`).join('');
  $('#score').textContent = run.score;
  const c = $('#combo');
  c.textContent = run.crit ? 'CRÍTICO!' : `COMBO ${run.combo}`;
  c.className = 'combo' + (run.crit ? ' crit' : run.combo >= 3 ? ' hot' : '');
  const hp = $('#hp');
  if (hp) hp.innerHTML = Array.from({ length: run.max }, (_, i) => `<i class="${i >= run.hp ? 'gone' : ''} ${i > 0 && i % run.seg === 0 ? 'sep' : ''}"></i>`).join('');
  $('#stage').classList.toggle('rage', phaseOf() >= 2 && !run.arena);
}

// ---- seleção de perguntas (repetição inteligente) ----
function distractors(item, n = 3) {
  if (item.no) return shuffle(item.no).slice(0, n);
  const bad = new Set([item.ok, ...(item.al || [])].map(norm));
  const out = [];
  const add = (list) => { for (const it of shuffle(list)) { if (out.length >= n) break; const k = norm(it.ok); if (!bad.has(k) && isShort(it.ok)) { bad.add(k); out.push(it.ok); } } };
  add(ITEMS.filter(i => i.g === item.g && i.g !== 'mcq'));
  if (out.length < n) add(ITEMS.filter(i => i.b === item.b && i.g !== 'mcq'));
  if (out.length < n) add(ITEMS.filter(i => i.g !== 'mcq'));
  return out;
}
const fitsPhase = {
  1: () => true,
  2: (i) => isShort(i.ok) && (!i.no || i.no.every(isShort)),
  3: (i) => isShort(i.ok) && i.g !== 'mcq',
};
function pickItem(phase) {
  let cands = run.pool.filter(fitsPhase[phase]);
  const fresh = cands.filter(i => !run.recent.includes(i.id));
  if (fresh.length) cands = fresh;
  const missedSet = new Set(run.missed);
  let tot = 0; const w = cands.map(i => { const x = W[box(i.id)] * (missedSet.has(i.id) ? 2 : 1); tot += x; return x; });
  let r = Math.random() * tot;
  for (let k = 0; k < cands.length; k++) { r -= w[k]; if (r <= 0) return cands[k]; }
  return cands[cands.length - 1];
}

function nextQuestion() {
  if (run.over) return;
  const ph = phaseOf();
  if (ph !== run.phase) {
    run.phase = ph;
    if (!run.arena && run.hearts < 5) run.hearts++;
    updateHud();
    sfx.phase();
    const names = { 2: ['FASE 2 · CHUVA DE TERMOS', run.arena ? 'Clique antes de cair!' : 'O chefe ficou furioso! (+1 ❤️)'], 3: ['FASE 3 · DIGITA AÍ', run.arena ? 'Escreva o termo!' : 'Golpe final: escreva o termo! (+1 ❤️)'], 1: ['FASE 1 · RELÂMPAGO', 'Rápido!'] };
    banner(...names[ph]);
    const sp = $('#speech'); if (sp) sp.textContent = ph === 2 ? '“CHEGA! Que chovam termos!”' : ph === 3 ? '“Impossível... você ainda está de pé?”' : '“De novo!”';
    setTimeout(() => !run.over && ask(ph), 1700);
  } else ask(ph);
}
function ask(ph) {
  const item = pickItem(ph);
  run.recent.push(item.id); if (run.recent.length > Math.min(6, Math.floor(run.pool.length / 2))) run.recent.shift();
  ({ 1: relampago, 2: chuva, 3: digita })[ph](item);
}

// ---- resultado de cada resposta ----
function resolve(item, ok, extra = {}) {
  if (run.over) return;
  run.answered++;
  if (run.arena) run.arenaPhaseCount++;
  if (ok) {
    run.correct++; run.combo++; run.maxCombo = Math.max(run.maxCombo, run.combo);
    save.box[item.id] = Math.min(5, box(item.id) + 1);
    const mult = Math.min(4, 1 + Math.floor(run.combo / 3));
    let pts = Math.round(([0, 100, 150, 200][phaseOf()] + (extra.bonus || 0)) * mult * (extra.hint ? .5 : 1));
    let dmg = 1;
    if (run.crit) { dmg = 2; pts *= 2; run.crit = false; sfx.crit(); toast(`CRÍTICO! +${pts}`, 'y'); }
    else { sfx.ok(); toast(`+${pts}${mult > 1 ? ' ×' + mult : ''}`, 'g'); }
    run.score += pts;
    if (run.combo % 4 === 0) { run.crit = true; setTimeout(() => toast('🔥 CRÍTICO CARREGADO', 'y'), 600); }
    if (!run.arena) {
      run.hp = Math.max(0, run.hp - dmg);
      const art = $('.bossart'); if (art) { art.classList.remove('hit'); void art.getBoundingClientRect(); art.classList.add('hit'); }
      setTimeout(sfx.hit, 80);
    }
  } else {
    run.combo = 0; run.crit = false; run.hearts--;
    save.box[item.id] = 1;
    if (!run.missed.includes(item.id)) run.missed.push(item.id);
    sfx.bad(); shake($('#arena')); $('#arena').classList.add('flashred'); setTimeout(() => $('#arena') && $('#arena').classList.remove('flashred'), 400);
    if (!run.arena && phaseOf() === 3 && extra.heal) run.hp = Math.min(run.seg, run.hp + 1);
  }
  persist(); updateHud();
  const wait = ok ? 650 : 2300;
  if (!run.arena && run.hp <= 0) { run.over = true; setTimeout(() => endBattle(true), 900); return; }
  if (run.hearts <= 0) { run.over = true; setTimeout(() => endBattle(false), wait); return; }
  setTimeout(nextQuestion, wait);
}
function revealHTML(item) { return `<div class="reveal">Resposta: <b>${esc(item.ok)}</b><span class="x">${esc(item.x || '')}</span></div>`; }

// ---- FASE 1: Relâmpago ----
function relampago(item) {
  const opts = shuffle([item.ok, ...distractors(item, 3)]);
  const T = Math.max(5, 12 - run.combo * .8) * (item.q.length > 70 ? 1.2 : 1);
  const A = $('#arena');
  A.innerHTML = `<div class="modetag"><span>⚡ RELÂMPAGO</span><span>${T.toFixed(0)}s</span></div>
    <div class="timer"><i id="tbar"></i></div>
    <p class="clue">${esc(item.q)}</p>
    <div class="opts">${opts.map((o, i) => `<button class="opt" data-v="${esc(o)}"><span class="k">${i + 1}</span><span>${esc(o)}</span></button>`).join('')}</div>
    <div id="rev"></div>`;
  let done = false, t0 = performance.now(), raf;
  const bar = $('#tbar');
  const finish = (btn) => {
    if (done) return; done = true; cancelAnimationFrame(raf); document.removeEventListener('keydown', key);
    const left = Math.max(0, T - (performance.now() - t0) / 1000);
    const ok = btn && btn.dataset.v === item.ok;
    A.querySelectorAll('.opt').forEach(b => { b.disabled = true; if (b.dataset.v === item.ok) b.classList.add('right'); });
    if (btn && !ok) btn.classList.add('wrong');
    if (!ok) $('#rev').innerHTML = (btn ? '' : '<p class="mute">⏱ Tempo esgotado!</p>') + revealHTML(item);
    resolve(item, ok, { bonus: Math.round(left * 8) });
  };
  const tick = (now) => { const p = 1 - (now - t0) / 1000 / T; bar.style.transform = `scaleX(${Math.max(0, p)})`; if (p <= 0) return finish(null); raf = requestAnimationFrame(tick); };
  raf = requestAnimationFrame(tick);
  A.querySelectorAll('.opt').forEach(b => b.onclick = () => finish(b));
  const key = (e) => { const n = +e.key; if (n >= 1 && n <= 4) finish(A.querySelectorAll('.opt')[n - 1]); };
  document.addEventListener('keydown', key);
  cleanup = () => { done = true; cancelAnimationFrame(raf); document.removeEventListener('keydown', key); };
}

// ---- FASE 2: Chuva de Termos ----
function chuva(item) {
  const opts = shuffle([item.ok, ...distractors(item, 3)]);
  const A = $('#arena');
  A.innerHTML = `<div class="modetag"><span>☔ CHUVA DE TERMOS</span><span>clique antes de cair</span></div>
    <div class="rain" id="rain">${[1, 2, 3].map(i => `<div class="lane" style="left:${i * 25}%"></div>`).join('')}
      ${opts.map((o, i) => `<button class="drop" data-v="${esc(o)}" style="left:${12.5 + i * 25}%"><span class="k">${i + 1}</span>${esc(o)}</button>`).join('')}
      <div class="ground"></div></div>
    <div class="rainclue">${esc(item.q)}</div><div id="rev"></div>`;
  const rain = $('#rain'), drops = [...rain.querySelectorAll('.drop')];
  const H = rain.clientHeight;
  const ys = drops.map(() => -10 - Math.random() * 60);
  const speed = (42 + run.combo * 6 + (run.arena ? run.correct : (run.max - run.hp)) * 2) * (H / 340);
  let done = false, last = performance.now(), raf;
  const finish = (btn, fell) => {
    if (done) return; done = true; cancelAnimationFrame(raf); document.removeEventListener('keydown', key);
    const ok = btn && btn.dataset.v === item.ok;
    drops.forEach(d => { if (d.dataset.v === item.ok) d.classList.add('right'); });
    if (ok) btn.classList.add('boom'); else if (btn) btn.classList.add('wrong');
    if (!ok) $('#rev').innerHTML = (fell ? '<p class="mute">💥 O termo certo bateu no chão!</p>' : '') + revealHTML(item);
    resolve(item, ok);
  };
  const tick = (now) => {
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    drops.forEach((d, i) => { ys[i] += speed * dt; d.style.top = ys[i] + 'px'; });
    const ci = drops.findIndex(d => d.dataset.v === item.ok);
    if (ys[ci] + drops[ci].offsetHeight >= H - 4) return finish(null, true);
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  drops.forEach(d => d.onclick = () => finish(d));
  const key = (e) => { const n = +e.key; if (n >= 1 && n <= 4) finish(drops[n - 1]); };
  document.addEventListener('keydown', key);
  cleanup = () => { done = true; cancelAnimationFrame(raf); document.removeEventListener('keydown', key); };
}

// ---- FASE 3: Digita aí ----
function digita(item) {
  const A = $('#arena');
  A.innerHTML = `<div class="modetag"><span>⌨ DIGITA AÍ · GOLPE FINAL</span><span>Enter para atacar</span></div>
    <p class="clue">${esc(item.q)}</p>
    <div class="mask" id="mask"></div>
    <form class="typerow" id="tf" autocomplete="off"><input id="ti" placeholder="escreva o termo…" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="go"><button class="btn primary" type="submit">⚔</button></form>
    <div class="typetools"><button class="btn small" id="hint" type="button">💡 Dica (vale metade)</button><button class="btn small" id="skip" type="button">Não sei</button></div>
    <div id="rev"></div>`;
  const inp = $('#ti'); setTimeout(() => inp.focus(), 50);
  let done = false, hint = false;
  const finish = (ok) => {
    if (done) return; done = true;
    inp.disabled = true; inp.classList.add(ok ? 'good' : 'bad');
    A.querySelectorAll('.typetools button,#tf button').forEach(b => b.disabled = true);
    if (!ok) { $('#rev').innerHTML = revealHTML(item) + (run.arena ? '' : '<p class="mute">O chefe recuperou um pouco de vida.</p>'); const sp = $('#speech'); if (sp) sp.textContent = '“Hahaha! Errou!”'; }
    resolve(item, ok, { hint, heal: true });
  };
  $('#tf').onsubmit = (e) => { e.preventDefault(); if (!inp.value.trim()) return; finish(checkTyped(item, inp.value)); };
  $('#hint').onclick = () => {
    hint = true; $('#hint').disabled = true; run.combo = 0; run.crit = false; updateHud();
    $('#mask').textContent = item.ok.split('').map((ch, i) => i === 0 || /[\s.,\-/→]/.test(ch) ? ch : '_').join('');
    inp.focus();
  };
  $('#skip').onclick = () => finish(false);
  cleanup = () => { done = true; };
}

// ======================= fim de luta =======================
function endBattle(win) {
  const acc = run.answered ? run.correct / run.answered : 0;
  const stars = win ? (acc >= .9 ? 3 : acc >= .7 ? 2 : 1) : 0;
  let novo = false;
  if (run.arena) { if (run.score > save.arenaBest) { save.arenaBest = run.score; novo = true; } }
  else {
    const rec = save.bosses[run.id] || { stars: 0, best: 0 };
    if (win) { rec.stars = Math.max(rec.stars, stars); if (run.boss.andar < 9) save.unlocked = Math.max(save.unlocked, run.boss.andar + 1); }
    if (run.score > rec.best) { rec.best = run.score; novo = true; }
    save.bosses[run.id] = rec;
  }
  persist();
  win ? sfx.win() : sfx.lose();
  const next = !run.arena && win && BOSSES.find(b => b.andar === run.boss.andar + 1);
  const rev = run.missed.map(id => byId[id]);
  const title = run.arena ? 'FIM DA ARENA' : win ? `${run.boss.nome.toUpperCase()} DERROTADO!` : 'VOCÊ FOI DERROTADO';
  setScreen(`<section class="result">
    ${bossArt(run.boss.id, run.boss.cor, 'chipart bossart')}
    <h2 class="${win || run.arena ? 'win' : 'lose'}">${esc(title)}</h2>
    ${!run.arena && win ? `<div class="bigstars stars">${[1, 2, 3].map(n => `<span class="${n <= stars ? 'on' : ''}">★</span>`).join('')}</div>` : ''}
    ${novo ? '<p class="pix" style="color:var(--gold);font-size:12px">NOVO RECORDE!</p>' : ''}
    <div class="statgrid">
      <div class="stat"><b>${run.score}</b><span>pontos</span></div>
      <div class="stat"><b>${Math.round(acc * 100)}%</b><span>precisão</span></div>
      <div class="stat"><b>${run.correct}/${run.answered}</b><span>acertos</span></div>
      <div class="stat"><b>${run.maxCombo}</b><span>maior combo</span></div>
    </div>
    ${rev.length ? `<div class="revenge"><h3>⚔ LISTA DE VINGANÇA · ${rev.length} conceito${rev.length > 1 ? 's' : ''} para revisar</h3><ol>${rev.map(i => `<li><span class="q">${esc(i.q)}</span><br>→ <span class="a">${esc(i.ok)}</span><br><span class="x">${esc(i.x || '')}</span></li>`).join('')}</ol></div>`
      : `<p class="mute">Nenhum erro. Perfeito! 🎯</p>`}
    <div class="actions">
      ${next ? `<button class="btn primary" id="next">▼ Próximo andar: ${esc(next.nome)}</button>` : ''}
      <button class="btn ${next ? '' : 'primary'}" id="again">↻ ${win || run.arena ? 'Jogar de novo' : 'Revanche'}</button>
      <button class="btn" id="map">Mapa</button>
    </div></section>`);
  const id = run.arena ? 'arena' : run.id;
  if (next) $('#next').onclick = () => startBattle(next.id);
  $('#again').onclick = () => startBattle(id);
  $('#map').onclick = mapScreen;
}

// ======================= início =======================
titleScreen();
window.__overclock = { checkTyped, norm, distractors, ITEMS };
})();
