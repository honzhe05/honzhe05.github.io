let storesData = null;

fetch("stores.json?v=" + Date.now())
  .then(res => res.json())
  .then(data => {
    storesData = data;

    const tbody = document.querySelector('#storeTable tbody');
    for (const cat in data) {
      data[cat].forEach(store => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="td">${cat}</td>
          <td class="td">${store.name}</td>
          <td class="td">
            <a href="${store.map}" target="_blank">Map</a>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }
  })
  .catch(err => console.error('Error loading stores.json', err));
    
document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "index.html";
});

document.getElementById("downloadBtn").addEventListener("click", () => {
  alert("Starting download stores.json")
  
  const blob = new Blob([JSON.stringify(storesData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "stores.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});
const toTopBtn = document.getElementById("toTopBtn");

let scrollTimer = null;
const HIDE_DELAY = 1200;

window.addEventListener("scroll", () => {
  if (window.scrollY < 200) {
    toTopBtn.style.opacity = 0;
    toTopBtn.style.pointerEvents = "none";
    return;
  }

  toTopBtn.style.opacity = 1;
  toTopBtn.style.pointerEvents = "auto";

  if (scrollTimer) clearTimeout(scrollTimer);

  scrollTimer = setTimeout(() => {
    toTopBtn.style.opacity = 0;
    toTopBtn.style.pointerEvents = "none";
  }, HIDE_DELAY);
});

toTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
