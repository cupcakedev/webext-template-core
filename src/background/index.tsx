import { Services } from './services';
import { deepDiff } from './diff';
import { RequestMessage } from '../rpc';
import { REACT_QUERY_STORAGE_KEY } from '../common/react-query/queryClient';

const { EXTENSION_NAME_PREFIX } = process.env;

chrome.runtime.onMessage.addListener(
    (request: RequestMessage, sender, sendResponse) => {
        if (chrome.runtime.lastError) {
            sendResponse(chrome.runtime.lastError);
            return true;
        }
        if (request.type !== 'command') {
            return true;
        }
        console.log('request', request.method, ' => send');
        const { method, params } = request;

        const argsObj = parseArgs(params);

        const map = Object.keys(Services);

        if (!map.includes(method)) {
            return Promise.reject();
        }

        // @ts-ignore
        const result = Services[method](sender, argsObj);

        if (isPromise(result)) {
            result
                .then((response: any) => {
                    console.log(response);
                    sendResponse(response);
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

function isPromise(promise: any) {
    return !!promise && typeof promise.then === 'function';
}

const parseArgs = (args: any) => {
    if (!args) {
        return undefined;
    }

    try {
        return JSON.parse(args);
    } catch (e) {
        console.log(`Can't parse args`);
        return undefined;
    }
};

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
        if (key === REACT_QUERY_STORAGE_KEY) {
            const old = oldValue && JSON.parse(oldValue);
            const neww = newValue && JSON.parse(newValue);
            console.log('React Query storage updated', deepDiff(old, neww));
        } else {
            console.log(
                `Storage key "${key}" in namespace "${namespace}" changed.`,
                `Old value was "${oldValue}", new value is "${newValue}".`
            );
        }
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

        chrome.tabs.sendMessage(tabId, {
            type: `${EXTENSION_NAME_PREFIX}__change_url`,
        });
    }
    console.log(tab.url);
}

chrome.tabs.onUpdated.addListener(urlListener);

// chrome.runtime.connect().onDisconnect.addListener(function() {
//     chrome.tabs.onUpdated.removeListener(urlListener)
//     console.log("disconnected")
// })
