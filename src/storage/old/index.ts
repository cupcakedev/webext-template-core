// export interface IStore {
//     get: (key:string) => {}
//     set: (key:string, value: string) => {}
//     subscribe: (fn:() => {}) => {}
// }
//
//
// class Store {
//     constructor() {
//         chrome.storage.onChanged.addListener((changes, area) => {
//             const {newValue, oldValue} = changes;
//             if (!newValue)
//                 return;
//             for (const fn of this.listeners) {
//                 fn(newValue, oldValue);
//             }
//         });
//     }
//
//     subscribe = (fn: (data: any, oldData: any) => void) => {
//         chrome.storage.onChanged.addListener((changes, area) => {
//             const {newValue, oldValue} = changes;
//             if (!newValue)
//                 return;
//             fn(newValue, oldValue);
//         });
//     }
//
//     get = (key: string) => {
//         return new Promise((resolve, reject) => {
//             try {
//                 chrome.storage.local.get([key], (result) => resolve(result));
//             } catch (e) {
//                 reject(e)
//             }
//         })
//     }
//
//     set = (key: string, value: string) => {
//         chrome.storage.local.set({key: value});
//     }
//
//     listeners: Array<(data: any, oldData: any) => void> = [];
//
//     subscribe = (fn: () => void) => {
//         if(typeof fn === 'function') {
//             this.listeners.push(fn);
//             return () => this.listeners.splice(this.listeners.length - 1, 1)
//         }
//     }
// }
//
// export default Store;

export const subscribe = (fn: (data: {}) => void) => {
    chrome.storage.onChanged.addListener((changes, area) => {
        const {newValue, oldValue} = changes;
        if (!newValue)
            return;
        fn(newValue);
    });
}

export const get = async (key: string) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([key], (items) =>  {
            const error = chrome.runtime.lastError;
            if (error) return reject(error);
            resolve(items[key]);
        });
    })
}

export const set = (key: string, value: string | number) => {
    return new Promise<void>((resolve, reject) => {
        chrome.storage.local.set({[key]: value}, () => {
            const error = chrome.runtime.lastError;
            error ? reject(error) : resolve();
        });
    });
};