import {execute as executeRPC} from "../rpc";
import storage from "../storage/storage";

export class QueryClient {

    async get(key: string) {
        console.log(`Получаем кэш - client: ${key}`)
        const value = await storage.get(key, undefined, 'local')
        return JSON.parse(value as string)
    }

    async set(key: string, value: any) {
        console.log("Записываем в кэш - client")
        return storage.set(key, JSON.stringify(value), 'local')
    }

    invalidateQueries(key: string, options: {}) {
        console.log(`Обновление ${key}`)
        console.log(this.refresh)
        try {
            this.refresh[key]();
            console.log("refresh успешен")
        } catch (e) {
            console.log("refresh упал")
            console.log(e)
            return {error: e}
        }

    }

    refresh: {[key:string]:()=>void} = {};

    execute = executeRPC

    addListener(key: string, listener: (newValue: any) => void) {
        const onChange = (changes: any) => {
            if (key in changes) {
                listener(changes[key].newValue);
            }
        };
        chrome.storage.onChanged.addListener(onChange);
        return () => {
            chrome.storage.onChanged.removeListener(onChange);
        };
    }

    queue: [()=>void] | [] = []
}