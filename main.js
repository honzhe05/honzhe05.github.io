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
document.getElementById("StartBtn").addEventListener("click", () => {
  if (!stores || Object.keys(stores).length === 0) {
    return alert("資料尚未載入，請稍等...");
  }

  let cat = getSelectedCategory();
  if (!cat) return alert("請選分類");
  
  if (cat === "all") {
    const categories = Object.keys(stores);
    // ["drink","food","snack","other"]
    cat = randomPick(categories);
  }

  const list = stores[cat] ?? [];
  if (list.length === 0) return alert("這個分類沒有店家");

  const pick = randomPick(list);

  alert(`今天抽到的是：\n   ${pick.name}  (分類: ${cat})`);
  window.open(pick.map);
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
