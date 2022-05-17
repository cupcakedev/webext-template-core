import { IUser } from 'src/interfaces';
import storage, { Storage } from './storage';

const user: IUser = {
    id: 129321312,
    name: 'foo',
    login: 'bar',
};

// test 'local' and 'sync' storage linting (+ test intellisense = add keys to array)
storage.local.get(['tokensUpdating']).then((res) => res.tokensUpdating);
storage.sync.get(['JWSToken']).then((res) => res.JWSToken);

// test 'storage.any' linting
storage.any.get('counter').then((bool) => bool); // 'local' key
storage.any.get('user').then((user) => user?.id); // 'sync' key
storage.any.get(['user', 'JWSToken']).then((res) => res.user); // multiple 'sync' keys
storage.any
    .get(['JWSToken', 'refreshJWSToken', 'tokensUpdating'])
    .then((res) => res); // 'sync' and 'local' keys

// test 'storage.sync' roundabout
storage.sync.get('user').then((initial) => {
    storage.sync
        .set('user', user)
        .then((success) => storage.sync.get('user'))
        .then((updated) => {
            console.log(
                `storage test 1 ${updated?.id === user.id ? 'success' : 'fail'}`
            );
            return storage.sync.set('user', initial);
        })
        .then((success) => storage.any.get('user'))
        .then((final) => {
            console.log(
                `storage test 2 ${
                    final?.id === initial?.id ? 'success' : 'fail'
                }`
            );
        });
});

// test 'storage.any' roundabout
storage.any.get('counter').then((initial) =>
    storage.any
        .set('counter', (initial || 0) + 100500)
        .then((success) => storage.any.get('counter'))
        .then((updated) => {
            console.log(
                `storage test 3 ${updated !== initial ? 'success' : 'fail'}`
            );
            return storage.any.set('counter', (updated || 0) - 100500);
        })
        .then((success) => storage.any.get('counter'))
        .then((final) =>
            console.log(
                `storage test 4 ${final === initial ? 'success' : 'fail'}`
            )
        )
);

const testStorage: Partial<Storage> = {
    JWSToken: 'token',
    refreshJWSToken: 'refresh',
    tokensUpdating: true,
};

const getAny = () =>
    storage.any.get(['JWSToken', 'refreshJWSToken', 'tokensUpdating']);

// test 'storage.any' roundabout
getAny().then((initial) =>
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
        })
);
