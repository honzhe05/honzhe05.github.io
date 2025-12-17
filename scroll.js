let scrollTimer = null;
const HIDE_DELAY = 2500;

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
