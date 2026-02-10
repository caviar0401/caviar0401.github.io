import { LOTS } from "./lots.js";

const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const $ = (sel, root=document) => root.querySelector(sel);
// ---- Snackbar ----
function showSnackbar(message, duration = 3000) {
  const snackbar = document.createElement('div');
  snackbar.className = 'snackbar';
  snackbar.textContent = message;
  document.body.appendChild(snackbar);
  
  // 觸發動畫
  setTimeout(() => snackbar.classList.add('show'), 10);
  
  // 自動消失
  setTimeout(() => {
    snackbar.classList.remove('show');
    setTimeout(() => snackbar.remove(), 300);
  }, duration);
}
const tabs = $$(".tab");
const pages = $$(".page");
const pageTitle = $("#pageTitle");

// Home components
const panel = $(".panel");
const jarWrap = $(".jarWrap");
const drawBtn = $("#drawBtn");
const shareBtn = $("#shareBtn");
const againBtn = $("#againBtn");
const appointBtn = $("#appointBtn");

const rPersonality = $("#rPersonality");
const rYearFortune = $("#rYearFortune");

const resultCard = $("#resultCard");
const resultCard2 = $("#resultCard2");
const rTitle = $("#rTitle");
const rPoem = $("#rPoem");
const rExplain = $("#rExplain");
const rTitle2 = $("#rTitle2");
const partnerBtn = $("#partnerBtn");

const btnPrerequest = $("#btnPrerequest");

// ---- Tab Router ----
const TITLES = {
  home: "線上靈籤解惑",
  prizes: "開運平安好物",
  activity: "媽祖賜福活動",
  author: "預約專屬解籤",
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
  const valid = ["home","prizes","activity","author","partner"];
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
  // 只在有實際內容時才顯示
  if (!lot || !lot.poem) {
    return;
  }
  
  rTitle.textContent = lot.title ?? `第 ${lot.id} 籤`;
  rTitle2.textContent = lot.title ?? `第 ${lot.id} 籤`;
  
  // 將籤詩按空格分成四行顯示
  const poem = lot.poem ?? "";
  const lines = poem.split(' ').filter(line => line.trim() !== '');
  rPoem.textContent = lines.join('\n');
  
  // 添加隨機位置的星光符號
  addSparkles(rPoem);
  
  if(selectedTopic === null){
    rExplain.textContent = lot.explain ?? "";
  }else if(selectedTopic === "love"){
    rExplain.textContent = "良緣感情："+ (lot.love ?? "");
  }else if(selectedTopic === "career"){
    rExplain.textContent =  "事業前程："+ (lot.career ?? "");
  }else if(selectedTopic === "money"){
    rExplain.textContent = "財運投資："+ (lot.money ?? "");
  }else if(selectedTopic === "health"){
    rExplain.textContent = "健康平安："+ (lot.health ?? "");
  }else{
    rExplain.textContent = lot.explain ?? "";
  }
  
  // 隱藏表單
  panel.classList.add("hidden");
  
  // 顯示結果卡
  resultCard.classList.remove("hidden");
  resultCard2.classList.remove("hidden");
  
  // 滾動到結果
  setTimeout(() => {
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

// 添加随机星光符号
function addSparkles(container) {
  // 移除旧的星光
  removeSparkles(container);
  
  const sparkleSymbols = ['✧', '✦', '⋆', '★', '✵'];
  const sparkleCount = 8; // 星光数量
  
  for (let i = 0; i < sparkleCount; i++) {
    const sparkle = document.createElement('span');
    sparkle.className = 'poem-sparkle';
    sparkle.textContent = sparkleSymbols[Math.floor(Math.random() * sparkleSymbols.length)];
    
    // 随机位置（避开中心区域）
    const side = Math.floor(Math.random() * 4); // 0:上, 1:右, 2:下, 3:左
    let top, left;
    
    switch(side) {
      case 0: // 上方
        top = Math.random() * 20 + 5 + '%';
        left = Math.random() * 80 + 10 + '%';
        break;
      case 1: // 右方
        top = Math.random() * 80 + 10 + '%';
        left = Math.random() * 20 + 75 + '%';
        break;
      case 2: // 下方
        top = Math.random() * 20 + 75 + '%';
        left = Math.random() * 80 + 10 + '%';
        break;
      case 3: // 左方
        top = Math.random() * 80 + 10 + '%';
        left = Math.random() * 20 + 5 + '%';
        break;
    }
    
    sparkle.style.top = top;
    sparkle.style.left = left;
    sparkle.style.animationDelay = (Math.random() * 2) + 's';
    sparkle.style.fontSize = (Math.random() * 8 + 12) + 'px';
    
    container.appendChild(sparkle);
  }
}

// 移除星光符号
function removeSparkles(container) {
  const sparkles = container.querySelectorAll('.poem-sparkle');
  sparkles.forEach(s => s.remove());
}

function clearResult(){
  rExplain.textContent = "";
  rTitle.textContent = "";
  rTitle2.textContent = "";
  rPoem.textContent = "";
  rPersonality.textContent = "—";
  rYearFortune.textContent = "—";
  
  // 移除星光符號
  removeSparkles(rPoem);

  // 隱藏結果卡
  resultCard.classList.add("hidden");
  resultCard2.classList.add("hidden");
  
  // 顯示表單
  panel.classList.remove("hidden");
}

// ---- Draw animation (3s with settle) ----
let isDrawing = false;

drawBtn.addEventListener("click", () => {

  if (!nameInput.value.trim()) {
    return;
  }
  
  // 驗證生辰
  if (!birthInput.value) {
    return;
  }
  
  // 驗證問事方向
  if (!selectedTopic) {
    return;
  }  

  if (isDrawing) return;
  isDrawing = true;

  // 抽到的籤先決定好
  const lot = drawRandomLot();

  console.log("抽到籤號：", lot.id);
  postProducts(lot.id);
  // 先隱藏結果卡（避免連抽時視覺混亂）
  resultCard.classList.add("hidden");
  resultCard2.classList.add("hidden");

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
  showSnackbar("已複製分享連結！");
}
async function copyLink(){
  await navigator.clipboard.writeText(window.location.href);
  showSnackbar("已複製結果連結！");
}

async function appoint() {
  setTab("author");
}

shareBtn?.addEventListener("click", shareCurrent);
appointBtn?.addEventListener("click", appoint);
againBtn?.addEventListener("click", clearResult);

btnPrerequest?.addEventListener("click", postContact);

// ---- Partner button (示範導向外部表單) ----
partnerBtn?.addEventListener("click", () => {
  // TODO: 改成你的 SurveyCake / Google Form 連結
  window.open("https://www.surveycake.com/s/WQ7WZ", "_blank");
});

// ---- Products API ----
async function loadProducts() {
  const container = $("#productsContainer");
  if (!container) return;

  try {
    const response = await fetch("https://api.allcares.app/products");
    if (!response.ok) throw new Error("Failed to fetch products");
    
    const products = await response.json();
    
    // 清空容器
    container.innerHTML = "";
    
    // 確保 products 是陣列
    const productArray = Array.isArray(products) ? products : (products.data || []);
    
    // 獲品等級對應表
    const prizeLabels = ["良緣感情", "事業前程", "財運投資", "健康平安", "五等獎"];
    
    // 動態生成商品卡片
    productArray.forEach((product, index) => {
      const card = document.createElement("div");
      card.className = "productCard";
      
      // 獲取獲品等級標籤（如果有 prize 屬性則使用，否則依序使用）
      const prizeLevel = product.prize || prizeLabels[index] || "普通獎";

      const productQuantity = product["quantity"] ? `限量 `+product["quantity"]+ " 組" : "不限量";
      
      card.innerHTML = `
        <div class="prizeBadge">${prizeLevel}</div>
        <div class="productImg">${product.img || "📦"}</div>
        <div class="productBody">
          <div class="productTitle">${product.title || "商品名稱"}</div>
          <div class="productDesc">${product.description || ""}</div>
          <div class="productPrice">優惠價 NT$ ${product.price || "0"}</div>
        </div>
        <div class="productQuantity">${productQuantity}</div>
      `;
      
      container.appendChild(card);
    });
  } catch (error) {
    console.error("載入商品失敗:", error);
    container.innerHTML = '<div style="text-align: center; padding: 2rem; color: #999;">商品載入中...</div>';
  }
}

// 全局變數存儲選中的問事方向
let selectedTopic = null;

// ---- Init ----
(function init(){
  initTabFromUrl();
  
  // 載入商品數據
  loadProducts();
  
  // 頁面加載完成後隱藏加載畫面
  window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 500);
      }, 3000); // 延遲 3 秒讓用戶看到加載動畫
    }
  });
})();


// 問事方向選擇
const topicBtns = document.querySelectorAll('.chip[data-topic]');
topicBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    topicBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedTopic = btn.dataset.topic;
  });
});

// 驗證並抽籤 (必須是全局函數)
window.validateAndDraw = async function() {
  const nameInput = document.getElementById('nameInput');
  const birthInput = document.getElementById('birthInput');
  const genderInputs = document.getElementsByName('gender');
  
  // 驗證姓名
  if (!nameInput.value.trim()) {
    showSnackbar('請輸入您的姓名');
    nameInput.focus();
    return;
  }
  
  // 驗證生辰
  if (!birthInput.value) {
    showSnackbar('請選擇您的生辰');
    birthInput.focus();
    return;
  }
  
  // 驗證問事方向
  if (!selectedTopic) {
    showSnackbar('請選擇問事方向');
    return;
  }
  
  
// 呼叫 API 取得籤詩結果
    try {
        const nameInput = document.getElementById('nameInput');
        const birthInput = document.getElementById('birthInput');
        
        // 解析生辰日期和時間
        const birthDateTime = birthInput.value; // "1975-09-24T08:00"
        const birthDate = birthDateTime.split('T')[0]; // "1975-09-24"
        const birthTime = birthDateTime.split('T')[1]?.split(':')[0] || '8'; // "08"
        // 構建 API URL (這裡需要補充 time 和 gender 參數)
        const apiUrl = `https://api.allcares.app/zwds?name=${encodeURIComponent(nameInput.value)}&bir=${birthDate}&time=${birthTime}&gender=${genderInputs[0].checked ? '1' : '0'}&topic=${encodeURIComponent(selectedTopic)}`;
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('API 請求失敗');
        }
        
        const apiResult = await response.json();
        console.log('API 返回結果:', apiResult);
        
        rPersonality.textContent = apiResult["data"].split("|")[0];

        rYearFortune.textContent = apiResult["data"].split("|")[1];
       

        // 將 API 結果傳遞給抽籤函數
        drawLottery(apiResult);
    } catch (error) {
        console.error('API 請求錯誤:', error);
        showSnackbar('抽籤服務暫時無法使用，請稍後再試');
        return;
    }

  // 驗證通過,執行抽籤
  //drawLottery();
}

// 抽籤邏輯
function drawLottery(apiResult) {
  console.log('開始抽籤...', {
    name: document.getElementById('nameInput').value,
    birth: document.getElementById('birthInput').value,
    topic: selectedTopic,
    apiResult: apiResult
  });
  
  // 注意：不在這裡顯示 resultCard，等到 showResult 被調用時才顯示
}

async function postProducts(draw) {
  // 發送 POST 請求到指定 API

  const nameInput = document.getElementById('nameInput');
  const birthInput = document.getElementById('birthInput');
  const genderInputs = document.getElementsByName('gender');
  const contactNameInput = document.getElementById('contactNameInput');

  contactNameInput.value = nameInput.value;

  const requestBody = {
    name: nameInput.value,
    gender: genderInputs[0].checked ? '1' : '0',
    birth: birthInput.value,
    cata: selectedTopic,
    draw: draw+""
  };
  
  const response = await fetch("https://api.allcares.app/products", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        
       const data = await response.json();
       console.log('抽籤商品結果:', data);
      if(data["data"] == '銘謝惠顧'){
        rGift.textContent = "很遺憾，這次沒有抽中開運好物，請再接再厲！";
        
      }else{
        rGift.innerHTML = '恭喜您獲得開運好物<br><span style="color:yellow;font-size:16px">' + data["data"]["title"] + '，價值：'+ data["data"]["price"]+'</span><br>請至「開運平安好物」頁面查看詳情！';
        
      }
}

async function postContact() {
  // 發送 POST 請求到指定 API
  const nameInput = document.getElementById('contactNameInput');
  if (!nameInput.value.trim()) {
    showSnackbar('請輸入您的姓名');
    nameInput.focus();
    return;
  }
  const emailInput = document.getElementById('emailInput');
  const lineInput = document.getElementById('lineInput');

  const birthInput = document.getElementById('birthInput');
  const genderInputs = document.getElementsByName('gender');

  if (!emailInput.value.trim() && !lineInput.value.trim()) {
    showSnackbar('請輸入您的電子信箱或 LINE ID');
    if (!emailInput.value.trim()){
    emailInput.focus();
    }else{
    lineInput.focus();
    }
    return;
  }

  const requestBody = {
    name: nameInput.value,
    birth: birthInput.value,
    gender: genderInputs[0].checked ? '1' : '0',
    email: emailInput.value,
    line: lineInput.value,
  };
  
  const response = await fetch("https://api.allcares.app/zwdsContact", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        
       const data = await response.json();

       console.log('聯絡資訊回應結果:', data);

       showSnackbar('您的預約資訊已送出，我們會盡快與您聯絡，謝謝！', 4000);
}