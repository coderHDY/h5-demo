const tiger1 = document.querySelector(".tiger1");
const tiger2 = document.querySelector(".tiger2");
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

const blinkMove = (
  elements,
  {
    allDuration,
    duration = 0.5,
    fromX = 0,
    fromY = 0,
    toX,
    toY,
    forward = true,
  }
) => {
  const stepX = (toX - fromX) / (allDuration / duration);
  const stepY = (toY - fromY) / (allDuration / duration);
  let currentTime = 0;
  let currentX = fromX;
  let currentY = fromY;
  const move = async (element, fx, fy, tx, ty) => {
    await new Promise((resolve) => {
      gsap.fromTo(
        element,
        {
          x: fx,
          y: fy,
          display: "block",
          duration,
        },
        {
          x: tx,
          y: ty,
          duration,
          display: "block",
          onComplete: () => {
            resolve();
          },
        }
      );
    });
  };
  const moveAll = async () => {
    let idx = 0;
    while (currentTime < allDuration) {
      const element = elements[idx];
      await move(
        element,
        currentX,
        currentY,
        currentX + stepX,
        currentY + stepY
      );
      gsap.set(element, { display: "none" });
      currentTime += duration;
      currentX += stepX;
      currentY += stepY;
      idx = (idx + 1) % elements.length;
    }
    console.log("currentTime", currentTime);
    if (forward) {
      currentX = toX;
      currentY = toY;
      gsap.set(elements[idx], { display: "block", x: toX, y: toY });
    }
  };
  return new Promise(async (resolve) => {
    await moveAll();
    resolve();
  });
};

// 缺是否闪动到指定位置
// 缺暂停控制
const onRestart = () => {
  restart.setAttribute("disabled", true);
  blinkMove([tiger1, tiger2], {
    allDuration: 10,
    duration: 0.5,
    fromX: 0,
    fromY: 0,
    toX: 300,
    toY: 100,
    forward: true,
  }).then(() => {
    restart.removeAttribute("disabled");
  });
};

restart.addEventListener("click", onRestart);
onRestart();
