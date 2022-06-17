import {
    IBgRequest,
    IBgServices,
    BgMessageSender,
    BgMessageSenderCreator,
} from './types/bgEvents';

const isPromise = (value: any) => !!value && typeof value.then === 'function';

export const listenContentMessages = (Services: IBgServices) =>
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

export const sendMessageBg: BgMessageSender = (...args) =>
    new Promise((resolve) => {
        const request: IBgRequest = {
            type: 'command',
            method: args[0],
            params: args[1],
        };
        chrome.runtime.sendMessage(request, (response) => resolve(response));
    });

export const createBgMessageSender: BgMessageSenderCreator =
    (method) =>
    (...args) =>
        sendMessageBg(method, args[0]);
