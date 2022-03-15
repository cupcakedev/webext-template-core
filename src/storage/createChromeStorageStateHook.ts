import { useCallback, useEffect } from 'react';
import useChromeStorage from '../hooks/useChromeStorage';

export default function createChromeStorageStateHook(
    key: string,
    initialValue: any,
    storageArea: 'local' | 'sync'
) {
    const consumers: any = [];

    return function useCreateChromeStorageHook() {
        const [value, setValue, isPersistent, error] = useChromeStorage(
            key,
            initialValue,
            storageArea
        );

        const setValueAll = useCallback((newValue) => {
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

        return [value, setValueAll, isPersistent, error];
    };
}
