import React from 'react';
import ReactDOM from 'react-dom';
import {QueryClientProvider} from "react-query";
import {QueryClient} from "react-query";
import {createChromeStoragePersistor} from "../storage/createChromeStoragePersistor";
import {persistQueryClient} from 'react-query/persistQueryClient-experimental'

import {getCurrentTabId} from "../common/utils";
import App from "../App";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            cacheTime: 1000 * 60 * 60 * 24, // 24 hours
        },
    },
})

const localStoragePersistor = createChromeStoragePersistor({key: `REACT_QUERY_CHROME_STORAGE_LOCAL`})

persistQueryClient({
    queryClient,
    persistor: localStoragePersistor,
    maxAge: 24 * 60 * 60
})

let injection = document.getElementById('inject');

export async function injectEntryPoint() {
    // const _store = new Store();
    // const middleware = [actionToPlainObject]
    // const store = applyMiddleware(_store, ...middleware)
    const [tabId] = await Promise.all([getCurrentTabId()]);

    // const injection = document.createElement('div');
    // injection.classList.add('extension-injection');
    // document.body.appendChild(injection);

    injection = document.getElementById('inject');
    //console.log(injection)
    // @ts-ignore
    //const shadow = injection.attachShadow({mode: 'open'});

    ReactDOM.render(
        <QueryClientProvider client={queryClient}>
            <App/>
        </QueryClientProvider>
        , injection);
}

injectEntryPoint().then().catch(e => console.log(e))


// TODO Реализовать обсервер

// let timerId: number | null = null;
// const observer = new MutationObserver(()=>{
//     // @ts-ignore
//     timerId = setTimeout(()=>{
//         if(document.getElementById('inject')) {
//             injectEntryPoint().then().catch(e => console.log(e))
//         }
//     }, 50)
// });
// if(injection){
//     observer.observe(document.getElementsByTagName('body')[0], {
//         attributes: true,
//         childList: true,
//         subtree: true
//     })
// }

//
// return () => {
//     observer.disconnect();
//     timerId && clearTimeout(timerId)
//     removeClassNames(className, selectTargetElement)
// }

//
// const listener = (newVal: any, oldVal: any) => {
//     // console.log(newVal)
//     // console.log(oldVal)
// }
//
// const init = () => {
//     // Setup internal (shared) listener for chrome.storage.onChanged
//     chrome.storage.onChanged.addListener((changes, area) => {
//         // console.log(changes)
//         const {newValue, oldValue} = changes;
//         if (!newValue)
//             return;
//         // call external chrome.storage.onChanged listeners
//         const listeners = [listener]
//         for (const fn of listeners) {
//             fn(newValue, oldValue);
//         }
//     });
// }
//
// init()
// //
// // chrome.storage.local.set({samolet: 'samolet1'}, function() {
// //     console.log('Value is set to ' + 'samolet1');
// // });
//
// chrome.storage.local.set({samolet: 'samolet3'}, function () {
//     // console.log('Value is set to ' + 'samolet3');
// });
//
// try {
//     chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//         console.log("Я не знаю почему меня тут запустили");
//         switch (message.type) {
//             case "colors-div":
//                 console.log("Я не знаю почему меня тут запустили");
//                 // var divs = document.querySelectorAll("div");
//                 // if (divs.length === 0) {
//                 //     alert("There are no any divs in the page.");
//                 // } else {
//                 //     for (var i = 0; i < divs.length; i++) {
//                 //         divs[i].style.backgroundColor = message.color;
//                 //     }
//                 // }
//                 break;
//         }
//     });
// } catch
//     (e) {
//     alert(e)
//     console.log("Я не знаю почему меня тут запустили 222");
// }