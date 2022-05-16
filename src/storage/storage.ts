import type { Subtype } from '../interfaces/utils';
import type { ILocalStorage, ISyncStorage } from './config';
import { localStorageKeys, syncStorageKeys, STORAGE_VERSION } from './config';

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
    Object.values(syncStorageKeys).includes(key as any) ? 'sync' : 'local';

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
    value !== undefined && value !== null;

const normalizeStorageValue = (value: StorageData) =>
    shouldNormalize(value) ? value : EMPTY_VALUE;

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

async function getItems<Key extends LocalStorageKey>(keys: Key): Promise<LocalStorage[Key]>; // prettier-ignore
async function getItems<Key extends SyncStorageKey>(keys: Key): Promise<SyncStorage[Key]>; // prettier-ignore
async function getItems<Keys extends LocalStorageKey[]>(keys: Keys): Promise<Pick<LocalStorage, Keys[number]>>; // prettier-ignore
async function getItems<Keys extends SyncStorageKey[]>(keys: Keys): Promise<Pick<SyncStorage, Keys[number]>>; // prettier-ignore

async function getItems(keys: StorageKey | StorageKey[]) {
    if (Array.isArray(keys)) {
        return new Promise<Partial<Storage>>((resolve) => {
            const area = getArea(Object.values(keys)[0]);
            chrome.storage[area].get(keys, (data) =>
                resolve(restoreNormalizedStorage(data))
            );
        });
    }
    return new Promise<StorageData<typeof keys>>((resolve) => {
        const area = getArea(keys);
        chrome.storage[area].get(keys, (data) =>
            resolve(restoreNormalizedValue(data[keys]))
        );
    });
}

async function setItems(items: Partial<LocalStorage>): Promise<boolean>;
async function setItems(items: Partial<SyncStorage>): Promise<boolean>;
async function setItems<Key extends LocalStorageKey>(key: Key, value: LocalStorage[Key] | undefined): Promise<boolean>; // prettier-ignore
async function setItems<Key extends SyncStorageKey>(key: Key, value: SyncStorage[Key] | undefined): Promise<boolean>; // prettier-ignore

async function setItems(
    keyOrItems: Partial<Storage> | StorageKey,
    value?: StorageData
) {
    if (typeof keyOrItems === 'object') {
        return new Promise<boolean>((resolve) => {
            const area = getArea((Object.keys(keyOrItems) as StorageKey[])[0]);
            chrome.storage[area].set(normalizeStorage(keyOrItems), () => {
                chrome.runtime.lastError ? resolve(false) : resolve(true);
            });
        });
    }
    return new Promise<boolean>((resolve) => {
        chrome.storage[getArea(keyOrItems)].set(
            { [keyOrItems]: normalizeStorageValue(value) },
            () => {
                chrome.runtime.lastError ? resolve(false) : resolve(true);
            }
        );
    });
}

async function removeItems(keys: StorageKey | StorageKey[]) {
    if (Array.isArray(keys)) {
        return new Promise<boolean>((resolve) => {
            const area = getArea(Object.values(keys)[0]);
            chrome.storage[area].remove(keys, () => {
                chrome.runtime.lastError ? resolve(false) : resolve(true);
            });
        });
    }
    return new Promise<boolean>((resolve) => {
        const area = getArea(keys);
        chrome.storage[area].remove(keys, () => {
            chrome.runtime.lastError ? resolve(false) : resolve(true);
        });
    });
}

const clear = () => chrome.storage.local.clear();

const init = async () => {
    const lastStorageVersion = await getItems('storageVersion');
    if (process.env.NODE_ENV === 'development') {
        console.log('storage version:', STORAGE_VERSION);
        console.log('last storage version:', lastStorageVersion);
    }
    if (STORAGE_VERSION !== lastStorageVersion) {
        if (process.env.NODE_ENV === 'development')
            console.log('storage version changed, clear storage');
        await clear();
        await setItems('storageVersion', STORAGE_VERSION);
    }
};

export default {
    get: getItems,
    set: setItems,
    remove: removeItems,
    clear,
    init,
};
