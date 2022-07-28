const path = require("path");

const rootPath = path.join(__dirname, "..");

function pathToUrl(filePath) {
    return encodeURIComponent(path.relative(rootPath.slice(0, -2), filePath)).replace(/%2F/g, "/").slice(2);
}

function url2Path(url) {
    return decodeURIComponent(url);
}

module.exports = {
    rootPath,
    pathToUrl,
    url2Path,
}