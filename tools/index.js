const {
    IS_SERVER,
    rootPath,
    pathToUrl,
} = require("./handler");

const fs = require("fs");
const path = require("path");

// 把服务器文件都做成对应URL，服务器路径会根据 IS_SERVER 修改
function getAllFile(dir, fileName) {
    const ans = [];
    let files = fs.readdirSync(dir, "utf-8");
    files.forEach(file => {
        if (["public"].includes(file)) return;
        const filePath = `${dir}/${file}`;
        if (file === 'index.html' && file !== "node_modules" && filePath !== path.join(rootPath, "index.html")) {
            ans.push(pathToUrl(filePath));
        }
        if (file !== "public" && fs.statSync(filePath).isDirectory()) {
            ans.push(...getAllFile(filePath, fileName))
        }
    })
    return ans;
}

function generate() {
    const paths = getAllFile(path.join(__dirname, "../src"), "index.html");

    // 服务器和开发环境跟路径设置不同，待优化代码
    const idx = 0;
    const linksEl = "\n" + paths.map(src => `<div class="side-bar-item" data-src="${src}">${decodeURIComponent(src.split("/")[idx])}</div>`).join("\n") + "\n";
    writePublic(linksEl);
}

function writePublic(linksEl) {
    let file = fs.readFileSync(path.join(__dirname, "../src/public/index.html"), "utf-8");
    file = file.replace(/<div class="side-bar">\s*<\/div>/, `<div class="side-bar">${linksEl}</div>`)
    fs.writeFileSync(path.join(__dirname, "../src/index.html"), file);
}

module.exports = generate;