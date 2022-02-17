class ChromeStorage extends Storage {
     getItem = (key: string) => {
         let value: string = '';
         chrome.storage.local.get(key, items => {
             value = items[key]
         });
         return value
     }

    setItem =  async (key: string, value: string) => {
        return await new Promise<void>((resolve, reject) => {
            // @ts-ignore
            chrome.storage.local.set({[key]: value}, () => {
                const error = chrome.runtime.lastError;
                error ? reject(error) : resolve();
            });
        });
    }

    removeItem = async (key: string) =>  {
        return await  new Promise<boolean>((resolve, reject) => {
            chrome.storage.local.set({[key]: undefined}, function () {
                resolve(true);
            });
        })
    }

}


export default ChromeStorage