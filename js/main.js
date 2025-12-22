let isPicking = false;
let stores = {};
let updateInfo = { version: 0 };

if (!window.location.hash) {
  window.location.hash = "#all";
}

function applyHashCategory() {
  const hash = location.hash.replace("#", "");
  if (!hash) return;

  const radio = document.querySelector(`input[name="category"][value="${hash}"]`);
  if (radio) radio.checked = true;
}

applyHashCategory();

window.addEventListener("hashchange", () => {
  applyHashCategory();
  console.log("hash changed")
});

document.querySelectorAll('input[name="category"]').forEach(radio => {
  radio.addEventListener("change", () => {
    location.hash = radio.value;
  });
});

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

const savedDate = localStorage.getItem("pick_date");
const today = todayStr();

if (savedDate !== today) {
  localStorage.setItem("historyList", "[]");
  localStorage.setItem("pick_date", today);
  localStorage.setItem("pick_times", "0");
}
let times = parseInt(localStorage.getItem("pick_times") || "0", 10);
let history = JSON.parse(localStorage.getItem("historyList") || "[]");

fetch("/config/version_info.json?v=" + Date.now())
  .then(res => res.json())
  .then(data => {
    updateInfo.version = data.version;
  
    document.getElementById("update-time").textContent =
      "Last update: " + data.last_update;
  
    return fetch("https://honzhe05-github-io.onrender.com/api/stores");
  })
  .then(res => res.json())
  .then(data => {
    stores = data;
  
    let TotalStores = 0;
    for (const ca in stores) {
      TotalStores += stores[ca].length;
    }
  
    document.getElementById("total").textContent =
      "Current total number of stores: " + TotalStores;
  })
  .catch(err => {
    alert("Error loading data. Please reload the page.");
    console.error(err);
  });

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
    spinner.style.opacity = 0;
    spinner.style.transform = "scale(0.5)";

    setTimeout(() => {
      spinner.style.display = "none";
      resolve();
    }, 500);
  });
}

document.querySelectorAll('input[name="category"]').forEach(radio => {
  radio.addEventListener("change", () => {
    location.hash = radio.value;
  });
});

async function pickStore() {
  if (isPicking) return;
  isPicking = true;
  
  showSpinner();
  const startBtn = document.getElementById("StartBtn");
  startBtn.disabled = true;
  startBtn.textContent = "Drawing...";
  await new Promise(res => setTimeout(res, 800));
  await hideSpinner();
  isPicking = false;
  startBtn.disabled = false;
  startBtn.textContent = "Start Drawing";

  const resultDiv = document.getElementById("result");

  let cat = getSelectedCategory();
  if (cat === "all") {
    const categories = Object.keys(stores);
    cat = randomPick(categories);
  }
  const list = stores[cat] ?? [];
  if (list.length === 0) return alert("No shops of this type were found.");
  const pick = randomPick(list);
  
  history.unshift({ name: pick.name, cat: cat, map: pick.map });

  resultDiv.innerHTML = `
    <h3>What u drew is...</h3>
    <h4>${pick.name} (${cat})</h4>
    <a href="${pick.map}" target="_blank">Open In Google Maps</a>
    <button id="shareBtn">Share</button>
    <button id="historyBtn">History</button>
    <button id="clearBtn" style="display:none;">Clear</button>
    <div id="historyList" class="his"></div>
  `;
  
  const shareBtn = document.getElementById("shareBtn");
  if (navigator.share) {
    shareBtn.addEventListener("click", () => {
      navigator.share({
        title: "️Today eat this...",
        text: `I've decided to go to ${pick.name}\n${pick.map}`
      })
      .then(() => alert("Shared successfully"))
      .catch((error) => console.log("Share failed", error));
    });
  } else {
    shareBtn.style.display = "none";
  }
  
  const historyBtn = document.getElementById("historyBtn");
  const historyList = document.getElementById("historyList");
  const clearBtn = document.getElementById("clearBtn")
  historyBtn.addEventListener("click", () => {
    if (getComputedStyle(historyList).display === "none") {
      historyList.style.display = "block";
      clearBtn.style.display = "inline-block"
      historyList.innerHTML = history.map((h, i) =>
        `<p>${i + 1}. ${h.name} (${h.cat}) - <a href="${h.map}" target="_blank">Map</a></p>`
      ).join("");
      localStorage.setItem("historyList", JSON.stringify(history));
    } else {
      historyList.style.display = "none";
      clearBtn.style.display = "none";
    }
  });
  
  clearBtn.addEventListener("click", () => {
    if (clearBtn.style.display === "inline-block") {
      history = [];
      localStorage.setItem("historyList", "[]");
      historyList.style.display = "none";
      historyBtn.style.display = "none";
      clearBtn.style.display = "none";
    }
  });

  times += 1;
  localStorage.setItem("pick_times", times.toString());
  if (times >= 3) {
    choose.textContent = "Today u've already struggled to decide " + times + " times. zzz";
    bottom1.style.opacity = 0;
    bottom1.style.display = "flex";
    void bottom1.offsetWidth;
    bottom1.style.transition = "opacity 1s";
    bottom1.style.opacity = 1;
  }
};

document.getElementById("StartBtn").addEventListener("click", () => {
  if (!stores || Object.keys(stores).length === 0) return alert("Wait a moment, the data hasn't been prepared yet.");
  document.getElementById("result").innerHTML = "";
  
  pickStore();
  
  gtag('event', 'start_drawing_click', {
    'event_category': 'interaction',
    'event_label': 'Start Drawing Button'
  });
});

document.getElementById("githubBtn").addEventListener("click", () => {
  window.open("https://github.com/honzhe05/honzhe05.github.io");
})

document.getElementById("toInfoBtn").addEventListener("click", () => {
  window.location.href = "stores_info.html?category=all&page=1";
});
