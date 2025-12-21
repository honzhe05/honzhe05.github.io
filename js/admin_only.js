const title = document.querySelector("h2");
let clickCount = 0;
const requiredClicks = 5;
const timeWindow = 2000;
let timer;

title.addEventListener("click", () => {
  clickCount++;

  if (clickCount === 1) {
    timer = setTimeout(() => {
      clickCount = 0;
    }, timeWindow);
  }

  if (clickCount >= requiredClicks) {
    clearTimeout(timer);
    clickCount = 0;
    window.location.href = "add_store.html";
  }
});