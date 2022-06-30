import { IUser } from 'src/types';
import { LocalStorageKeys, SyncStorageKeys } from './config';
import storage from './storage';
import { Storage } from './types';

const user: IUser = {
    id: 129321312,
    name: 'foo',
    login: 'bar',
};

// test 'local' and 'sync' storage linting (+ test intellisense = add keys to array)
storage.local
    .get([LocalStorageKeys.tokensUpdating])
    .then((res) => res.tokensUpdating);
storage.sync.get([SyncStorageKeys.JWSToken]).then((res) => res.JWSToken);

// test 'storage.any' linting
storage.any.get(LocalStorageKeys.counter).then((bool) => bool); // 'local' key
storage.any.get(SyncStorageKeys.user).then((user) => user?.id); // 'sync' key
storage.any
    .get([SyncStorageKeys.user, SyncStorageKeys.JWSToken])
    .then((res) => res.user); // multiple 'sync' keys
storage.any
    .get([
        SyncStorageKeys.JWSToken,
        SyncStorageKeys.refreshJWSToken,
        LocalStorageKeys.tokensUpdating,
    ])
    .then((res) => res); // 'sync' and 'local' keys

// test 'storage.sync' roundabout
storage.sync.get(SyncStorageKeys.user).then((initial) => {
    storage.sync
        .set(SyncStorageKeys.user, user)
        .then((success) => storage.sync.get(SyncStorageKeys.user))
        .then((updated) => {
            console.log(
                `storage test 1 ${updated?.id === user.id ? 'success' : 'fail'}`
            );
            return storage.sync.set(SyncStorageKeys.user, initial);
        })
        .then((success) => storage.any.get(SyncStorageKeys.user))
        .then((final) => {
            console.log(
                `storage test 2 ${
                    final?.id === initial?.id ? 'success' : 'fail'
                }`
            );
        });
});

// test 'storage.any' roundabout
storage.any.get(LocalStorageKeys.counter).then((initial) =>
    storage.any
        .set(LocalStorageKeys.counter, 100500)
        .then((success) => storage.any.get(LocalStorageKeys.counter))
        .then((updated) => {
            console.log(
                `storage test 3 ${updated !== initial ? 'success' : 'fail'}`
            );
            return storage.any.set(LocalStorageKeys.counter, initial);
        })
        .then((success) => storage.any.get(LocalStorageKeys.counter))
        .then((final) =>
            console.log(
                `storage test 4 ${final === initial ? 'success' : 'fail'}`
            )
        )
);

const emptyStorage: Partial<Storage> = {
    JWSToken: undefined,
    refreshJWSToken: undefined,
    tokensUpdating: undefined,
};

const testStorage: typeof emptyStorage = {
    JWSToken: 'token',
    refreshJWSToken: 'refresh',
    tokensUpdating: true,
};

const getAny = () =>
    storage.any.get([
        SyncStorageKeys.JWSToken,
        SyncStorageKeys.refreshJWSToken,
        LocalStorageKeys.tokensUpdating,
    ]);

// test 'storage.any' roundabout
getAny().then((initial) => {
    initial = { ...emptyStorage, ...initial };
    storage.any
        .set(testStorage)
        .then((success) => getAny())
        .then((updated) => {
            console.log(
                `storage test 5 ${
                    updated.JWSToken === testStorage.JWSToken &&
                    updated.refreshJWSToken === testStorage.refreshJWSToken &&
                    updated.tokensUpdating === testStorage.tokensUpdating
                        ? 'success'
                        : 'fail'
                }`
            );
            return storage.any.set(initial);
        })
        .then((success) => getAny())
        .then((final) => {
            console.log(
                `storage test 6 ${
                    final.JWSToken === initial.JWSToken &&
                    final.refreshJWSToken === initial.refreshJWSToken &&
                    final.tokensUpdating === initial.tokensUpdating
                        ? 'success'
                        : 'fail'
                }`
            );
            console.log(final, initial);
        });
});
