import {
    IRequest,
    ServicesModelType,
    TMessageListener,
    TMessageSender,
    TMessageSenderCreator,
} from './types';

type ITabRequest = IRequest<'tabs_command'>;

export const listenBgMessage: TMessageListener<ServicesModelType> = (
    method,
    callback
) => {
    chrome.runtime.onMessage.addListener(
        async (request: ITabRequest, sender, sendResponse) => {
            if (request.type === 'tabs_command' && request.method === method) {
                console.log('receive from bg', request);
                const response = await callback(sender, request.params);
                console.log('send response', method, response);
                sendResponse(response);
            }
            return true;
        }
    );
};

export const sendMessageTab =
    (tabId: number): TMessageSender<ServicesModelType> =>
    (...args) =>
        new Promise((resolve) => {
            const request: ITabRequest = {
                type: 'tabs_command',
                method: args[0],
                params: args[1],
            };
            chrome.tabs.sendMessage(tabId, request, (response) =>
                resolve(response)
            );
        });

export const getTabCaller =
    (tabId: number): TMessageSenderCreator<ServicesModelType> =>
    (method) =>
    (...args) =>
        sendMessageTab(tabId)(method, args[0]);
