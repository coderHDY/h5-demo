const card = document.querySelector(".card");
const timer = document.querySelector(".timer");

function loveIt() {
  const loveIcon = document.createElement("div");
  loveIcon.innerText = "❤️";
  loveIcon.style.top = `${Math.random() * 100}vh`;
  loveIcon.style.left = `${Math.random() * 100}vw`;
  loveIcon.classList.add("love-icon");
  document.body.append(loveIcon);
  timer.innerText++;
  setTimeout(() => document.body.removeChild(loveIcon), 500);
}

card.addEventListener("dblclick", loveIt)