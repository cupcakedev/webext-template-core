import { useCallback, useEffect } from 'react';
import useChromeStorage from '../hooks/useChromeStorage';
import { Storage, StorageKey } from './storage';

export default function createChromeStorageStateHook<Key extends StorageKey>(
    key: Key,
    defaultValue?: NonNullable<Storage[Key]>
) {
    const consumers: any = [];

    return function useCreateChromeStorageHook() {
        const [value, setValue, error] = useChromeStorage(key, defaultValue);

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

        return [value, setValueAll, error] as const;
    };
}
