import partition from 'lodash/partition';
import { LocalStorageKeys, SyncStorageKeys } from './config';
import { LocalStorage, Storage, StorageKey, SyncStorage } from './types';

export const getArea = (key: StorageKey) =>
    SyncStorageKeys[key as keyof SyncStorage] ? 'sync' : 'local';

export const splitStorageKeys = (keys: StorageKey[]) =>
    partition(keys, (key) => SyncStorageKeys[key as keyof SyncStorage]) as [
        SyncStorageKeys[],
        LocalStorageKeys[]
    ];

export const splitStorage = (storage: Partial<Storage>) =>
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

export const normalizeStorageValue = (value: Storage[StorageKey]) =>
    shouldNormalize(value) ? EMPTY_VALUE : value;

export const normalizeStorage = (
    items: Partial<Storage>
): Partial<StorageRaw> =>
    Object.entries(items).reduce((acc, [key, value]) => {
        if (shouldNormalize(value)) {
            Object.assign(acc, { [key]: EMPTY_VALUE });
        }
        return acc;
    }, items);

export const restoreNormalizedValue = (value: Storage[StorageKey]) =>
    value === EMPTY_VALUE ? undefined : value;

export const restoreNormalizedStorage = (
    data: Partial<StorageRaw>
): Partial<Storage> =>
    Object.entries(data).reduce((acc, [key, value]) => {
        if (value === EMPTY_VALUE) {
            Object.assign(acc, { [key]: undefined });
        }
        return acc;
    }, data as Partial<Storage>);

const STORAGE_VERSION_KEY = 'storageVersion';

export const getStorageVersion = () =>
    new Promise<string>((resolve) => {
        chrome.storage.local.get(STORAGE_VERSION_KEY, (data) =>
            resolve(data[STORAGE_VERSION_KEY])
        );
    });

export const setStorageVersion = (version: string) =>
    new Promise<boolean>((resolve) => {
        chrome.storage.local.set({ [STORAGE_VERSION_KEY]: version }, () => {
            chrome.runtime.lastError ? resolve(false) : resolve(true);
        });
    });
