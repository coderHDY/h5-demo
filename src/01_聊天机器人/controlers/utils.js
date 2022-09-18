
const getStorage = (key) => JSON.parse(localStorage.getItem(key));
const setStorage = (key, val) => localStorage.setItem(key, JSON.stringify(val));
const encode = (val) => encodeURIComponent(val);
const decode = (val) => decodeURIComponent(val);

const addListStorage = (key, item) => {
    let storageItem = getStorage(key);
    storageItem = Array.isArray(storageItem) ? storageItem : [];
    storageItem.push(item);
    setStorage(key, storageItem);
}

const modelMsg = (val, sender = "me", date = +new Date()) => {
    return {
        val,
        sender,
        createAt: date,
    }
}
export {
    addListStorage,
    modelMsg,
    getStorage,
    setStorage,
}