const path = require("path");

const IS_SERVER = process.argv.includes("IS_SERVER");
const rootPath = IS_SERVER ? "/h5-demo/" : path.join(__dirname, "../");
console.log(IS_SERVER);

function pathToUrl(filePath) {
    const url = encodeURIComponent(path.relative(rootPath, filePath)).replace(/%2F/g, "/");
    console.log(url);
    return url;
}

function url2Path(url) {
    return decodeURIComponent(url);
}

module.exports = {
    rootPath,
    pathToUrl,
    url2Path,
    IS_SERVER,
}