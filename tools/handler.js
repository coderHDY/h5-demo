const path = require("path");
const rootPath = path.join(__dirname, "../src/");

// 解决中文路径问题
function pathToUrl(filePath) {
    return encodeURIComponent(path.relative(rootPath, filePath)).replace(/%2F/g, "/");
}

// 解决服务器路径寻找问题
function url2Path(url) {
    return decodeURIComponent(url);
}

module.exports = {
    rootPath,
    pathToUrl,
    url2Path,
}