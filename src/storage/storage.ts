/* When editing this file, follow the STORAGE_VERSION instructions: */

import { Subtype } from '../interfaces/utils';
import { IUser } from '../interfaces';

/**
 * Storage version must be set equal to extension version when in this version:
 *
 * 1. Storage key got deleted/renamed
 * 2. Any storage data type had changed (like if TypeScript type would change)
 *
 */
const STORAGE_VERSION = '1.0.0';

const dataStorageKeys = {
    users: 'users',
    counter: 'counter',
} as const;

const authStorageKeys = {
    user: 'memberInfo',
    JWSToken: 'JWSToken',
    refreshJWSToken: 'refreshJWSToken',
} as const;

const utilityStorageKeys = {
    storageVersion: 'storageVersion',
} as const;

const stateStorageKeys = {
    tokensUpdating: 'tokensUpdating',
} as const;

const storageKeys = {
    ...stateStorageKeys,
    ...utilityStorageKeys,
    ...authStorageKeys,
    ...dataStorageKeys,
} as const;

type StorageKey = keyof typeof storageKeys;

type Template<T = unknown> = {
    [key in StorageKey]: T;
};

type StorageData = Template &
    Subtype<
        Template,
        {
            users: IUser[];
            counter: number;

            user: IUser;
            JWSToken: string;
            refreshJWSToken: string;

            storageVersion: string;

            tokensUpdating: boolean;
        }
    >;

export type EmptyStorageValue = '' | null | undefined;

export type Storage<E = EmptyStorageValue> = {
    [key in StorageKey]: StorageData[key] | E;
};

// Safari skips writes with 'undefined' and 'null', write '' instead
const normalizeStorageValue = (value: Storage[StorageKey]) =>
    value !== undefined && value !== null ? value : '';

const normalizeStorageData = (items: Partial<Storage>) =>
    Object.entries(items).reduce((acc, [key, value]) => {
        Object.assign(acc, { [key]: normalizeStorageValue(value) });
        return acc;
    }, items);

const getItem = async <T extends StorageKey, E = EmptyStorageValue>(
    key: T,
    emptyResultValue?: E
) =>
    new Promise<Storage<E>[T]>((resolve) => {
        chrome.storage.local.get(key, (data) =>
            resolve(
                emptyResultValue !== undefined
                    ? data[key] || emptyResultValue
                    : data[key]
            )
        );
    });

const getItems = async <T extends StorageKey[], E = EmptyStorageValue>(
    keys: T,
    emptyResultValue?: E
) =>
    new Promise<Pick<Storage<E>, T[number]>>((resolve) => {
        chrome.storage.local.get(keys, (data) => {
            if (emptyResultValue !== undefined) {
                keys.forEach((key) => {
                    if (!data[key]) {
                        data[key] = emptyResultValue;
                    }
                });
            }
            resolve(data as Pick<Storage<E>, T[number]>);
        });
    });

const setItem = <T extends StorageKey>(key: T, value: Storage[T]) =>
    new Promise((resolve) =>
        chrome.storage.local.set(
            { [key]: normalizeStorageValue(value) },
            () => {
                chrome.runtime.lastError ? resolve(false) : resolve(true);
            }
        )
    );

const setItems = (items: Partial<Storage>) =>
    new Promise((resolve) =>
        chrome.storage.local.set(normalizeStorageData(items), () => {
            chrome.runtime.lastError ? resolve(false) : resolve(true);
        })
    );

const remove = (items: StorageKey[] | StorageKey) =>
    new Promise((resolve) =>
        chrome.storage.local.remove(items, () => {
            chrome.runtime.lastError ? resolve(false) : resolve(true);
        })
    );

const clear = () => chrome.storage.local.clear();

const init = async () => {
    const lastStorageVersion = await getItem(storageKeys.storageVersion);
    if (process.env.NODE_ENV === 'development') {
        console.log('storage version:', STORAGE_VERSION);
        console.log('last storage version:', lastStorageVersion);
    }
    if (STORAGE_VERSION !== lastStorageVersion) {
        if (process.env.NODE_ENV === 'development')
            console.log('storage version changed, clear storage');
        await clear();
        await setItem(storageKeys.storageVersion, STORAGE_VERSION);
    }
};

export default {
    getItem,
    getItems,
    setItem,
    setItems,
    remove,
    clear,
    keys: storageKeys,
    init,
};
