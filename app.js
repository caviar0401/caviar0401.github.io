import { LOTS } from "./lots.js";

const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const $ = (sel, root=document) => root.querySelector(sel);

const tabs = $$(".tab");
const pages = $$(".page");
const pageTitle = $("#pageTitle");

// Home components
const jarWrap = $(".jarWrap");
const drawBtn = $("#drawBtn");
const shareBtn = $("#shareBtn");
const againBtn = $("#againBtn");
const copyLinkBtn = $("#copyLinkBtn");

const resultCard = $("#resultCard");
const rTitle = $("#rTitle");
const rPoem = $("#rPoem");
const rExplain = $("#rExplain");

const partnerBtn = $("#partnerBtn");

// ---- Tab Router ----
const TITLES = {
  home: "線上靈籤解惑",
  prizes: "開運平安好物",
  author: "關於開發團隊",
  partner: "商家合作報名",
};

function setTab(tabName){
  // button state
  tabs.forEach(b => b.classList.toggle("active", b.dataset.tab === tabName));

  // page state
  pages.forEach(p => p.classList.toggle("hidden", p.dataset.page !== tabName));

  // title
  pageTitle.textContent = TITLES[tabName] ?? "AI 雲端媽祖";

  // url hash
  const url = new URL(window.location.href);
  url.hash = `#${tabName}`;
  history.replaceState({}, "", url.toString());
}

function initTabFromUrl(){
  const hash = (window.location.hash || "#home").replace("#", "");
  const valid = ["home","prizes","author","partner"];
  setTab(valid.includes(hash) ? hash : "home");
}

tabs.forEach(b => b.addEventListener("click", () => setTab(b.dataset.tab)));
window.addEventListener("hashchange", initTabFromUrl);

// ---- Lots logic ----
function drawRandomLot(){
  const idx = Math.floor(Math.random() * LOTS.length);
  return LOTS[idx];
}
function getLotById(id){
  const num = Number(id);
  if (!Number.isFinite(num)) return null;
  return LOTS.find(x => x.id === num) ?? null;
}
function showResult(lot){
  rTitle.textContent = lot.title ?? `第 ${lot.id} 籤`;
  rPoem.textContent = lot.poem ?? "";
  rExplain.textContent = lot.explain ?? "";
  resultCard.classList.remove("hidden");

  const url = new URL(window.location.href);
  url.searchParams.set("id", String(lot.id));
  history.replaceState({}, "", url.toString());
}
function clearResult(){
  resultCard.classList.add("hidden");
  const url = new URL(window.location.href);
  url.searchParams.delete("id");
  history.replaceState({}, "", url.toString());
}

// ---- Draw animation (3s with settle) ----
let isDrawing = false;

drawBtn.addEventListener("click", () => {
  if (isDrawing) return;
  isDrawing = true;

  // 抽到的籤先決定好
  const lot = drawRandomLot();

  // 先把結果卡收起來（避免連抽時視覺混亂）
  resultCard.classList.add("hidden");

  // 進入動畫狀態
  jarWrap.classList.add("is-animating");

  const originalHTML = drawBtn.innerHTML;
  drawBtn.innerHTML = "抽籤中…";
  drawBtn.disabled = true;

  const STOP_AT = 2400; // 2.4s 開始收尾
  const TOTAL = 3000;   // 3.0s 出結果

  setTimeout(() => {
    jarWrap.classList.remove("is-animating");
    jarWrap.classList.add("is-stopping");
  }, STOP_AT);

  setTimeout(() => {
    jarWrap.classList.remove("is-stopping");

    drawBtn.innerHTML = originalHTML;
    drawBtn.disabled = false;

    isDrawing = false;
    showResult(lot);
  }, TOTAL);
});

// ---- Share / Copy ----
async function shareCurrent(){
  const url = window.location.href;
  const text = "我剛抽到這支籤，分享給你：";

  if (navigator.share) {
    try {
      await navigator.share({ title: document.title, text, url });
      return;
    } catch (_) {}
  }
  await navigator.clipboard.writeText(url);
  alert("已複製分享連結！");
}
async function copyLink(){
  await navigator.clipboard.writeText(window.location.href);
  alert("已複製結果連結！");
}

shareBtn?.addEventListener("click", shareCurrent);
copyLinkBtn?.addEventListener("click", copyLink);
againBtn?.addEventListener("click", clearResult);

// ---- Partner button (示範導向外部表單) ----
partnerBtn?.addEventListener("click", () => {
  // TODO: 改成你的 SurveyCake / Google Form 連結
  window.open("https://example.com", "_blank");
});

// ---- Init ----
(function init(){
  initTabFromUrl();

  // 若網址帶 ?id=xx，直接顯示那支籤（留在首頁求籤）
  const url = new URL(window.location.href);
  const id = url.searchParams.get("id");
  if (id) {
    const lot = getLotById(id);
    if (lot) {
      setTab("home");
      showResult(lot);
    }
  }
})();
