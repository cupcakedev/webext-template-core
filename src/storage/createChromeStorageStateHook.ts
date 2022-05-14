import { useCallback, useEffect } from 'react';
import useChromeStorage, { StorageHookReturn } from '../hooks/useChromeStorage';
import { StorageData, StorageKey } from './storage';

export default function createChromeStorageStateHook<
    Key extends StorageKey,
    Data extends StorageData<Key>
>(key: Key, defaultValue?: Data) {
    const consumers: any = [];

    return function useCreateChromeStorageHook() {
        const [value, setValue, isPersistent, error] = useChromeStorage(
            key,
            defaultValue
        );

        const setValueAll = useCallback((newValue: typeof value) => {
            for (const consumer of consumers) {
                consumer(newValue);
            }
        }, []);

        useEffect(() => {
            consumers.push(setValue);
            return () => {
                consumers.splice(consumers.indexOf(setValue), 1);
            };
        }, [setValue]);

        return [value, setValueAll, isPersistent, error] as StorageHookReturn<
            Key,
            Data
        >;
    };
}
