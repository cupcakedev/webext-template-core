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

export const localStorageKeys = {
    ...stateStorageKeys,
    ...utilityStorageKeys,
    ...dataStorageKeys,
} as const;

export const syncStorageKeys = authStorageKeys;

type LocalStorageKey = keyof typeof localStorageKeys;

type LocalStorageDataTemplate<T = unknown> = {
    [key in LocalStorageKey]: T;
};

type LocalStorageData = LocalStorageDataTemplate &
    Subtype<
        LocalStorageDataTemplate,
        {
            users: IUser[];
            counter: number;

            storageVersion: string;

            tokensUpdating: boolean;
        }
    >;

type SyncStorageKey = keyof typeof syncStorageKeys;

type SyncStorageDataTemplate<T = unknown> = {
    [key in SyncStorageKey]: T;
};

type SyncStorageData = SyncStorageDataTemplate &
    Subtype<
        SyncStorageDataTemplate,
        {
            JWSToken: string;
            refreshJWSToken: string;
            user: IUser;
        }
    >;

export type EmptyStorageValue = '' | null | undefined;

export type LocalStorage<E = EmptyStorageValue> = {
    [key in LocalStorageKey]: LocalStorageData[key] | E;
};

export type SyncStorage<E = EmptyStorageValue> = {
    [key in SyncStorageKey]: SyncStorageData[key] | E;
};

export type Storage<E = EmptyStorageValue> = LocalStorage<E> & SyncStorage<E>;

export type StorageKey = keyof Storage;

export type StorageValue<
    Key extends LocalStorageKey | SyncStorageKey,
    E = EmptyStorageValue
> =
    // @ts-ignore
    Key extends LocalStorageKey ? LocalStorage<E>[Key] : SyncStorage<E>[Key];

const getNamespace = (key: StorageKey) =>
    Object.values(syncStorageKeys).includes(key as any) ? 'sync' : 'local';

// Safari skips writes with 'undefined' and 'null', write '' instead
const normalizeStorageValue = (value: any) =>
    value !== undefined && value !== null ? value : '';

const normalizeStorageData = (items: any) =>
    Object.entries(items).reduce((acc, [key, value]) => {
        Object.assign(acc, { [key]: normalizeStorageValue(value) });
        return acc;
    }, items);

const getItem = async <
    T extends LocalStorageKey | SyncStorageKey,
    E = EmptyStorageValue
>(
    key: T,
    emptyResultValue?: E
) =>
    new Promise((resolve) => {
        chrome.storage[getNamespace(key)].get(key, (data) =>
            resolve(
                emptyResultValue !== undefined
                    ? data[key] || emptyResultValue
                    : data[key]
            )
        );
    }) as Promise<Storage<E>[T]>;

type GetItems = <NS extends 'local' | 'sync'>(
    namespace: NS
) => NS extends 'local'
    ? <T extends LocalStorageKey[], E = EmptyStorageValue>(
          keys: T,
          emptyResultValue?: E
      ) => Promise<Pick<LocalStorage<E>, T[number]>>
    : <T extends SyncStorageKey[], E = EmptyStorageValue>(
          keys: T,
          emptyResultValue?: E
      ) => Promise<Pick<SyncStorage<E>, T[number]>>;

const getItems: GetItems =
    (namespace) => async (keys: string[], emptyResultValue: any) =>
        new Promise<any>((resolve) => {
            chrome.storage[namespace].get(keys, (data) => {
                if (emptyResultValue !== undefined) {
                    keys.forEach((key) => {
                        if (!data[key]) {
                            data[key] = emptyResultValue;
                        }
                    });
                }
                resolve(data);
            });
        });

const setItem = <T extends StorageKey>(key: T, value: Storage[T]) =>
    new Promise((resolve) =>
        chrome.storage[getNamespace(key)].set(
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
    const lastStorageVersion = await getItem(localStorageKeys.storageVersion);
    if (process.env.NODE_ENV === 'development') {
        console.log('storage version:', STORAGE_VERSION);
        console.log('last storage version:', lastStorageVersion);
    }
    if (STORAGE_VERSION !== lastStorageVersion) {
        if (process.env.NODE_ENV === 'development')
            console.log('storage version changed, clear storage');
        await clear();
        await setItem(localStorageKeys.storageVersion, STORAGE_VERSION);
    }
};

export default {
    getItem,
    getItems,
    setItem,
    setItems,
    remove,
    clear,
    init,
};
