const label = document.querySelectorAll(".wrapper .label");
const active = document.querySelector(".wrapper .active");
const wrapper = document.querySelector(".wrapper");
const body = document.body;

label.forEach(item => item.addEventListener('click', () => {
    active.classList.toggle("close");
    wrapper.classList.toggle("close");
    body.classList.toggle("close");
}))