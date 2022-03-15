import { Services } from './services';

const { EXTENSION_NAME_PREFIX } = process.env;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (chrome.runtime.lastError) {
        sendResponse(chrome.runtime.lastError);
        return true;
    }
    if (request.type !== 'command') {
        return;
    }
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
                if (response !== undefined) {
                    sendResponse(response);
                }
            })
            .catch((e: any) => {
                sendResponse({ error: e.message });
            });
    } else {
        sendResponse(result);
    }

    return true;
});

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
        console.log(
            `Storage key "${key}" in namespace "${namespace}" changed.`,
            `Old value was "${oldValue}", new value is "${newValue}".`
        );
    }
});

function urlListener(tabId: any, changeInfo: any, tab: any) {
    if (changeInfo.status === 'complete') {
        if (chrome.runtime.lastError) {
            return;
        }

        chrome.tabs.sendMessage(tabId, {
            type: `${EXTENSION_NAME_PREFIX}__change_url`,
        });
    }
}

chrome.tabs.onUpdated.addListener(urlListener);

// chrome.runtime.connect().onDisconnect.addListener(function() {
//     chrome.tabs.onUpdated.removeListener(urlListener)
//     console.log("disconnected")
// })
