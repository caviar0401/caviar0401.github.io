// app.js
import { LOTS } from "./lots.js";

const $ = (id) => document.getElementById(id);

const homeEl = $("home");
const resultEl = $("result");

const drawBtn = $("drawBtn");
const shareBtn = $("shareBtn");
const againBtn = $("againBtn");
const copyLinkBtn = $("copyLinkBtn");

const rTitle = $("rTitle");
const rPoem = $("rPoem");
const rExplain = $("rExplain");

// 隨機抽一支（可改為「不重複」模式）
function drawRandomLot() {
  const idx = Math.floor(Math.random() * LOTS.length);
  return LOTS[idx];
}

function showHome() {
  resultEl.classList.add("hidden");
  homeEl.classList.remove("hidden");
}

function showResult(lot) {
  rTitle.textContent = lot.title ?? `第 ${lot.id} 籤`;
  rPoem.textContent = lot.poem ?? "";
  rExplain.textContent = lot.explain ?? "";

  homeEl.classList.add("hidden");
  resultEl.classList.remove("hidden");

  // 更新網址成可分享的格式
  const url = new URL(window.location.href);
  url.searchParams.set("id", String(lot.id));
  history.replaceState({}, "", url.toString());
}

function getLotById(id) {
  const num = Number(id);
  if (!Number.isFinite(num)) return null;
  return LOTS.find((x) => x.id === num) ?? null;
}

async function shareCurrent() {
  const url = window.location.href;
  const text = "我剛抽到這支籤，分享給你：";
  if (navigator.share) {
    try {
      await navigator.share({ title: document.title, text, url });
      return;
    } catch (_) {}
  }
  // fallback：複製
  await navigator.clipboard.writeText(url);
  alert("已複製分享連結！");
}

async function copyLink() {
  await navigator.clipboard.writeText(window.location.href);
  alert("已複製結果連結！");
}

// 事件
const jarWrap = document.querySelector(".jarWrap");
let isDrawing = false;

drawBtn.addEventListener("click", () => {
  if (isDrawing) return;
  isDrawing = true;

  // 抽到的籤先決定好（避免 5 秒後抽到不同支）
  const lot = drawRandomLot();

  // 進入動畫狀態
  jarWrap.classList.add("is-animating");

  // 按鈕文字改成抽籤中
  const originalHTML = drawBtn.innerHTML;
  drawBtn.innerHTML = "抽籤中…";
  drawBtn.disabled = true;

  // 5 秒後顯示結果
  window.setTimeout(() => {
    jarWrap.classList.remove("is-animating");

    // 還原按鈕（以免使用者按「再抽一次」回來時怪怪的）
    drawBtn.innerHTML = originalHTML;
    drawBtn.disabled = false;

    isDrawing = false;
    showResult(lot);
  }, 3000);
});

againBtn.addEventListener("click", () => {
  // 回首頁並清掉 id
  const url = new URL(window.location.href);
  url.searchParams.delete("id");
  history.replaceState({}, "", url.toString());
  showHome();
});

shareBtn.addEventListener("click", shareCurrent);
copyLinkBtn.addEventListener("click", copyLink);

// 進站時：若網址帶 ?id=xx，直接顯示那支籤
(function init() {
  const url = new URL(window.location.href);
  const id = url.searchParams.get("id");
  if (id) {
    const lot = getLotById(id);
    if (lot) showResult(lot);
    else showHome();
  } else {
    showHome();
  }
})();
