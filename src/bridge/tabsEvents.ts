import {
    ITabRequest,
    TabMessageSender,
    TabMessageSenderCreator,
    TabMessageListener,
} from './types/tabsEvents';

export const listenBgMessage: TabMessageListener = (type, callback) => {
    chrome.runtime.onMessage.addListener(
        async (request: ITabRequest, sender, sendResponse) => {
            if (request.type === type) {
                console.log('receive from bg', request);
                const response = await callback(sender, request.params);
                console.log('send response', type, response);
                sendResponse(response);
            }
            return true;
        }
    );
};

export const sendMessageTab: TabMessageSender = (...args) =>
    new Promise((resolve) => {
        const request: ITabRequest = {
            key: 'tabs_command',
            type: args[1],
            params: args[2],
        };
        chrome.tabs.sendMessage(args[0], request, (response) =>
            resolve(response)
        );
    });

export const getTabCaller: TabMessageSenderCreator =
    (method) =>
    (...args) =>
        sendMessageTab(args[0], method, args[1]);
