document.getElementById("addStoreBtn").addEventListener("click", () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const name = document.getElementById("storeName").value;
  const map = document.getElementById("storeMap").value;
  const category = document.getElementById("storeCategory").value;

  fetch("/api/stores", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({username, password, name, map, category})
  })
  .then(res => res.json())
  .then(data => alert(data.message))
  .catch(err => console.error(err));
});