import {Services} from './services'
import {EXTENSION_PREFIX} from "../config";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type !== 'command') {
        return;
    }
    const {method, params} = request

    const argsObj = parseArgs(params);

    const map = Object.keys(Services)

    if (!map.includes(method)) {
        return Promise.reject()
    }

    // @ts-ignore
    Services[method](sender, argsObj)
        .then((response: any) => {
            console.log(response)
            if (response !== undefined) {
                sendResponse(response)
            }
        })
        .catch((e:any) => {
            sendResponse({error: e.message})
        })

    return true;
});

const parseArgs = (args: any) => {
    if (!args) {
        return undefined;
    }

    try {
        return JSON.parse(args);
    } catch (e) {
        console.log(`Can't parse args`)
        return undefined;
    }
}


// // // listening for an event / long-lived connections
// // // coming from devtools
// //     chrome.runtime.onConnect.addListener(function (port) {
// //         port.onMessage.addListener(function (message) {
// //             switch (port.name) {
// //                 case "color-divs-port":
// //                     colorDivs();
// //                     break;
// //             }
// //         });
// //     });

// // send a message to the content script
//     var colorDivs = function () {
//         chrome.tabs.query({"active": true, "lastFocusedWindow": true}, function (tabs) {
//             const tabURL = tabs[0].url;
//             console.log("URL from get-url.js", tabURL);
//             chrome.tabs.sendMessage(tabs[0].id as number, {type: "colors-div", color: "#F00"});
//         });
//     }
// }
// catch (e) {
//     alert(e)
// }

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let [key, {oldValue, newValue}] of Object.entries(changes)) {
        console.log(
            `Storage key "${key}" in namespace "${namespace}" changed.`,
            `Old value was "${oldValue}", new value is "${newValue}".`
        );
    }
});

chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
        if (changeInfo.status === 'complete') {
            console.log(`${EXTENSION_PREFIX}__change_url`)
            chrome.tabs.sendMessage( tabId, {
                type: `${EXTENSION_PREFIX}__change_url`
            })
        }
    }
);