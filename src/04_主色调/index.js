// 研究库：https://github.com/lokesh/color-thief/tree/master/src
const img = document.querySelector("#img");

img.onload = function () {
  // 创建 canvas 元素
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // 将图片绘制到 canvas 上
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  // 获取图片数据
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  const pixelCount = pixels.length / 4;

  // 将像素数据转换为 Lab 颜色空间
  const labArray = new Array(pixelCount);
  for (let i = 0; i < pixelCount; i++) {
    const r = pixels[i * 4] / 255;
    const g = pixels[i * 4 + 1] / 255;
    const b = pixels[i * 4 + 2] / 255;
    const x = 0.412453 * r + 0.35758 * g + 0.180423 * b;
    const y = 0.212671 * r + 0.71516 * g + 0.072169 * b;
    const z = 0.019334 * r + 0.119193 * g + 0.950227 * b;
    const l = 116 * f(y) - 16;
    const a = 500 * (f(x) - f(y));
    const b2 = 200 * (f(y) - f(z));
    labArray[i] = [l, a, b2];
  }

  // 使用 K-Means 算法聚类获取主色调
  const clusters = kMeans(labArray, 3); // 获取三种主色调
  const rgbClusters = clusters.map((lab) => labToRgb(lab));

  console.log("主色调:", rgbClusters);
  const [firstColor, secondColor, thirdColor] = rgbClusters;
  document.body.style.backgroundColor = `rgba(${firstColor[0]}, ${firstColor[1]},${firstColor[2]}, 1)`;
};

// 辅助函数，将 Lab 颜色空间转换为 RGB 颜色空间
function labToRgb([l, a, b]) {
  let y = (l + 16) / 116;
  let x = a / 500 + y;
  let z = y - b / 200;
  let r, g, b2;

  x = 0.95047 * (x ** 3 > 0.008856 ? x ** 3 : (x - 16 / 116) / 7.787);
  y = 1.0 * (y ** 3 > 0.008856 ? y ** 3 : (y - 16 / 116) / 7.787);
  z = 1.08883 * (z ** 3 > 0.008856 ? z ** 3 : (z - 16 / 116) / 7.787);

  r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  b2 = x * 0.0557 + y * -0.204 + z * 1.057;

  r = r > 0.0031308 ? 1.055 * r ** (1 / 2.4) - 0.055 : r * 12.92;
  g = g > 0.0031308 ? 1.055 * g ** (1 / 2.4) - 0.055 : g * 12.92;
  b2 = b2 > 0.0031308 ? 1.055 * b2 ** (1 / 2.4) - 0.055 : b2 * 12.92;

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b2 * 255)];
}

// 辅助函数，计算 Lab 颜色空间中的 f 函数
function f(t) {
  return t > Math.pow(6 / 29, 3)
    ? Math.pow(t, 1 / 3)
    : t / (3 * Math.pow(6 / 29, 2)) + 4 / 29;
}

// 辅助函数，使用 K-Means 算法聚类
function kMeans(data, k) {
  let centroids = [];
  for (let i = 0; i < k; i++) {
    centroids.push(data[Math.floor(Math.random() * data.length)]);
  }

  let oldClusters, newClusters;
  do {
    oldClusters = newClusters || [];
    newClusters = new Array(k).fill().map(() => []);
    for (let i = 0; i < data.length; i++) {
      let minDist = Infinity,
        clusterIndex;
      for (let j = 0; j < k; j++) {
        let dist = distance(data[i], centroids[j]);
        if (dist < minDist) {
          minDist = dist;
          clusterIndex = j;
        }
      }
      newClusters[clusterIndex].push(data[i]);
    }
    centroids = newClusters.map((cluster) => mean(cluster));
  } while (!clustersEqual(oldClusters, newClusters));
  return centroids;
}

// 辅助函数，计算两个颜色在 Lab 颜色空间中的距离
function distance([l1, a1, b1], [l2, a2, b2]) {
  return Math.sqrt((l1 - l2) ** 2 + (a1 - a2) ** 2 + (b1 - b2) ** 2);
}

// 辅助函数，计算一组颜色的平均值
function mean(colors) {
  let sumL = 0,
    sumA = 0,
    sumB = 0;
  for (let i = 0; i < colors.length; i++) {
    sumL += colors[i][0];
    sumA += colors[i][1];
    sumB += colors[i][2];
  }
  return [
    sumL / colors.length,
    sumA / colors.length,
    sumB / colors.length,
  ];
}

// 辅助函数，判断两组聚类结果是否相等
function clustersEqual(clusters1, clusters2) {
  if (clusters1.length !== clusters2.length) return false;
  for (let i = 0; i < clusters1.length; i++) {
    if (clusters1[i].length !== clusters2[i].length) return false;
    for (let j = 0; j < clusters1[i].length; j++) {
      if (clusters1[i][j] !== clusters2[i][j]) return false;
    }
  }
  return true;
}