// document.addEventListener("DOMContentLoaded", () => {
//   const loadingOverlay = document.getElementById("loading-overlay");
//   const content = document.getElementById("content");

//   setTimeout(() => {
//     loadingOverlay.style.display = "none";
//     content.classList.remove("content-hidden");
//   }, 1000); 
// });

  const loader = document.getElementById("loading-overlay");

  // Attach to ALL anchor tags that navigate
  document.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", (e) => {
      // optional: skip if it's just a hash link (#)
      if (link.getAttribute("href").startsWith("#")) return;

      // show loader immediately
      loader.style.display = "flex";  

      // content hidden (optional if you want it blank)
      const content = document.getElementById("content");
      if (content) content.style.display = "none";
    });
  });
