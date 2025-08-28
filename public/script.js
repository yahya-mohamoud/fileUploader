document.addEventListener("DOMContentLoaded", () => {
  const loadingOverlay = document.getElementById("loading-overlay");
  const content = document.getElementById("content");


    loadingOverlay.style.display = "none";
    content.classList.remove("content-hidden");
 
});