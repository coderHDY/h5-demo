const rainDiv = document.querySelector(".rain");

const mapRandom = (min, max) => Math.random() * (max - min) + min

const generateWater = () => {
    const waterDiv = document.createElement("div");
    waterDiv.classList.add("water");
    waterDiv.style.left = `${Math.random() * 100}%`;
    waterDiv.style.transform = `scale(${mapRandom(0.1, 0.7)})`;
    rainDiv.append(waterDiv);
    setTimeout(() => waterDiv.remove(), 3000)
}

setInterval(generateWater, 20);