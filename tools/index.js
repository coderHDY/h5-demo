const { rootPath, pathToUrl } = require("./handler");
const fs = require("fs");
const path = require("path");
const URL_PATH = "/h5-demo";

function isDev() {
  return process.env.NODE_ENV === "development";
}
const ROOT_URL = isDev() ? URL_PATH : "/";

// 把服务器文件都做成对应URL，服务器路径会根据 IS_SERVER 修改
function getAllFile(dir, fileName) {
  const ans = [];
  let files = fs.readdirSync(dir, "utf-8");
  files.forEach((file) => {
    if (["public"].includes(file)) return;
    const filePath = `${dir}/${file}`;
    if (
      file === "index.html" &&
      file !== "node_modules" &&
      filePath !== path.join(rootPath, "index.html")
    ) {
      ans.push(pathToUrl(filePath));
    }
    if (file !== "public" && fs.statSync(filePath).isDirectory()) {
      ans.push(...getAllFile(filePath, fileName));
    }
  });
  return ans;
}

function getPaths() {
  return getAllFile(path.join(__dirname, "../src"), "index.html");
}

function src2SideItem(src) {
  const idx = 0;
  const linkEl = `<div class="side-bar-item" data-src="${ROOT_URL}/${src}">${decodeURIComponent(
    src.split("/")[idx]
  )}</div>`;
  return linkEl;
}
function generate() {
  const paths = getPaths();

  // 服务器和开发环境跟路径设置不同，待优化代码
  const linksEl = "\n" + paths.map((src) => src2SideItem(src)).join("\n") + "\n";
  writePublic(linksEl);
}

function writePublic(linksEl) {
  const refresh = `
    <div class="roll-wrapper">
        <div class="roll-outer"></div>
        <div class="roll-inner"></div>
    </div>`;
  let file = fs.readFileSync(
    path.join(__dirname, "../src/public/index.html"),
    "utf-8"
  );
  file = file.replace(
    /<div class="side-bar">\s*<\/div>/,
    `<div class="side-bar">${refresh}${linksEl}</div>`
  );
  // dev环境没有前缀
  if (isDev()) {
    const reg = new RegExp(URL_PATH, "g");
    file = file.replace(reg, "");
  }
  fs.writeFileSync(path.join(__dirname, "../src/index.html"), file);
}

module.exports = generate;
