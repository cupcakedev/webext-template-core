import { partition } from 'lodash';
import type { Subtype } from '../interfaces/utils';
import type { ILocalStorage, ISyncStorage } from './config';
import { localStorageKeys, syncStorageKeys, STORAGE_VERSION } from './config';

const SYNC_KEYS = Object.keys(syncStorageKeys);

interface ISystemLocalStorage {
    storageVersion: string;
}

const sameKeyValue = <T extends string>(t: {
    [v in T]: v;
}) => t;

sameKeyValue(localStorageKeys);
sameKeyValue(syncStorageKeys);

type LocalStorageKey =
    | keyof typeof localStorageKeys
    | keyof ISystemLocalStorage;

type LocalStorageDataTemplate<T = unknown> = {
    [key in LocalStorageKey]: T;
};

type LocalStorageData = LocalStorageDataTemplate &
    Subtype<LocalStorageDataTemplate, ILocalStorage & ISystemLocalStorage>;

type SyncStorageKey = keyof typeof syncStorageKeys;

type SyncStorageDataTemplate<T = unknown> = {
    [key in SyncStorageKey]: T;
};

type SyncStorageData = SyncStorageDataTemplate &
    Subtype<SyncStorageDataTemplate, ISyncStorage>;

export type LocalStorage = {
    [key in LocalStorageKey]: LocalStorageData[key] | undefined;
};

export type SyncStorage = {
    [key in SyncStorageKey]: SyncStorageData[key] | undefined;
};

export type Storage = LocalStorage & SyncStorage;

export type StorageKey = keyof Storage;

export type StorageData<Key extends StorageKey = StorageKey> = Storage[Key];

const getArea = (key: StorageKey) =>
    SYNC_KEYS.includes(key) ? 'sync' : 'local';

const splitStorageKeys = (keys: StorageKey[]) =>
    partition(keys, (key) => SYNC_KEYS.includes(key)) as [
        SyncStorageKey[],
        LocalStorageKey[]
    ];

const splitStorage = (storage: Partial<Storage>) =>
    Object.entries(storage).reduce(
        (arr, [key, value]) => {
            if (SYNC_KEYS.includes(key)) {
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
    typeof localStorageKeys[keyof typeof localStorageKeys],
    StorageData | typeof EMPTY_VALUE
> &
    Record<
        typeof syncStorageKeys[keyof typeof syncStorageKeys],
        StorageData | typeof EMPTY_VALUE
    >;

const shouldNormalize = (value: StorageData) =>
    value === undefined || value === null;

const normalizeStorageValue = (value: StorageData) =>
    shouldNormalize(value) ? EMPTY_VALUE : value;

const normalizeStorage = (items: Partial<Storage>): Partial<StorageRaw> =>
    Object.entries(items).reduce((acc, [key, value]) => {
        if (shouldNormalize(value)) {
            Object.assign(acc, { [key]: EMPTY_VALUE });
        }
        return acc;
    }, items);

const restoreNormalizedValue = (value: StorageData) =>
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

async function getItems<Keys extends LocalStorageKey[]>(keys: Keys): Promise<Pick<LocalStorage, Keys[number]>>; // prettier-ignore
async function getItems<Key extends LocalStorageKey>(key: Key): Promise<LocalStorage[Key]>; // prettier-ignore

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
    return new Promise<StorageData<typeof keys>>((resolve) => {
        chrome.storage[area].get(keys, (data) =>
            resolve(restoreNormalizedValue(data[keys]))
        );
    });
}

async function setItems(items: Partial<LocalStorage>): Promise<boolean>; // prettier-ignore
async function setItems<Key extends LocalStorageKey>(key: Key, value: LocalStorage[Key] | undefined): Promise<boolean>; // prettier-ignore

async function setItems(
    keyOrItems: Partial<Storage> | StorageKey,
    value?: StorageData,
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

async function removeItems(keys: LocalStorageKey | LocalStorageKey[]): Promise<boolean>; // prettier-ignore

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
async function setSyncItems<Key extends SyncStorageKey>(key: Key, value: SyncStorage[Key] | undefined): Promise<boolean>; // prettier-ignore

async function setSyncItems(
    keyOrItems: Partial<Storage> | StorageKey,
    value?: StorageData
) {
    // @ts-ignore
    return setItems(keyOrItems, value, 'sync');
}

async function getSyncItems<Keys extends SyncStorageKey[]>(keys: Keys): Promise<Pick<SyncStorage, Keys[number]>>; // prettier-ignore
async function getSyncItems<Key extends SyncStorageKey>(key: Key): Promise<SyncStorage[Key]>; // prettier-ignore

async function getSyncItems(keys: StorageKey | StorageKey[]) {
    // @ts-ignore
    return getItems(keys, 'sync');
}

async function removeSyncItems(keys: SyncStorageKey | SyncStorageKey[]) {
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

async function setAnyItems<Key extends StorageKey>(key: Key, value: StorageData<Key>): Promise<boolean> // prettier-ignore
async function setAnyItems(items: Partial<Storage>): Promise<boolean> // prettier-ignore

async function setAnyItems(
    keyOrItems: Partial<Storage> | StorageKey,
    value?: StorageData
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

export const initStorage = async () => {
    const lastStorageVersion = await getItems('storageVersion');
    if (process.env.NODE_ENV === 'development') {
        console.log('storage version:', STORAGE_VERSION);
        console.log('last storage version:', lastStorageVersion);
    }
    if (STORAGE_VERSION !== lastStorageVersion) {
        if (process.env.NODE_ENV === 'development')
            console.log('storage version changed, clear storage');
        await clearStorage();
        await setItems('storageVersion', STORAGE_VERSION);
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
