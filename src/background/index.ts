import { listenContentMessages } from 'src/bridge/bgEvents';
import { sendMessageTab } from 'src/bridge/tabsEvents';
import { Services } from './services';

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

// chrome.runtime.connect().onDisconnect.addListener(function() {
//     chrome.tabs.onUpdated.removeListener(urlListener)
//     console.log("disconnected")
// })
