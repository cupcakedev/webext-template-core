import { useCallback, useEffect, useRef, useState } from 'react';

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

        const defaultValueRef = useRef(defaultValue as WithDefault<S[Key]>);

        const [state, setState] = useState(defaultValue as WithDefault<S[Key]>);
        const [error, setError] = useState('');

        useEffect(() => {
            storage.any
                .get(key)
                .then((res) => {
                    setState(
                        (defaultValueRef.current !== undefined
                            ? res || defaultValueRef.current
                            : res) as WithDefault<S[Key]>
                    );
                    setError('');
                })
                .catch((error) => {
                    setError(error);
                });
        }, [key, defaultValueRef.current]);

        const updateValue: typeof setState = useCallback(
            (newValue) => {
                const value =
                    typeof newValue === 'function'
                        ? (newValue as Function)(state)
                        : newValue;
                setState(value);
                (storage as Storage<any, any>).any
                    .set({ [key]: value })
                    .then((result) => {
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
                        defaultValueRef.current !== undefined
                            ? val || defaultValueRef.current
                            : val
                    );
                    setError('');
                }
            };
            chrome.storage.onChanged.addListener(onChange);
            return () => {
                chrome.storage.onChanged.removeListener(onChange);
            };
        }, [key, STORAGE_AREA, defaultValueRef.current]);

        return [state, updateValue, error] as const;
    };
    return useChromeStorage;
};

export { createHookUseChromeStorage };
