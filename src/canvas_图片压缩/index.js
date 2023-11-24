input.addEventListener("change", async () => {
  const file = input.files[0];
  if (!file) return;
  addImg(file);
  const zippedFile = await compressImage(file);
  // addImg(zippedFile);
  addDownloadBtn(zippedFile);
});

const addImg = (blob) => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onload = function () {
    const img = document.createElement("img");
    img.src = reader.result;
    img.style.width = "200px";
    img.style.height = "150px";
    img.style.display = "block";
    document.body.appendChild(img);
  };
};
const addDownloadBtn = (file) => {
  const downloadBtn = document.createElement("button");
  downloadBtn.innerText = "下载";
  downloadBtn.addEventListener("click", function () {
    const url = URL.createObjectURL(file);
    const linkElement = document.createElement("a");
    linkElement.href = url;
    linkElement.download = file.name;
    document.body.appendChild(linkElement);
    linkElement.click();
    linkElement.remove();
  });

  document.body.appendChild(downloadBtn);
};

const compressImage = (file) => {
  // MAX_SIZE 以内不压缩
  const MAX_SIZE = 128 * 1024;
  /* 
   * 按长边固定值缩小，会不准确？
   * 根据需要调整，身份证一般宽或高有1280就能清晰看清楚字
  */
  const MAX_SIDE = 1280;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      try {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          if (file.size <= MAX_SIZE) {
            resolve(file);
          } else {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const scaleRate = MAX_SIZE / file.size;
            let targetWidth = img.width;
            let targetHeight = img.height;

            // 横向图片
            if (targetWidth > targetHeight) {
              const scale = MAX_SIDE / targetWidth;
              targetWidth = MAX_SIDE;
              targetHeight = targetHeight * scale;
            } else {
              // 纵向图片
              const scale = MAX_SIDE / targetHeight;
              targetHeight = MAX_SIDE;
              targetWidth = targetWidth * scale;
            }

            /* 按尺寸缩小，会过于模糊？ */
            // let targetWidth = img.width * scaleRate;
            // let targetHeight = img.height * scaleRate;
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            ctx?.clearRect(0, 0, canvas.width, canvas.height);
            ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
            let data = "";
            // 按比例压缩
            data = canvas.toDataURL("image/jpeg", scaleRate);
            const newFile = dataURL2file(data);
            newFile.name = file.name;
            resolve(newFile);
          }
        };
        img.onerror = reject;
      } catch (e) {
        console.warn(e);
        // 兜底处理，上传源文件
        resolve(file);
      }
    };
    reader.onerror = reject;
  });
};

const dataURL2file = (dataURL) => {
  const type = dataURL.match(/^data:([^;]+)/)?.[1]; // 提取文件类型
  const data = atob(dataURL.split(",")[1]); // 解码 Base64 数据
  const dataArray = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    dataArray[i] = data.charCodeAt(i);
  }
  const blob = new Blob([dataArray], { type: type });
  return blob;
};
