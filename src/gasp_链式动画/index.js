const ball = document.querySelector(".ball");
const rectangle = document.querySelector(".rectangle");
const restart = document.querySelector(".restart");

const asyncGsap = async (element, props) =>
  new Promise((resolve, reject) => {
    gsap.to(element, {
      ...props,
      onComplete: () => {
        resolve();
      },
    });
  });

const start = async () => {
  await asyncGsap(ball, {
    rotation: 3600,
    x: 1000,
    duration: 3,
    backgroundColor: "blue",
    ease: "power2.easeInOut",
  });
  await asyncGsap(rectangle, {
    rotation: 1800,
    x: 800,
    duration: 2,
    backgroundColor: "blue",
    ease: "elastic",
  });
  await asyncGsap(ball, {
    rotation: -3600,
    x: 0,
    duration: 3,
    backgroundColor: "pink",
    ease: "power2.easeInOut",
  });
  await asyncGsap(rectangle, {
    rotation: -1800,
    x: 0,
    y: -90,
    duration: 2,
    backgroundColor: "#f00",
    ease: "linear",
  });
};
start();

restart.addEventListener("click", () => {
  start();
});
