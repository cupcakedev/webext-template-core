export const getItem = async (key: string) => {
    console.log('getItem');
    return new Promise<any>((resolve) => {
        chrome.storage.local.get(key, (items) => {
            resolve(items[key]);
        });
    });
};

export const setItem = (
    key: string,
    value: string,
    callback?: (result: boolean) => void
) =>
    new Promise((resolve) =>
        chrome.storage.local.set({ [key]: value }, () => {
            console.log('Я сохранился');
            if (typeof callback === 'function') {
                chrome.runtime.lastError ? resolve(false) : resolve(true);
            }
        })
    );

export const removeItem = (key: string) => {
    console.log('removeItem');
    chrome.storage.local.set({ [key]: undefined }, () => {
        console.log('Я сохранился');
    });
};
