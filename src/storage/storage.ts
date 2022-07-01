import { LocalStorageKeys, SyncStorageKeys, STORAGE_VERSION } from './config';
import { Storage, StorageKey, LocalStorage, SyncStorage } from './types';
import {
    getArea,
    getStorageVersion,
    normalizeStorage,
    normalizeStorageValue,
    restoreNormalizedStorage,
    restoreNormalizedValue,
    setStorageVersion,
    splitStorage,
    splitStorageKeys,
} from './utils';

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

// local storage

async function getLocalItems<Keys extends LocalStorageKeys[]>(keys: Keys): Promise<Pick<LocalStorage, Keys[number]>>; // prettier-ignore
async function getLocalItems<Key extends LocalStorageKeys>(key: Key): Promise<LocalStorage[Key]>; // prettier-ignore
async function getLocalItems(keys: StorageKey | StorageKey[]) {
    return getItems(keys);
}

async function setLocalItems(items: Partial<LocalStorage>): Promise<boolean>; // prettier-ignore
async function setLocalItems<Key extends LocalStorageKeys>(key: Key, value: LocalStorage[Key] | undefined): Promise<boolean>; // prettier-ignore
async function setLocalItems(
    keyOrItems: Partial<Storage> | StorageKey,
    value?: Storage[StorageKey]
) {
    return setItems(keyOrItems, value);
}

async function removeLocalItems(keys: LocalStorageKeys | LocalStorageKeys[]) {
    return removeItems(keys);
}

// sync storage

async function getSyncItems<Keys extends SyncStorageKeys[]>(keys: Keys): Promise<Pick<SyncStorage, Keys[number]>>; // prettier-ignore
async function getSyncItems<Key extends SyncStorageKeys>(key: Key): Promise<SyncStorage[Key]>; // prettier-ignore
async function getSyncItems(keys: StorageKey | StorageKey[]) {
    return getItems(keys, 'sync');
}

async function setSyncItems(items: Partial<SyncStorage>): Promise<boolean>; // prettier-ignore
async function setSyncItems<Key extends SyncStorageKeys>(key: Key, value: SyncStorage[Key] | undefined): Promise<boolean>; // prettier-ignore
async function setSyncItems(
    keyOrItems: Partial<Storage> | StorageKey,
    value?: Storage[StorageKey]
) {
    return setItems(keyOrItems, value, 'sync');
}

async function removeSyncItems(keys: SyncStorageKeys | SyncStorageKeys[]) {
    return removeItems(keys, 'sync');
}

// mixed storage

async function getAnyItems<Keys extends StorageKey[]>(keys: Keys): Promise<Pick<Storage, Keys[number]>>; // prettier-ignore
async function getAnyItems<Key extends StorageKey>(key: Key): Promise<Storage[Key]>; // prettier-ignore
async function getAnyItems(keys: StorageKey | StorageKey[]) {
    if (Array.isArray(keys)) {
        const [syncKeys, localKeys] = splitStorageKeys(keys);

        const [localStorage, syncStorage] = await Promise.all([
            getItems(localKeys) as Promise<Partial<Storage>>,
            getItems(syncKeys, 'sync') as Promise<Partial<Storage>>,
        ]);
        return { ...localStorage, ...syncStorage };
    }

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

        const [localSuccess, syncSuccess] = await Promise.all([
            setItems(local, value),
            setItems(sync, value, 'sync'),
        ]);
        return localSuccess && syncSuccess;
    }

    return setItems(keyOrItems, value, getArea(keyOrItems));
}

async function removeAnyItems(keys: StorageKey | StorageKey[]) {
    if (Array.isArray(keys)) {
        const [syncKeys, localKeys] = splitStorageKeys(keys);

        const [localSuccess, syncSuccess] = await Promise.all([
            removeItems(localKeys),
            removeItems(syncKeys, 'sync'),
        ]);
        return localSuccess && syncSuccess;
    }

    return removeItems(keys, getArea(keys));
}

// init

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

export const storage = {
    local: {
        get: getLocalItems,
        set: setLocalItems,
        remove: removeLocalItems,
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
        remove: removeAnyItems,
        clear: clearStorage,
    },
};
