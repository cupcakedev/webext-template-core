import { createStorage } from './storage';
import { IUser } from '../types';

enum LocalStorageKeys {
    users = 'users',
    counter = 'counter',
    tokensUpdating = 'tokensUpdating',
}

enum SyncStorageKeys {
    user = 'user',
    JWSToken = 'JWSToken',
    refreshJWSToken = 'refreshJWSToken',
    excludeDomains = 'excludeDomains',
}

interface ILocalStorage {
    [LocalStorageKeys.users]: IUser[];
    [LocalStorageKeys.counter]: number;
    [LocalStorageKeys.tokensUpdating]: boolean;
}

interface ISyncStorage {
    [SyncStorageKeys.JWSToken]: string;
    [SyncStorageKeys.refreshJWSToken]: string;
    [SyncStorageKeys.user]: IUser;
    [SyncStorageKeys.excludeDomains]: string;
}

const storage = createStorage<ILocalStorage, ISyncStorage>(
    LocalStorageKeys,
    SyncStorageKeys
);

const LOCAL_TEST_KEY = LocalStorageKeys.counter;
const LOCAL_TEST_VALUE = 100500;

test('storage.local set and restore', async () => {
    const initial = await storage.local.get(LOCAL_TEST_KEY);
    const success = await storage.local.set(LOCAL_TEST_KEY, LOCAL_TEST_VALUE);
    const updated = (
        await storage.local.get([LOCAL_TEST_KEY, LocalStorageKeys.users])
    )[LOCAL_TEST_KEY];
    const success2 = await storage.local.set({ [LOCAL_TEST_KEY]: initial });
    const final = await storage.local.get(LOCAL_TEST_KEY);
    expect(updated).toEqual(LOCAL_TEST_VALUE);
    expect(final).toEqual(initial);
    expect(success && success2).toBeTruthy();
});

const SYNC_TEST_KEY = SyncStorageKeys.user;
const SYNC_TEST_VALUE = {
    id: 129321312,
    name: 'foo',
    login: 'bar',
};

test('storage.sync set and restore', async () => {
    const initial = await storage.sync.get(SYNC_TEST_KEY);
    const success = await storage.sync.set(SYNC_TEST_KEY, SYNC_TEST_VALUE);
    const updated = (await storage.sync.get([SYNC_TEST_KEY]))[SYNC_TEST_KEY];
    const success2 = await storage.sync.set({ [SYNC_TEST_KEY]: initial });
    const final = await storage.sync.get(SYNC_TEST_KEY);
    expect(updated).toEqual(SYNC_TEST_VALUE);
    expect(final).toEqual(initial);
    expect(success && success2).toBeTruthy();
});

// storage.any

test('storage.any (local) set and restore ', async () => {
    const initial = await storage.any.get(LOCAL_TEST_KEY);
    const success = await storage.any.set(LOCAL_TEST_KEY, LOCAL_TEST_VALUE);
    const updated = (await storage.any.get([LOCAL_TEST_KEY]))[LOCAL_TEST_KEY];
    const success2 = await storage.any.set({ [LOCAL_TEST_KEY]: initial });
    const final = await storage.any.get(LOCAL_TEST_KEY);
    expect(updated).toEqual(LOCAL_TEST_VALUE);
    expect(final).toEqual(initial);
    expect(success && success2).toBeTruthy();
});

test('storage.any (sync) set and restore', async () => {
    const initial = await storage.any.get(SYNC_TEST_KEY);
    const success = await storage.any.set(SYNC_TEST_KEY, SYNC_TEST_VALUE);
    const updated = (await storage.any.get([SYNC_TEST_KEY]))[SYNC_TEST_KEY];
    const success2 = await storage.any.set({ [SYNC_TEST_KEY]: initial });
    const final = await storage.any.get(SYNC_TEST_KEY);
    expect(updated).toEqual(SYNC_TEST_VALUE);
    expect(final).toEqual(initial);
    expect(success && success2).toBeTruthy();
});

const ANY_TEST_OBJ = {
    JWSToken: 'token',
    refreshJWSToken: 'refresh',
    tokensUpdating: true,
};

const ANY_TEST_EMPTY_OBJ = {
    JWSToken: undefined,
    refreshJWSToken: undefined,
    tokensUpdating: undefined,
} as const;

const getAny = async () => {
    const res = await storage.any.get([
        SyncStorageKeys.JWSToken,
        SyncStorageKeys.refreshJWSToken,
        LocalStorageKeys.tokensUpdating,
    ]);
    return {
        ...ANY_TEST_EMPTY_OBJ,
        ...res,
    };
};

test('storage.any (mixed) set and restore', async () => {
    const initial = await getAny();
    const success = await storage.any.set(ANY_TEST_OBJ);
    const updated = await getAny();
    const success2 = await storage.any.set(initial);
    const final = await getAny();
    expect(success && success2).toBeTruthy();
    expect(updated).toEqual(ANY_TEST_OBJ);
    expect(final).toEqual(initial);
});
