const Storage = {
    get: (key: string, defaultValue: undefined, storageArea: string) => {
        const keyObj = defaultValue === undefined ? key : {[key]: defaultValue};
        return new Promise((resolve, reject) => {
            // @ts-ignore
            chrome.storage[storageArea].get(keyObj, items => {
                const error = chrome.runtime.lastError;
                if (error) return reject(error);
                resolve(items[key]);
            });
        });
    },
    set: (key: string, value: string, storageArea: string) => {
        return new Promise<void>((resolve, reject) => {
            // @ts-ignore
            chrome.storage[storageArea].set({[key]: value}, () => {
                const error = chrome.runtime.lastError;
                error ? reject(error) : resolve();
            });
        });
    },
};

export default  Storage