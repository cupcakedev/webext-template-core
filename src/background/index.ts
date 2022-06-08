import { Services } from './services';
import { IBgRequest } from '../rpc/bg';
import { callTab } from '../rpc/tabs';

const isPromise = (value: any) => !!value && typeof value.then === 'function';

chrome.runtime.onMessage.addListener(
    (request: IBgRequest, sender, sendResponse) => {
        if (chrome.runtime.lastError) {
            sendResponse(chrome.runtime.lastError);
            return true;
        }
        if (request.type !== 'command') {
            return true;
        }
        console.log('request', request.method, ' => send');
        const { method, params } = request;

        if (!Object.keys(Services).includes(method)) {
            return Promise.reject();
        }

        const result = Services[method](sender, params as never);

        if (isPromise(result)) {
            (result as Promise<any>)
                .then((promisedResult) => {
                    console.log(promisedResult);
                    sendResponse(promisedResult);
                })
                .catch((e: any) => {
                    console.log({ error: e.message });
                    sendResponse({ error: e.message });
                });
        } else {
            console.log(result);
            sendResponse(result);
        }

        return true;
    }
);

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

        callTab(tabId, 'updateUrl').then((ok) =>
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
