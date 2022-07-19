/* When editing this file, follow the STORAGE_VERSION instructions: */
import { IUser } from '../types';
import { createStorage } from './storage';

/**
 * Storage version must be set equal to extension version when in this version:
 *
 * 1. Storage key got deleted/renamed
 * 2. Any storage data type had changed (like if TypeScript type would change)
 *
 */
export const STORAGE_VERSION = '1.0.0';

export enum LocalStorageKeys {
    users = 'users',
    counter = 'counter',
    tokensUpdating = 'tokensUpdating',
}

export enum SyncStorageKeys {
    user = 'user',
    JWSToken = 'JWSToken',
    refreshJWSToken = 'refreshJWSToken',
    excludeDomains = 'excludeDomains',
}

export interface ILocalStorage {
    [LocalStorageKeys.users]?: IUser[];
    [LocalStorageKeys.counter]?: number;
    [LocalStorageKeys.tokensUpdating]?: boolean;
}

export interface ISyncStorage {
    [SyncStorageKeys.JWSToken]?: string;
    [SyncStorageKeys.refreshJWSToken]?: string;
    [SyncStorageKeys.user]?: IUser;
    [SyncStorageKeys.excludeDomains]?: string;
}

export type Storage = Partial<ILocalStorage & ISyncStorage>;
export type StorageKey = LocalStorageKeys | SyncStorageKeys;

export const storage = createStorage<ILocalStorage, ISyncStorage>(
    LocalStorageKeys,
    SyncStorageKeys
);
