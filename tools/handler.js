const path = require("path");

const IS_SERVER = process.argv.includes("IS_SERVER");
const rootPath = IS_SERVER ? "/h5-demo/" : path.join(__dirname, "../src/");

// 解决中文路径问题
function pathToUrl(filePath) {
    const url = encodeURIComponent(path.relative(rootPath, filePath)).replace(/%2F/g, "/");
    return url;
}

// 解决服务器路径寻找问题
function url2Path(url) {
    return decodeURIComponent(url);
}

module.exports = {
    rootPath,
    IS_SERVER,
    pathToUrl,
    url2Path,
}