const nav = document.querySelector(".nav-bar");

function onScroll(e) {
  nav.classList[this.scrollY > 200 ? "add" : "remove"]("small");
}

window.addEventListener("scroll", onScroll);