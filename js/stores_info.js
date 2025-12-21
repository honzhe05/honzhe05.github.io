let storesData = {};
const perPage = 14;
let totalPages = 1;
let currentPage = 1;
let currentCategory = "all";
let currentSearch = "";
let currentSort = "default";

document.addEventListener("DOMContentLoaded", () => {
  getPageFromURL();
});

function getPageFromURL() {
  const params = new URLSearchParams(window.location.search);

  const cat = params.get("category");
  const page = parseInt(params.get("page"), 10);
  const sort = params.get("sort");
  const search = params.get("search");

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
  
  if (sort && ["name-asc", "name-desc"].includes(sort)) {
    currentSort = sort;
    document.getElementById("sortSelect").value = sort;
  } else {
    currentSort = "default";
  }
  
  if (search) {
    currentSearch = search;
    document.getElementById("searchInput").value = search;
  } else {
    currentSearch = "";
  }
}

function updateURL() {
  const url = new URL(window.location);
  url.searchParams.set("category", currentCategory);
  url.searchParams.set("page", currentPage);
  
  if (currentSort != "default") {
    url.searchParams.set("sort", currentSort);
  }
  if (currentSearch) {
    url.searchParams.set("search", currentSearch);
  } else {
    url.searchParams.delete("search");
  }
  history.replaceState(null, "", url);
}

fetch("version_info.json?v=" + Date.now())
  .then(res => res.json())
  .then(data => {
    document.getElementById("update-time").textContent =
      "Last update: " + data.last_update;
  });

fetch("https://honzhe05-github-io-1.onrender.com/api/stores")
  .then(res => res.json())
  .then(data => {
    storesData = data;
    renderPage();
  })
  .catch(err => console.error('Error loading stores.json', err));
  
function sortList(list) {
  if (currentSort === "name-asc") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }
  if (currentSort === "name-desc") {
    list.sort((a, b) => b.name.localeCompare(a.name));
  }
  if (currentSort === "category") {
    list.sort((a, b) =>
      (a.category || "").localeCompare(b.category || "")
    );
  }
}

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
  
  if (currentSearch) {
    const keyword = currentSearch.toLowerCase();
    list = list.filter(store =>
      store.name.toLowerCase().includes(keyword)
    );
  }
  list = [...list];
  sortList(list);
  
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

  if (pageItems.length === 0) {
    const tr = document.createElement("tr");const msg = currentSearch
      ? `No result for "${currentSearch}"`
      : "No stores found.";

    tr.innerHTML = `
      <td class="td empty" colspan="3">
        ${msg}
      </td>
    `;
    tbody.appendChild(tr);
    return;
  } else {
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
  }

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

searchInput.addEventListener("input", () => {
  currentSearch = searchInput.value.trim();
  currentPage = 1;
  renderPage();
});
sortSelect.addEventListener("change", () => {
  currentSort = sortSelect.value;
  currentPage = 1;
  renderPage();
});

document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "index.html#all";
});

document.getElementById("viewBtn").addEventListener("click", () => {
  window.open("https://honzhe05-github-io-1.onrender.com/api/stores")
});
