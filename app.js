/* ======= Утилиты ======= */
const $ = s => document.querySelector(s);

function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function formatTime(sec){
  const m = Math.floor(sec/60).toString().padStart(2,"0");
  const s = (sec%60).toString().padStart(2,"0");
  return `${m}:${s}`;
}

function download(filename, text){
  const blob = new Blob([text], {type:"text/csv;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(()=>{ URL.revokeObjectURL(url); a.remove(); }, 0);
}

function optionToLabel(opt){
  if(opt==null) return "";
  if(typeof opt === "string") return opt;
  if(typeof opt === "object"){
    return opt.alt ? opt.alt : (opt.img ? opt.img : JSON.stringify(opt));
  }
  return String(opt);
}

/* ======= Состояние ======= */
const TARGET_QUESTIONS = 100;
let questions = [];
let current = 0;
let answers = [];
let startTs = 0;
let timerId = null;
let timeLeft = 0;       // в секундах
let initials = "";

/* ======= Анти-чит ======= */
document.addEventListener("contextmenu", e => e.preventDefault());
window.addEventListener("beforeunload", (e) => {
  const ui = $("#examUI");
  if(ui && !ui.classList.contains("hidden")){
    e.preventDefault();
    e.returnValue = "";
  }
});

/* ======= DOM ======= */
const startBtn    = $("#startBtn");
const initialsEl  = $("#initials");
const metaPanel   = $("#startPanel");   // новый id из HTML

const examUI      = $("#examUI");
const resultUI    = $("#resultUI");
const screenIntro = $("#screenIntro");

const qText       = $("#qText");
const optionsBox  = $("#options");
const nextBtn     = $("#nextBtn");
const prevBtn     = $("#prevBtn");
const bar         = $("#bar");
const counter     = $("#counter");
const timerEl     = $("#timer");

const rInitials   = $("#rInitials");
const rScore      = $("#rScore");
const rTotal      = $("#rTotal");
const rPct        = $("#rPct");
const rTime       = $("#rTime");
const downloadCsv = $("#downloadCsv");
const restartBtn  = $("#restart");
const reviewList  = $("#reviewList");

/* ======= Старт ======= */
startBtn.addEventListener("click", () => {
  const init = initialsEl.value.trim();
  if(!init){
    initialsEl.focus();
    initialsEl.classList.add("shake");
    setTimeout(()=>initialsEl.classList.remove("shake"), 400);
    return;
  }
  initials = init.toUpperCase();

  const bank = Array.isArray(window.QUESTION_BANK) ? window.QUESTION_BANK : [];
  if (bank.length === 0){
    alert("Файл questions.js не загружен или банк пуст. Проверь путь и порядок <script>.");
    return;
  }
  const totalToAsk = Math.min(TARGET_QUESTIONS, bank.length);

  // ❗ Правильно называем переменную picked (а не x)
  const picked = shuffle(bank).slice(0, totalToAsk).map(q => {
    const clone = {...q};
    const type = clone.type || "text";
    const opts = Array.isArray(clone.options) ? clone.options.slice() : [];
    const idxMap = shuffle(opts.map((_,i)=>i));
    const mixedOptions = idxMap.map(i => opts[i]);
    const correctNewIndex = idxMap.indexOf(clone.correct);
    return { q: clone.q, qImg: clone.qImg || null, type, options: mixedOptions, correct: correctNewIndex };
  });

  questions = picked;
  current = 0;
  answers = new Array(questions.length).fill(null);
  startTs = Date.now();

  // === Обратный таймер 30 минут (показываем) ===
  const minutes = 30;
  timeLeft = minutes * 60;
  timerEl.classList.remove("hidden");
  timerEl.textContent = formatTime(timeLeft);
  if (timerId) clearInterval(timerId);
  timerId = setInterval(() => {
    timeLeft--;
    timerEl.textContent = formatTime(Math.max(timeLeft, 0));
    if (timeLeft <= 0) {
      clearInterval(timerId);
      finishExam(true);
    }
  }, 1000);

  // === Скрыть ввод/кнопку и заголовок на время теста ===
  if (metaPanel) metaPanel.classList.add("hidden");
  const pageTitle = document.getElementById("pageTitle");
  if (pageTitle) pageTitle.classList.add("hidden");

  // === Спрятать кнопку "Назад" на всём тесте ===
  if (prevBtn) prevBtn.style.display = "none";

  screenIntro.classList.add("hidden");
  examUI.classList.remove("hidden");
  resultUI.classList.add("hidden");
  renderQuestion();
});

/* ======= Отрисовка ======= */
function renderQuestion(){
  const q = questions[current];

  qText.textContent = q.q;

  // убрать прошлую картинку (если была)
  const prevMedia = qText.previousElementSibling;
  if(prevMedia && prevMedia.classList && prevMedia.classList.contains("q-media")){
    prevMedia.remove();
  }
  // вставить картинку вопроса (если есть)
  if(q.qImg){
    const img = document.createElement("img");
    img.src = q.qImg;
    img.alt = "Иллюстрация к вопросу";
    img.className = "q-media";
    qText.parentNode.insertBefore(img, qText);
  }

  // опции
  optionsBox.innerHTML = "";
  if(q.type === "imageOptions"){
    const grid = document.createElement("div");
    grid.className = "img-grid";
    q.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "imgOption";
      btn.innerHTML = `
        <img src="${opt.img}" alt="${opt.alt ? opt.alt.replace(/"/g,'&quot;') : 'Вариант'}">
        <div class="caption">${opt.alt ? opt.alt : "Вариант " + (idx+1)}</div>
      `;
      btn.addEventListener("click", () => {
        answers[current] = idx;
        Array.from(grid.children).forEach(ch => ch.classList.remove("selected"));
        btn.classList.add("selected");
        nextBtn.disabled = false;
      });
      grid.appendChild(btn);
    });
    optionsBox.appendChild(grid);
  } else {
    q.options.forEach((opt, idx) => {
      const label = document.createElement("label");
      label.className = "option";
      const text = optionToLabel(opt);
      label.innerHTML = `
        <input type="radio" name="opt" value="${idx}" ${answers[current]===idx ? "checked":""}>
        <span>${text}</span>
      `;
      label.addEventListener("click", (e)=>{
        if(e.target && e.target.tagName.toLowerCase() !== "input"){
          const input = label.querySelector("input");
          input.checked = true;
        }
        answers[current] = idx;
        nextBtn.disabled = false;
      });
      optionsBox.appendChild(label);
    });
  }

  // «Назад» больше не используем
  // prevBtn.disabled = current === 0;
  nextBtn.textContent = current === questions.length-1 ? "Завершить" : "Далее";
  nextBtn.disabled = answers[current] === null;

  const pct = (current/questions.length)*100;
  bar.style.width = `${pct}%`;
  counter.textContent = `Вопрос ${current+1} / ${questions.length}`;
}

/* ======= Навигация ======= */
nextBtn.addEventListener("click", () => {
  if(answers[current] === null) return;
  if(current === questions.length-1){
    finishExam(false);
  } else {
    current++;
    renderQuestion();
  }
});
// слушатель prevBtn можно оставить — оно скрыто, срабатывать не будет
prevBtn.addEventListener("click", () => {
  if(current > 0){
    current--;
    renderQuestion();
  }
});

/* ======= CSV (только неверные ответы) ======= */
function buildCsv(payload){
  // Только неверные ответы: вопрос; выбранный ответ; правильный ответ
  const rows = [["question","chosen","correct"]];
  payload.questions.forEach((q,i)=>{
    const chosen = q.chosen;
    const correct = q.correct;
    if (chosen !== correct) {
      rows.push([
        q.q.replace(/\s+/g," ").trim(),
        chosen!=null ? optionToLabel(q.options[chosen]) : "",
        optionToLabel(q.options[correct])
      ]);
    }
  });
  return rows.map(r=>r.map(v=>{
    const s = String(v ?? "");
    return /[",;\n;]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s; // экранируем и ;
  }).join(";")).join("\n");
}

/* ======= Имя файла ======= */
function safeFilePart(s){
  return String(s).trim().replace(/[/\\?%*:|"<>]/g, "_").slice(0, 40);
}


// ВСТАВЬ сюда URL твоего веб-приложения (оканчивается на /exec)
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzVauB8-qMOupPKCBVl7M6x5uSfPb8W9meIgJutRqhvCaIopAeEzL5iN9Uqky66JLlc/exec';

// Шлём ТОЛЬКО нужные поля (без userAgent, total, questionsTotal)
function postToSheets(fullPayload){
  try {
    const out = {
      initials: fullPayload.initials,
      right: fullPayload.right,
      pct: fullPayload.pct,
      elapsedSec: fullPayload.elapsedSec,
      byTimer: !!fullPayload.byTimer,
      timestampISO: fullPayload.timestampISO,
      questions: fullPayload.questions   // нужен для определения ошибок на сервере
    };
    const body = JSON.stringify(out);

    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'text/plain' });
      navigator.sendBeacon(WEB_APP_URL, blob);
    } else {
      fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type':'text/plain' },
        body
      }).catch(()=>{});
    }
  } catch(e){
    console.warn('Sheets post error:', e);
  }
}



/* ======= Завершение ======= */
function finishExam(_byTimer){
  if (timerId){ clearInterval(timerId); timerId = null; }
  timerEl.classList.add("hidden");

  let right = 0;
  questions.forEach((q,i) => { if(answers[i] === q.correct) right++; });
  const total = questions.length;
  const pct = Math.round((right/total)*100);

  const elapsedSec = Math.round((Date.now() - startTs)/1000);
  const elapsed = formatTime(elapsedSec);

  examUI.classList.add("hidden");
  resultUI.classList.remove("hidden");

  rInitials.textContent = initials;
  rScore.textContent = String(right);
  rTotal.textContent = String(total);
  rPct.textContent = String(pct);
  rTime.textContent = elapsed;

  bar.style.width = "100%";

  const payload = {
    initials, right, total, pct,
    elapsedSec,
    timestampISO: new Date().toISOString(),
    questions: questions.map((q,i)=>({
      q: q.q,
      qImg: q.qImg || null,
      type: q.type || "text",
      options: q.options,
      correct: q.correct,
      chosen: answers[i]
    }))
  };
  const key = "exam_results_v1";
  const all = JSON.parse(localStorage.getItem(key) || "[]");
  all.push(payload);
  localStorage.setItem(key, JSON.stringify(all));

  renderReview(payload);
  postToSheets(payload);

  // === Кнопка «Скачать результаты» (только ошибки) ===
const csv = buildCsv(payload);
const initsForFile = safeFilePart(initials);
const fname = `result_${initsForFile}_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.csv`;
downloadCsv.onclick = () => download(fname, csv);


  restartBtn.onclick = () => { window.location.reload(); };
}

function renderReview(payload){
  reviewList.innerHTML = "";
  payload.questions.forEach((q, i) => {
    const user = q.chosen;
    const ok = user === q.correct;
    const wrap = document.createElement("div");
    wrap.className = "review-item";

    let header = `${i+1}. ${q.q} <span class="badge ${ok?"ok":"err"}">${ok?"верно":"ошибка"}</span>`;
    if(q.qImg){
      header = `<div style="display:flex;gap:12px;align-items:flex-start;">
        <img src="${q.qImg}" alt="Иллюстрация" style="width:120px;height:80px;object-fit:cover;border-radius:8px;border:1px solid #2a2f3b;background:#0b0e14">
        <div style="flex:1">${header}</div>
      </div>`;
    }

  const userLabel = user != null ? optionToLabel(q.options[user]) : "—";
let correctLine = "";
if (user === q.correct) {
  correctLine = `<div class="review-a"><b>Правильный ответ:</b> ${optionToLabel(q.options[q.correct])}</div>`;
}

wrap.innerHTML = `
  <div class="review-q">${header}</div>
  <div class="review-a"><b>Ваш ответ:</b> ${userLabel}</div>
  ${correctLine}
`;

    reviewList.appendChild(wrap);
  });
}
