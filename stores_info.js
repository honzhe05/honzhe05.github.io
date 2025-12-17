let storesData = {};
const perPage = 14;
let currentPage = getPageFromURL();
let totalPages = 1;

const urlParams = new URLSearchParams(window.location.search);
if (!urlParams.has("page")) {
  urlParams.set("page", "1");
  history.replaceState(null, "", `${window.location.pathname}?${urlParams.toString()}${window.location.hash}`);
}

function getPageFromURL() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("page")) || 1;
}

function updateURL() {
  const url = new URL(window.location);
  url.searchParams.set("page", currentPage);
  history.replaceState(null, "", url);
}

fetch("version_info.json?v=" + Date.now())
  .then(res => res.json())
  .then(data => {
    document.getElementById("update-time").textContent =
      "Last update: " + data.last_update;
  });

fetch("stores.json?v=" + Date.now())
  .then(res => res.json())
  .then(data => {
    storesData = data;
    renderPage();
  })
  .catch(err => console.error('Error loading stores.json', err));

function renderPage() {
  let list = [];
  for (const key in storesData) {
    storesData[key].forEach(store => {
      list.push({ ...store, category: key });
    });
  }

  totalPages = Math.ceil(list.length / perPage) || 1;
  
  document.getElementById("total").textContent =
    "Current total number of stores: " + list.length;

  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  const pageItems = list.slice(start, end);

  const tbody = document.querySelector("#storeTable tbody");
  tbody.innerHTML = "";

  pageItems.forEach(store => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="td">${store.category}</td>
      <td class="td">${store.name}</td>
      <td class="td"><a href="${store.map}" target="_blank">Map</a></td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById("pageInfo").textContent =
    `Page ${currentPage} of ${totalPages}`;
  document.getElementById("firstBtn").disabled = currentPage === 1;
  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = currentPage === totalPages;
  document.getElementById("lastBtn").disabled = currentPage === totalPages;
  
  updateURL();
}

document.getElementById("firstBtn").addEventListener("click", () => {
  currentPage = 1;
  renderPage();
});

document.getElementById("prevBtn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage();
  }
});

document.getElementById("nextBtn").addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    renderPage();
  }
});

document.getElementById("lastBtn").addEventListener("click", () => {
  currentPage = totalPages;
  renderPage();
});


document.querySelectorAll('input[name="category"]').forEach(radio => {
  radio.addEventListener("change", () => {
    currentPage = 1;
    renderPage(radio.value);
  });
});

document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "index.html#all";
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
  if (window.scrollY < 20) {
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