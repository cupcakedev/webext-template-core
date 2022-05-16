/* When editing this file, follow the STORAGE_VERSION instructions: */
import { IUser } from '../interfaces';

/**
 * Storage version must be set equal to extension version when in this version:
 *
 * 1. Storage key got deleted/renamed
 * 2. Any storage data type had changed (like if TypeScript type would change)
 *
 */
export const STORAGE_VERSION = '1.0.0';

const dataStorageKeys = {
    users: 'users',
    counter: 'counter',
} as const;

const authStorageKeys = {
    user: 'user',
    JWSToken: 'JWSToken',
    refreshJWSToken: 'refreshJWSToken',
} as const;

const stateStorageKeys = {
    tokensUpdating: 'tokensUpdating',
} as const;

export const localStorageKeys = {
    ...stateStorageKeys,
    ...dataStorageKeys,
} as const;

export const syncStorageKeys = authStorageKeys;

export interface ILocalStorage {
    users: IUser[];
    counter: number;
    tokensUpdating: boolean;
}

export interface ISyncStorage {
    JWSToken: string;
    refreshJWSToken: string;
    user: IUser;
}
