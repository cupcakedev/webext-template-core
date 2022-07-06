import { LocalStorageKeys, SyncStorageKeys } from './config';
import { storage } from './storage';

const LOCAL_TEST_KEY = LocalStorageKeys.counter;
const LOCAL_TEST_VALUE = 100500;

test('storage.local set and restore', async () => {
    const initial = await storage.local.get(LOCAL_TEST_KEY);
    const success = await storage.local.set(LOCAL_TEST_KEY, LOCAL_TEST_VALUE);
    const updated = await storage.local.get(LOCAL_TEST_KEY);
    const success2 = await storage.local.set(LOCAL_TEST_KEY, initial);
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
    const updated = await storage.sync.get(SYNC_TEST_KEY);
    const success2 = await storage.sync.set(SYNC_TEST_KEY, initial);
    const final = await storage.any.get(SYNC_TEST_KEY);
    expect(updated).toEqual(SYNC_TEST_VALUE);
    expect(final).toEqual(initial);
    expect(success && success2).toBeTruthy();
});

const ANY_TEST_KEYS = [
    SyncStorageKeys.JWSToken,
    SyncStorageKeys.refreshJWSToken,
    LocalStorageKeys.tokensUpdating,
];

const ANY_TEST_OBJ = {
    JWSToken: 'token',
    refreshJWSToken: 'refresh',
    tokensUpdating: true,
};

const ANY_TEST_EMPTY_OBJ: { [key in keyof typeof ANY_TEST_OBJ]: undefined } = {
    JWSToken: undefined,
    refreshJWSToken: undefined,
    tokensUpdating: undefined,
};

const getAny = () =>
    storage.any
        .get(ANY_TEST_KEYS)
        .then((res) => ({ ...ANY_TEST_EMPTY_OBJ, ...res }));

test('storage.any mixed keys set and restore', async () => {
    const initial = await getAny();
    const success = await storage.any.set(ANY_TEST_OBJ);
    const updated = await getAny();
    const success2 = await storage.any.set(initial);
    const final = await getAny();
    expect(success && success2).toBeTruthy();
    expect(updated).toEqual(ANY_TEST_OBJ);
    expect(final).toEqual(initial);
});
