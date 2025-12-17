let storesData = {};
const perPage = 14;
let currentPage = 1;
let totalPages = 1;
let currentCategory = "all"

document.addEventListener("DOMContentLoaded", () => {
  getPageFromURL();
});

function getPageFromURL() {
  const params = new URLSearchParams(window.location.search);

  const cat = params.get("category");
  const page = parseInt(params.get("page"), 10);

  if (cat && ["all", "food", "drink", "snack", "other"].includes(cat)) {
    currentCategory = cat;

    const radio = document.querySelector(
      `input[name="category"][value="${cat}"]`
    );
    if (radio) radio.checked = true;
  } else {
    currentCategory = "all";
  }

  if (!isNaN(page) && page >= 1) {
    currentPage = page;
  } else {
    currentPage = 1;
  }
}

function updateURL() {
  const url = new URL(window.location);
  url.searchParams.set("category", currentCategory);
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
  let category = currentCategory;
  let list = [];
  
  if (category === "all") {
    for (const key in storesData) {
      storesData[key].forEach(store => {
        list.push({ ...store, category: key });
      });
    }
  } else {
    list = storesData[category] ?? [];
  }

  totalPages = Math.ceil(list.length / perPage) || 1;
  
  document.getElementById("total").textContent =
    "Total number of " + category + "-type stores: " + list.length;

  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  const pageItems = list.slice(start, end);

  const tbody = document.querySelector("#storeTable tbody");
  tbody.innerHTML = "";

  pageItems.forEach(store => {
    const tr = document.createElement("tr");
    let cat;
    if (category === "all") {
      cat = store.category;
    } else {
      cat = category;
    }
    
    tr.innerHTML = `
      <td class="td">${cat}</td>
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

firstBtn.onclick = () => {
  currentPage = 1;
  renderPage();
};
prevBtn.onclick = () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage();
  }
};
nextBtn.onclick = () => {
  if (currentPage < totalPages) {
    currentPage++;
    renderPage();
  }
};
lastBtn.onclick = () => {
  currentPage = totalPages;
  renderPage();
};

document.querySelectorAll('input[name="category"]').forEach(radio => {
  radio.addEventListener("change", () => {
    currentPage = 1;
    currentCategory = radio.value;
    renderPage();
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
