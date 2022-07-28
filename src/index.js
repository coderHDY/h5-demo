const {
    rootPath,
    pathToUrl,
} = require("./handler");

const fs = require("fs");
const path = require("path");

function getAllFile(dir, fileName) {
    const ans = [];
    let files = fs.readdirSync(dir, "utf-8");
    files.forEach(file => {
        if (["public", "src"].includes(file)) return;
        const filePath = `${dir}/${file}`;
        if (file === 'index.html' && filePath !== path.join(rootPath, "index.html")) {
            ans.push(pathToUrl(filePath));
        }
        if (file !== "public" && fs.statSync(filePath).isDirectory()) {
            ans.push(...getAllFile(filePath, fileName))
        }
    })
    return ans;
}

function generate() {
    const paths = getAllFile(rootPath, "index.html");
    const links = "\n" + paths.map(src => `<div class="side-bar-item" data-src="../${src}">${decodeURIComponent(src.split("/")[0])}</div>`).join("\n") + "\n";
    writePublic(links);
}

function writePublic(links) {
    let file = fs.readFileSync(`${rootPath}/public/index.html`, "utf-8");
    file = file.replace(/<div class="side-bar">\s*<\/div>/, `<div class="side-bar">${links}</div>`)
    fs.writeFileSync(path.join(rootPath, "index.html"), file);
}

module.exports = generate;