import type { Subtype } from '../types/utils';
import type {
    ILocalStorage,
    ISyncStorage,
    LocalStorageKeys,
    SyncStorageKeys,
} from './config';

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
