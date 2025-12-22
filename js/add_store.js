let head = "https://www.google.com/maps/search/"

document.getElementById("addStoreBtn").addEventListener("click", () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const name = document.getElementById("storeName").value;
  const category = document.getElementById("storeCategory").value;

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
      const resultDiv = document.getElementById("result");
      const storeLink = `<p>Added: <a href="${map}" target="_blank">${name}</a> (${category})</p>`;
      resultDiv.innerHTML = storeLink;
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