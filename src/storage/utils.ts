import partition from 'lodash/partition';
import { StorageDataType, StringEnumType } from './types';

export const getArea = (allSyncKeys: StringEnumType, key: string) =>
    allSyncKeys[key] ? 'sync' : 'local';

export const splitStorageKeys = (
    allSyncKeys: StringEnumType,
    keys: (keyof StorageDataType)[]
) => partition(keys, (key) => allSyncKeys[key]);

export const splitStorage = (
    allSyncKeys: StringEnumType,
    storage: StorageDataType
) =>
    Object.entries(storage).reduce<[StorageDataType, StorageDataType]>(
        (arr, [key, value]) => {
            if (allSyncKeys[key]) {
                Object.assign(arr[0], { [key]: value });
                return arr;
            }
            Object.assign(arr[1], { [key]: value });
            return arr;
        },
        [{}, {}]
    );

// Safari skips writes with 'undefined' and 'null', write '' instead
const EMPTY_VALUE = '' as const;

const shouldNormalize = (value: any) => value === undefined || value === null;

export const normalizeStorageValue = (value: any) =>
    shouldNormalize(value) ? EMPTY_VALUE : value;

export const normalizeStorage = (
    items: StorageDataType
): Partial<StorageDataType> =>
    Object.entries(items).reduce((acc, [key, value]) => {
        if (shouldNormalize(value)) {
            Object.assign(acc, { [key]: EMPTY_VALUE });
        }
        return acc;
    }, items);

export const restoreNormalizedValue = (value: any) =>
    value === EMPTY_VALUE ? undefined : value;

export const restoreNormalizedStorage = (
    data: StorageDataType
): Partial<StorageDataType> =>
    Object.entries(data).reduce<Partial<StorageDataType>>(
        (acc, [key, value]) => {
            if (value === EMPTY_VALUE) {
                Object.assign(acc, { [key]: undefined });
            }
            return acc;
        },
        data
    );

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
