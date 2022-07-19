import {
    ILocalStorage,
    ISyncStorage,
    LocalStorageKeys,
    storage,
    SyncStorageKeys,
} from 'src/storage/config';
import { createHookUseChromeStorage } from './useChromeStorage';

const useChromeStorage = createHookUseChromeStorage<
    ILocalStorage,
    ISyncStorage
>(storage, SyncStorageKeys);

const Component = () => {
    const [counter, setCounter] = useChromeStorage(LocalStorageKeys.counter, 0);
    const [user, setUser] = useChromeStorage(LocalStorageKeys.users);
};
