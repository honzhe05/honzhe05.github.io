let stores = {};

fetch("stores.json")
  .then(res => res.json())
  .then(data => {
    stores = data;
    console.log("資料載入完成", stores);
    
    let TotalStores = 0;
    for (const ca in stores) {
      TotalStores += stores[ca].length;
    }
    
    document.getElementById("total").textContent = "Current total number of stores: " + TotalStores;
  });
  
fetch("update_time.json")
  .then(res => res.json())
  .then(data => {
    document.getElementById("update-time").textContent =
      "Last update: " + data.last_update;
  });

function getSelectedCategory() {
  return document.querySelector('input[name="category"]:checked')?.value;
}

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const spinner = document.getElementById("spinner");
function showSpinner() {
  spinner.style.display = "block";
  requestAnimationFrame(() => {
    spinner.classList.add("show");
  });
}
function hideSpinner() {
  spinner.classList.remove("show");
  
  spinner.addEventListener("transitionend", () => {
    spinner.style.display = "none";
  }, { once: true });
}

document.getElementById("StartBtn").addEventListener("click", () => {
  if (!stores || Object.keys(stores).length === 0) {
    return alert("資料尚未載入，請稍等...");
  }

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = ""; // 清空結果

  showSpinner(); // 顯示 spinner

  setTimeout(() => {
    // 先淡出 spinner
    spinner.classList.remove("show");

    spinner.addEventListener("transitionend", () => {
      spinner.style.display = "none"; // 完全隱藏 spinner

      let cat = getSelectedCategory();
      if (cat === "all") {
        const categories = Object.keys(stores);
        cat = randomPick(categories);
      }

      const list = stores[cat] ?? [];
      if (list.length === 0) return alert("這個分類沒有店家");

      const pick = randomPick(list);

      // 直接顯示結果，不淡入
      resultDiv.innerHTML = `
        <h3>What u drew is...</h3>
        <h4>${pick.name} (${cat})</h4>
        <a href="${pick.map}" target="_blank">Open In Google Maps</a>
      `;
    }, { once: true });

  }, 800); // spinner 顯示 1.5 秒
});

document.getElementById("downloadBtn").addEventListener("click", () => {
  fetch("stores.json")
    .then(res => res.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "stores.json";
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
});

document.getElementById("githubBtn").addEventListener("click", () => {
  window.open("https://github.com/honzhe05/honzhe05.github.io");
})
