  // login and signup page loading animation
document.addEventListener("DOMContentLoaded", () => {

   
  
  // toggle loggin  password
  const password = document.querySelector('#password')
  const toggleBtn = document.querySelector('#togglePassword')
  const icon = toggleBtn.querySelector('i')
  
  toggleBtn.addEventListener('click', () => {
    const type = password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type)
    icon.classList.toggle("fa-eye")
    icon.classList.toggle("fa-eye-slash");
})



})