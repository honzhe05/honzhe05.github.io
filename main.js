let times = 0;
let isPicking = false;
let stores = {};
let updateInfo = { version: 0 };

fetch("update_time.json?v=" + Date.now())
  .then(res => res.json())
  .then(data => {
    updateInfo.version = data.version;

    document.getElementById("update-time").textContent =
      "Last update: " + data.last_update;

    return fetch("stores.json?v=" + updateInfo.version);
  })
  .then(res => res.json())
  .then(data => {
    stores = data;
    console.log("資料載入完成", stores);

    let TotalStores = 0;
    for (const ca in stores) {
      TotalStores += stores[ca].length;
    }

    document.getElementById("total").textContent =
      "Current total number of stores: " + TotalStores;
  })
  .catch(err => console.error(err));

function getSelectedCategory() {
  return document.querySelector('input[name="category"]:checked')?.value;
}

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const spinner = document.getElementById("spinner");
const bottom1 = document.querySelector(".bottom1");
const choose = document.getElementById("choose");

function showSpinner() {
  spinner.style.display = "block";
  spinner.style.opacity = 0;
  spinner.style.transform = "scale(0.5)";

  void spinner.offsetWidth;

  spinner.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  spinner.style.opacity = 1;
  spinner.style.transform = "scale(1)";
}

function hideSpinner() {
  return new Promise(resolve => {
    // 淡出
    spinner.style.opacity = 0;
    spinner.style.transform = "scale(0.5)";

    setTimeout(() => {
      spinner.style.display = "none";
      resolve();
    }, 500);
  });
}

async function pickStore() {
  if (isPicking) return;
  isPicking = true;
  
  showSpinner();
  const startBtn = document.getElementById("StartBtn");
  startBtn.disabled = true;
  await new Promise(res => setTimeout(res, 800));
  await hideSpinner();
  isPicking = false;
  startBtn.disabled = false;

  const resultDiv = document.getElementById("result");

  let cat = getSelectedCategory();
  if (cat === "all") {
    const categories = Object.keys(stores);
    cat = randomPick(categories);
  }
  const list = stores[cat] ?? [];
  if (list.length === 0) return alert("這個分類沒有店家");
  const pick = randomPick(list);

  resultDiv.innerHTML = `
    <h3>What u drew is...</h3>
    <h4>${pick.name} (${cat})</h4>
    <a href="${pick.map}" target="_blank">Open In Google Maps</a>
  `;

  times += 1;
  if (times >= 3) {
    choose.textContent = "U've already struggled to decide " + times + " times. zzz";
    bottom1.style.opacity = 0;
    bottom1.style.display = "flex";
    void bottom1.offsetWidth;
    bottom1.style.transition = "opacity 1s";
    bottom1.style.opacity = 1;
  }
};

document.getElementById("StartBtn").addEventListener("click", () => {
  if (!stores || Object.keys(stores).length === 0) return alert("資料尚未載入，請稍等...");
  document.getElementById("result").innerHTML = "";
  
  pickStore();
});

document.getElementById("downloadBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(stores, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "stores.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});


document.getElementById("githubBtn").addEventListener("click", () => {
  window.open("https://github.com/honzhe05/honzhe05.github.io");
})
