const path = require("path");

const rootPath = path.join(__dirname, "..");

function pathToUrl(filePath) {
    return encodeURIComponent(path.relative(rootPath, filePath)).replace(/%2F/g, "/");
}

function url2Path(url) {
    return decodeURIComponent(url);
}

module.exports = {
    rootPath,
    pathToUrl,
    url2Path,
}