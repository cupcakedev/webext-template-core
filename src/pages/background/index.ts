import { listenContentMessages } from 'src/bridge/bgEvents';
import { sendMessageTab } from 'src/bridge/tabsEvents';
import { Services } from './services';
import { storage } from '../../storage/storage';
import { LocalStorageKeys, SyncStorageKeys } from 'src/storage/config';

listenContentMessages(Services);

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
        console.log(
            `Storage key "${key}" in namespace "${namespace}" changed.`,
            'Old value was ',
            oldValue,
            'new value is ',
            newValue,
            '.'
        );
    }
});

function urlListener(
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab
) {
    if (changeInfo.status === 'complete') {
        if (chrome.runtime.lastError) {
            return;
        }

        console.log(tab.url);

        sendMessageTab(tabId, 'updateUrl').then((ok) =>
            ok
                ? console.log('updated URL for tab', tabId)
                : console.log('no URL update needed for tab', tabId)
        );
    }
}

chrome.tabs.onUpdated.addListener(urlListener);

// STORAGE USAGE EXAMPLES (+ intellisense)

// 'storage.local' and 'storage.sync'
storage.local
    .get([LocalStorageKeys.tokensUpdating])
    .then((res) => res.tokensUpdating);
storage.sync.get([SyncStorageKeys.JWSToken]).then((res) => res.JWSToken);

// 'storage.any'
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
