let head = "https://www.google.com/maps/search/"

document.getElementById("addStoreBtn").addEventListener("click", () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const name = document.getElementById("storeName").value;
  const category = document.getElementById("storeCategory").value;

  if (!username || !password || !name) {
    alert("Incomplete information");
    return;
  }
  let map = head + encodeURIComponent(name);

  fetch("https://honzhe05-github-io.onrender.com/api/add_store", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({username, password, name, map, category})
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    if (data.success) {
      location.reload();
    }
  })
  .catch(err => console.error(err));
});


const addStore = document.getElementById("addStore");
const removeStore = document.getElementById("removeStore");
document.querySelectorAll('input[name="stepType"]').forEach(radio => {
  radio.addEventListener("change", () => {
    if (radio.value === "add") {
      addStore.style.display = "block";
      removeStore.style.display = "none";
    } else if (radio.value === "remove") {
      addStore.style.display = "none";
      removeStore.style.display = "block";
    }
  });
});

document.getElementById("removeStoreBtn").addEventListener("click", () => {
  const id = document.getElementById("storeId").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username || !password || !id) {
    alert("Incomplete information");
    return;
  }
  if (!confirm("confirm delete?")) return;

  fetch("https://honzhe05-github-io.onrender.com/api/delete_store", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ id, username, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert("Delete succeeded");
      location.reload();
    } else {
      alert("Delete failed");
    }
  })
  .catch(err => console.error('Delete shop error', err));
});

fetch("https://honzhe05-github-io.onrender.com/api/stores")
  .then(res => res.json())
  .then(data => {
    const storesData = [];
    Object.entries(data).forEach(([category, stores]) => {
      stores.forEach(store => storesData.push(store));
    });

    const tbody = document.querySelector("#storeTable tbody");
    tbody.innerHTML = "";

    storesData.forEach((store, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="td">${store.id}</td>
        <td class="td">${store.name}</td>
      `;
      tbody.appendChild(tr);
    });
  })
  .catch(err => console.error('Error loading stores.json', err));