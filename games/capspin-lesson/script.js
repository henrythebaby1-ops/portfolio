const startBtn = document.getElementById("startBtn");
const spinBtn = document.getElementById("spinBtn");
const airBtn = document.getElementById("airBtn");
const oneHandBtn = document.getElementById("oneHandBtn");
const cap = document.getElementById("cap");
const demoLabel = document.getElementById("demoLabel");
const checks = Array.from(document.querySelectorAll(".progress"));
const meter = document.getElementById("meter");
const statusText = document.getElementById("status");

function updateProgress() {
  const completed = checks.filter((item) => item.checked).length;
  const percent = Math.round((completed / checks.length) * 100);
  meter.style.width = `${percent}%`;
  statusText.textContent = `${percent}% complete`;
}

checks.forEach((item) => item.addEventListener("change", updateProgress));

startBtn.addEventListener("click", () => {
  document.querySelector(".grid").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

spinBtn.addEventListener("click", () => {
  cap.classList.remove("spin", "air", "one-hand");
  // Restart animation cleanly every click.
  void cap.offsetWidth;
  cap.classList.add("spin");
  demoLabel.textContent = "Current style: Two-Hand Spin";
});

airBtn.addEventListener("click", () => {
  cap.classList.remove("spin", "air", "one-hand");
  void cap.offsetWidth;
  cap.classList.add("air");
  demoLabel.textContent = "Current style: Air Twirl";
});

oneHandBtn.addEventListener("click", () => {
  cap.classList.remove("spin", "air", "one-hand");
  void cap.offsetWidth;
  cap.classList.add("one-hand");
  demoLabel.textContent = "Current style: One-Hand Spin";
});

updateProgress();
