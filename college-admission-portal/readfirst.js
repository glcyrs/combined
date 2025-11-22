// =============================================
// DOWNLOAD HANDLER (kept the same)
// =============================================
const downloads = [
  'assets/grades_form_1.pdf',
  'assets/grades_form_2.pdf'
];

document.querySelectorAll('.grade-card').forEach((card, index) => {
  card.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = downloads[index];
    link.download = downloads[index].split('/').pop();
    link.click();
  });
});

// =============================================
// UNIFIED STEP SYSTEM (Same as confirmation.js)
// =============================================

// Step index → page map
const pageMap = [
  "index.html",
  "readfirst.html",
  "confirmation.html",
  "aap.html",
  "personal.html",
  "educattach.html",
  "programs.html",
  "form.html",
  "submit.html"
];

// Detect current page
let currentPage = window.location.pathname.split("/").pop().toLowerCase();
if (!currentPage) currentPage = "index.html";

// Determine step index
let currentStep = pageMap.indexOf(currentPage);

// Load saved max progress (UNIFIED KEY)
let maxUnlockedStep = parseInt(localStorage.getItem("maxUnlockedStep")) || 0;

// Unlock new step if reached
if (currentStep > maxUnlockedStep) {
  maxUnlockedStep = currentStep;
  localStorage.setItem("maxUnlockedStep", maxUnlockedStep);
}

// Get step UI circles
const steps = document.querySelectorAll(".step");

// Update UI (same logic as confirmation.js)
function updateStepsUI() {
  steps.forEach((step, index) => {
    const circle = step.querySelector("span");
    const icon = step.querySelector("i");
    const label = step.querySelector("p");

    const isActive = index === currentStep;
    step.classList.toggle("active", isActive);

    if (index <= maxUnlockedStep) {
      // unlocked
      step.classList.add("clickable");
      step.style.pointerEvents = "auto";
      step.style.cursor = "pointer";

      if (icon) icon.style.opacity = "1";
      if (label) label.style.opacity = "1";
      if (circle) circle.style.borderColor = isActive ? "#1a9737" : "#ccc";

      step.onclick = () => {
        localStorage.setItem("maxUnlockedStep", Math.max(maxUnlockedStep, index));
        window.location.href = pageMap[index];
      };
    } else {
      // locked
      step.classList.remove("clickable");
      step.style.pointerEvents = "none";
      step.style.cursor = "default";

      if (circle) circle.style.borderColor = "#ddd";
      if (icon) icon.style.opacity = "0.4";
      if (label) label.style.opacity = "0.5";

      step.onclick = null;
    }
  });
}

updateStepsUI();

console.log("✅ readfirst.js (unified version) loaded successfully");

// =============================================
// ADD NEXT BUTTON HANDLER (same behavior kept)
// =============================================
const checkNextBtn = setInterval(() => {
  const nextBtn = document.querySelector(".next-btn");
  if (nextBtn) {
    console.log("➡️ .next-btn ready");

    nextBtn.addEventListener("click", () => {
      console.log("➡️ Next clicked → go to Confirmation");

      // Unlock confirmation page automatically
      localStorage.setItem("maxUnlockedStep", Math.max(maxUnlockedStep, 2));

      window.location.href = "confirmation.html";
    });

    clearInterval(checkNextBtn);
  }
}, 300);