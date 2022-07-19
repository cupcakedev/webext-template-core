import { useCallback, useEffect, useState } from 'react';

import {
    StorageKeyType,
    StorageDataType,
    StringEnumType,
    Storage,
    StorageArea,
} from 'src/storage/types';

const createHookUseChromeStorage = <
    Local extends StorageDataType,
    Sync extends StorageDataType
>(
    storage: Storage<Local, Sync>,
    allSyncKeys: StringEnumType
) => {
    type S = Local & Sync;

    const useChromeStorage = <
        Key extends StorageKeyType<S>,
        Default extends NonNullable<S[Key]> | undefined
    >(
        key: Key,
        defaultValue?: Default
    ) => {
        type WithDefault<T> = Default extends undefined ? T : NonNullable<T>;

        const [STORAGE_AREA] = useState<StorageArea>(() =>
            allSyncKeys[key] ? 'sync' : 'local'
        );

        const [state, setState] = useState(defaultValue as WithDefault<S[Key]>);
        const [error, setError] = useState('');

        useEffect(() => {
            storage.any
                .get(key)
                .then((res) => {
                    setState(
                        (defaultValue !== undefined
                            ? res || defaultValue
                            : res) as WithDefault<S[Key]>
                    );
                    setError('');
                })
                .catch((error) => {
                    setError(error);
                });
        }, [key, defaultValue]);

        const updateValue: typeof setState = useCallback(
            (newValue) => {
                const value =
                    typeof newValue === 'function'
                        ? (newValue as Function)(state)
                        : newValue;
                setState(value);
                // @ts-ignore
                storage.any.set({ [key]: value }).then((result) => {
                    if (result) {
                        setError('');
                    } else {
                        setError(error);
                    }
                });
            },
            [key, state, error]
        );

        useEffect(() => {
            const onChange = (
                changes: { [key: string]: chrome.storage.StorageChange },
                areaName: chrome.storage.AreaName
            ) => {
                if (areaName === STORAGE_AREA && key in changes) {
                    const val = changes[key]?.newValue || undefined;
                    setState(
                        defaultValue !== undefined ? val || defaultValue : val
                    );
                    setError('');
                }
            };
            chrome.storage.onChanged.addListener(onChange);
            return () => {
                chrome.storage.onChanged.removeListener(onChange);
            };
        }, [key, STORAGE_AREA, defaultValue]);

        return [state, updateValue, error] as const;
    };
    return useChromeStorage;
};

export { createHookUseChromeStorage };
