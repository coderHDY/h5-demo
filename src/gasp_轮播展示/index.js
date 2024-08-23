const rabbit1 = document.querySelector(".rabbit1");
const rabbit2 = document.querySelector(".rabbit2");
const rabbit3 = document.querySelector(".rabbit3");
const rabbit4 = document.querySelector(".rabbit4");

const asyncGsap = async (element, props) =>
  new Promise((resolve, reject) => {
    gsap.to(element, {
      ...props,
      onComplete: () => {
        resolve();
      },
    });
  });

const loopShow = async (elements, duration) => {
  for (element of elements) {
    asyncGsap(element, {
      duration,
      display: "block",
    });
    await asyncGsap(element, {
      duration,
      display: "none",
    });
  }
  loopShow(elements, duration);
};

loopShow([rabbit1, rabbit2, rabbit3, rabbit4], 1);
