Object.assign(global, require('jest-chrome'));

let localStorage = {};
let syncStorage = {};

const getter = (storage) => (keys, callback) => {
    if (keys === null) {
        callback(storage);
        return;
    }
    if (!keys) {
        callback(undefined);
        return;
    }
    if (Array.isArray(keys)) {
        const res = {};
        keys.forEach((key) => {
            res[key] = storage[key];
        });
        callback(res);
    } else {
        callback({ [keys]: storage[keys] });
    }
};

const setter = (storage) => (object, callback) => {
    if (!object) {
        callback(true);
        return;
    }
    Object.entries(object).forEach(([key, value]) => {
        storage[key] = value;
    });
    callback(true);
};

const remover = (storage) => (keys, callback) => {
    if (!keys) {
        callback(true);
        return;
    }
    if (Array.isArray(keys)) {
        keys.forEach((key) => {
            delete storage[key];
        });
        callback(true);
    } else {
        delete storage[keys];
        callback(true);
    }
};

chrome.storage.local.get.mockImplementation(getter(localStorage));
chrome.storage.local.set.mockImplementation(setter(localStorage));
chrome.storage.local.remove.mockImplementation(remover(localStorage));
chrome.storage.local.clear.mockImplementation(() => {
    localStorage = {};
});
chrome.storage.sync.get.mockImplementation(getter(syncStorage));
chrome.storage.sync.set.mockImplementation(setter(syncStorage));
chrome.storage.local.remove.mockImplementation(remover(syncStorage));
chrome.storage.local.clear.mockImplementation(() => {
    syncStorage = {};
});
