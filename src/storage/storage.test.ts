import { IUser } from 'src/interfaces';
import storage from './storage';

const user: IUser = {
    id: 129321312,
    name: 'foo',
    login: 'bar',
};

// test 'local' and 'sync' storage linting (+ test intellisense = add keys to array)
storage.local.get(['tokensUpdating']).then((res) => res.tokensUpdating);
storage.sync.get(['JWSToken']).then((res) => res.JWSToken);

// test 'storage.any' linting
storage.any.get('tokensUpdating').then((bool) => bool); // 'local' key
storage.any.get('user').then((user) => user?.id); // 'sync' key
// storage.any.get(['user', 'JWSToken']).then(res => res.user); // multiple 'sync' keys
// storage.any.get(['JWSToken', 'refreshJWSToken', 'tokensUpdating']).then(res => res.user); // 'sync' and 'local' keys

// test 'storage.sync' roundabout
storage.sync.get('user').then((initial) => {
    storage.sync
        .set('user', user)
        .then((success) => storage.sync.get('user'))
        .then((updated) => {
            console.log(
                'storage test 1 ' +
                    (updated?.id === user.id ? 'success' : 'fail')
            );
            return storage.sync.set('user', initial);
        })
        .then((success) => storage.any.get('user'))
        .then((final) => {
            console.log(
                'storage test 2 ' +
                    (final?.id === initial?.id ? 'success' : 'fail')
            );
        });
});

// test 'storage.any' roundabout
storage.any.get('tokensUpdating').then((initial) =>
    storage.any
        .set('tokensUpdating', !initial)
        .then((success) => storage.any.get('tokensUpdating'))
        .then((updated) => {
            console.log(
                'storage test 3 ' + (updated !== initial ? 'success' : 'fail')
            );
            return storage.any.set('tokensUpdating', !updated);
        })
        .then((success) => storage.any.get('tokensUpdating'))
        .then((final) =>
            console.log(
                'storage test 4 ' + (final === initial ? 'success' : 'fail')
            )
        )
);
