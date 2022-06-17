import { partition } from 'lodash';
import type { Subtype } from '../interfaces/utils';
import type { ILocalStorage, ISyncStorage } from './config';
import { LocalStorageKeys, SyncStorageKeys, STORAGE_VERSION } from './config';

type LocalStorageDataTemplate<T = unknown> = {
    [key in LocalStorageKeys]: T;
};

type LocalStorageData = LocalStorageDataTemplate &
    Subtype<LocalStorageDataTemplate, ILocalStorage>;

export type LocalStorage = {
    [key in LocalStorageKeys]: LocalStorageData[key] | undefined;
};

type SyncStorageDataTemplate<T = unknown> = {
    [key in SyncStorageKeys]: T;
};

type SyncStorageData = SyncStorageDataTemplate &
    Subtype<SyncStorageDataTemplate, ISyncStorage>;

export type SyncStorage = {
    [key in SyncStorageKeys]: SyncStorageData[key] | undefined;
};

export type Storage = LocalStorage & SyncStorage;

export type StorageKey = keyof Storage;

export type StorageUpdate = {
    [Key in StorageKey]: {
        newValue: Storage[Key];
        oldValue: Storage[Key];
    };
};

const getArea = (key: StorageKey) =>
    SyncStorageKeys[key as keyof SyncStorage] ? 'sync' : 'local';

const splitStorageKeys = (keys: StorageKey[]) =>
    partition(keys, (key) => SyncStorageKeys[key as keyof SyncStorage]) as [
        SyncStorageKeys[],
        LocalStorageKeys[]
    ];

const splitStorage = (storage: Partial<Storage>) =>
    Object.entries(storage).reduce(
        (arr, [key, value]) => {
            if (SyncStorageKeys[key as keyof SyncStorage]) {
                Object.assign(arr[0], { [key]: value });
                return arr;
            }
            Object.assign(arr[1], { [key]: value });
            return arr;
        },
        [{}, {}] as [Partial<SyncStorage>, Partial<LocalStorage>]
    );

// Safari skips writes with 'undefined' and 'null', write '' instead
const EMPTY_VALUE = '' as const;

type StorageRaw = Record<
    typeof LocalStorageKeys[keyof typeof LocalStorageKeys],
    Storage[StorageKey] | typeof EMPTY_VALUE
> &
    Record<
        typeof SyncStorageKeys[keyof typeof SyncStorageKeys],
        Storage[StorageKey] | typeof EMPTY_VALUE
    >;

const shouldNormalize = (value: Storage[StorageKey]) =>
    value === undefined || value === null;

const normalizeStorageValue = (value: Storage[StorageKey]) =>
    shouldNormalize(value) ? EMPTY_VALUE : value;

const normalizeStorage = (items: Partial<Storage>): Partial<StorageRaw> =>
    Object.entries(items).reduce((acc, [key, value]) => {
        if (shouldNormalize(value)) {
            Object.assign(acc, { [key]: EMPTY_VALUE });
        }
        return acc;
    }, items);

const restoreNormalizedValue = (value: Storage[StorageKey]) =>
    value === EMPTY_VALUE ? undefined : value;

const restoreNormalizedStorage = (
    data: Partial<StorageRaw>
): Partial<Storage> =>
    Object.entries(data).reduce((acc, [key, value]) => {
        if (value === EMPTY_VALUE) {
            Object.assign(acc, { [key]: undefined });
        }
        return acc;
    }, data as Partial<Storage>);

async function getItems<Keys extends LocalStorageKeys[]>(keys: Keys): Promise<Pick<LocalStorage, Keys[number]>>; // prettier-ignore
async function getItems<Key extends LocalStorageKeys>(key: Key): Promise<LocalStorage[Key]>; // prettier-ignore

async function getItems(
    keys: StorageKey | StorageKey[],
    area: 'local' | 'sync' = 'local'
) {
    if (Array.isArray(keys)) {
        return new Promise<Partial<Storage>>((resolve) => {
            chrome.storage[area].get(keys, (data) =>
                resolve(restoreNormalizedStorage(data))
            );
        });
    }
    return new Promise<Storage[StorageKey]>((resolve) => {
        chrome.storage[area].get(keys, (data) =>
            resolve(restoreNormalizedValue(data[keys]))
        );
    });
}

async function setItems(items: Partial<LocalStorage>): Promise<boolean>; // prettier-ignore
async function setItems<Key extends LocalStorageKeys>(key: Key, value: LocalStorage[Key] | undefined): Promise<boolean>; // prettier-ignore

async function setItems(
    keyOrItems: Partial<Storage> | StorageKey,
    value?: Storage[StorageKey],
    area: 'local' | 'sync' = 'local'
) {
    if (typeof keyOrItems === 'object') {
        return new Promise<boolean>((resolve) => {
            chrome.storage[area].set(normalizeStorage(keyOrItems), () => {
                chrome.runtime.lastError ? resolve(false) : resolve(true);
            });
        });
    }
    return new Promise<boolean>((resolve) => {
        chrome.storage[area].set(
            { [keyOrItems]: normalizeStorageValue(value) },
            () => {
                chrome.runtime.lastError ? resolve(false) : resolve(true);
            }
        );
    });
}

async function removeItems(keys: LocalStorageKeys | LocalStorageKeys[]): Promise<boolean>; // prettier-ignore

async function removeItems(
    keys: StorageKey | StorageKey[],
    area: 'local' | 'sync' = 'local'
) {
    if (Array.isArray(keys)) {
        return new Promise<boolean>((resolve) => {
            chrome.storage[area].remove(keys, () => {
                chrome.runtime.lastError ? resolve(false) : resolve(true);
            });
        });
    }
    return new Promise<boolean>((resolve) => {
        chrome.storage[area].remove(keys, () => {
            chrome.runtime.lastError ? resolve(false) : resolve(true);
        });
    });
}

const clearStorage = () =>
    Promise.all([chrome.storage.local.clear(), chrome.storage.sync.clear()]);

async function setSyncItems(items: Partial<SyncStorage>): Promise<boolean>; // prettier-ignore
async function setSyncItems<Key extends SyncStorageKeys>(key: Key, value: SyncStorage[Key] | undefined): Promise<boolean>; // prettier-ignore

async function setSyncItems(
    keyOrItems: Partial<Storage> | StorageKey,
    value?: Storage[StorageKey]
) {
    // @ts-ignore
    return setItems(keyOrItems, value, 'sync');
}

async function getSyncItems<Keys extends SyncStorageKeys[]>(keys: Keys): Promise<Pick<SyncStorage, Keys[number]>>; // prettier-ignore
async function getSyncItems<Key extends SyncStorageKeys>(key: Key): Promise<SyncStorage[Key]>; // prettier-ignore

async function getSyncItems(keys: StorageKey | StorageKey[]) {
    // @ts-ignore
    return getItems(keys, 'sync');
}

async function removeSyncItems(keys: SyncStorageKeys | SyncStorageKeys[]) {
    // @ts-ignore
    return removeItems(keys, 'sync');
}

async function getAnyItems<Keys extends StorageKey[]>(keys: Keys): Promise<Pick<Storage, Keys[number]>>; // prettier-ignore
async function getAnyItems<Key extends StorageKey>(key: Key): Promise<Storage[Key]>; // prettier-ignore

async function getAnyItems(keys: StorageKey | StorageKey[]) {
    if (Array.isArray(keys)) {
        const [syncKeys, localKeys] = splitStorageKeys(keys);

        const [localStorage, syncStorage] = await Promise.all([
            // @ts-ignore
            getItems(localKeys, 'local'),
            // @ts-ignore
            getItems(syncKeys, 'sync'),
        ]);
        return { ...localStorage, ...syncStorage };
    }
    // @ts-ignore
    return getItems(keys, getArea(keys));
}

async function setAnyItems<Key extends StorageKey>(key: Key, value: Storage[Key]): Promise<boolean> // prettier-ignore
async function setAnyItems(items: Partial<Storage>): Promise<boolean> // prettier-ignore

async function setAnyItems(
    keyOrItems: Partial<Storage> | StorageKey,
    value?: Storage[StorageKey]
) {
    if (typeof keyOrItems === 'object') {
        const [sync, local] = splitStorage(keyOrItems);
        return Promise.all([
            // @ts-ignore
            setItems(local, value, 'local'),
            // @ts-ignore
            setItems(sync, value, 'sync'),
        ]).then(([localSuccess, syncSuccess]) => localSuccess && syncSuccess);
    }
    // @ts-ignore
    return setItems(keyOrItems, value, getArea(keyOrItems));
}

const STORAGE_VERSION_KEY = 'storageVersion';

const getStorageVersion = () =>
    new Promise<string>((resolve) => {
        chrome.storage.local.get(STORAGE_VERSION_KEY, (data) =>
            resolve(data[STORAGE_VERSION_KEY])
        );
    });

const setStorageVersion = (version: string) =>
    new Promise<boolean>((resolve) => {
        chrome.storage.local.set({ [STORAGE_VERSION_KEY]: version }, () => {
            chrome.runtime.lastError ? resolve(false) : resolve(true);
        });
    });

export const initStorage = async () => {
    const lastStorageVersion = await getStorageVersion();
    if (process.env.NODE_ENV === 'development') {
        console.log('storage version:', STORAGE_VERSION);
        console.log('last storage version:', lastStorageVersion);
    }
    if (STORAGE_VERSION !== lastStorageVersion) {
        if (process.env.NODE_ENV === 'development')
            console.log('storage version changed, clear storage');
        await clearStorage();
        await setStorageVersion(STORAGE_VERSION);
    }
};

export default {
    local: {
        get: getItems,
        set: setItems,
        remove: removeItems,
        clear: () => chrome.storage.local.clear(),
    },
    sync: {
        get: getSyncItems,
        set: setSyncItems,
        remove: removeSyncItems,
        clear: () => chrome.storage.sync.clear(),
    },
    any: {
        get: getAnyItems,
        set: setAnyItems,
        clear: clearStorage,
    },
};
