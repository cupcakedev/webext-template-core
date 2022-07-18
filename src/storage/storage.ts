import {
    StorageArea,
    StorageKeyType,
    StorageType,
    StringEnumType,
} from './types';
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

async function getItems(keys: string | string[], area: StorageArea = 'local') {
    if (Array.isArray(keys)) {
        return new Promise<Partial<StorageType>>((resolve) => {
            chrome.storage[area].get(keys, (data) =>
                resolve(restoreNormalizedStorage(data))
            );
        });
    }
    return new Promise<any>((resolve) => {
        chrome.storage[area].get(keys, (data) =>
            resolve(restoreNormalizedValue(data[keys]))
        );
    });
}

async function setItems(
    keyOrItems: Partial<StorageType> | string,
    value?: any,
    area: StorageArea = 'local'
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
    keys: string | string[],
    area: StorageArea = 'local'
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

// storage.local, storage.sync

type Getter<S extends StorageType> = <
    Key extends StorageKeyType<S> | StorageKeyType<S>[]
>(
    keys: Key
) => Key extends StorageKeyType<S>
    ? Promise<S[Key]>
    : Promise<Pick<S, Key[number]>>;

type Setter<S extends StorageType> = <
    KeyOrItems extends StorageKeyType<S> | Partial<S>
>(
    ...args: KeyOrItems extends keyof S
        ? [key: KeyOrItems, value: S[KeyOrItems] | undefined]
        : [items: KeyOrItems]
) => Promise<boolean>;

type Remover<S extends StorageType> = (
    keys: StorageKeyType<S> | StorageKeyType<S>[]
) => Promise<boolean>;

const createGetter: <S extends StorageType>(area: StorageArea) => Getter<S> =
    (area) => (keys) =>
        /* @ts-ignore */
        getItems(keys, area);

const createSetter: <S extends StorageType>(area: StorageArea) => Setter<S> =
    (area) =>
    (keyOrItems, value = undefined) =>
        setItems(keyOrItems, value, area);

const createRemover: <S extends StorageType>(area: StorageArea) => Remover<S> =
    (area) => (keys) =>
        removeItems(keys, area);

// storage.any (mixed)

async function getAnyItems(
    allSyncKeys: StringEnumType,
    keys: string | string[]
) {
    if (Array.isArray(keys)) {
        const [syncKeys, localKeys] = splitStorageKeys(allSyncKeys, keys);

        const [localStorage, syncStorage] = await Promise.all([
            getItems(localKeys),
            getItems(syncKeys, 'sync'),
        ]);
        return { ...localStorage, ...syncStorage };
    }

    return getItems(keys, getArea(allSyncKeys, keys));
}

async function setAnyItems(
    allSyncKeys: StringEnumType,
    keyOrItems: Partial<StorageType> | string,
    value?: any
) {
    if (typeof keyOrItems === 'object') {
        const [sync, local] = splitStorage(allSyncKeys, keyOrItems);

        const [localSuccess, syncSuccess] = await Promise.all([
            setItems(local, value),
            setItems(sync, value, 'sync'),
        ]);
        return localSuccess && syncSuccess;
    }

    return setItems(keyOrItems, value, getArea(allSyncKeys, keyOrItems));
}

async function removeAnyItems(
    allSyncKeys: StringEnumType,
    keys: keyof StorageType | (keyof StorageType)[]
) {
    if (Array.isArray(keys)) {
        const [syncKeys, localKeys] = splitStorageKeys(allSyncKeys, keys);

        const [localSuccess, syncSuccess] = await Promise.all([
            removeItems(localKeys),
            removeItems(syncKeys, 'sync'),
        ]);
        return localSuccess && syncSuccess;
    }

    return removeItems(keys, getArea(allSyncKeys, keys));
}

const createAnyGetter: <S extends StorageType>(
    allSyncKeys: StringEnumType
) => Getter<S> = (allSyncKeys) => (keys) =>
    /* @ts-ignore */
    getAnyItems(allSyncKeys, keys);

const createAnySetter: <S extends StorageType>(
    allSyncKeys: StringEnumType
) => Setter<S> =
    (allSyncKeys) =>
    (keyOrItems, value = undefined) =>
        setAnyItems(allSyncKeys, keyOrItems, value);

const createAnyRemover: <S extends StorageType>(
    allSyncKeys: StringEnumType
) => Remover<S> = (allSyncKeys) => async (keys) =>
    removeAnyItems(allSyncKeys, keys);

const clearAllStorage = () =>
    Promise.all([chrome.storage.local.clear(), chrome.storage.sync.clear()]);

const createStorageArea = <T extends StorageType>(area: StorageArea) => ({
    get: createGetter<T>(area),
    set: createSetter<T>(area),
    remove: createRemover<T>(area),
    clear: () => chrome.storage[area].clear(),
});

export const createStorage = <Local, Sync>(
    localKeys: StringEnumType,
    syncKeys: StringEnumType
) => ({
    local: createStorageArea<Local>('local'),
    sync: createStorageArea<Sync>('sync'),
    any: {
        get: createAnyGetter<Local & Sync>(syncKeys),
        set: createAnySetter<Local & Sync>(syncKeys),
        remove: createAnyRemover<Local & Sync>(syncKeys),
        clear: clearAllStorage,
    },
});

export const migrageStorage = async (version: string) => {
    const lastStorageVersion = await getStorageVersion();

    console.log('storage version:', version);
    console.log('last storage version:', lastStorageVersion);

    if (version !== lastStorageVersion) {
        console.log('storage version changed, clear storage');
        await clearAllStorage();
        await setStorageVersion(version);
    }
};
