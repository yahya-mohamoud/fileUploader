document.addEventListener("DOMContentLoaded", () => {
  // spinner loader
  const loadingOverlay = document.getElementById("loading-overlay");
  const content = document.getElementById("content");


  // skeleton loader
  const skeleton = document.querySelectorAll('.bucket')
  const fileContent = document.querySelectorAll('#content')

    skeleton.forEach(el => {
      el.style.display = "none"
    })
    content.classList.remove("hidden");

    fileContent.forEach(elm => {
      elm.classList.remove("hidden");
    })

});