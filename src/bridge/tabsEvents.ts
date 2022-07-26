import { logger } from 'src/logger';
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
                logger('receive from bg', request);
                const response = await callback(sender, request.params);
                logger('send response', method, response);
                sendResponse(response);
                // in Firefox listener has to return the response value, as 'sendResponse' doesn't seem to work
                // returning response doesn't affect Chrome or Safari
                return response;
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
            chrome.tabs.sendMessage(tabId, request, (response) => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                    resolve(undefined);
                }
                resolve(response);
            });
        });

export const getTabCaller =
    (tabId: number): TMessageSenderCreator<ServicesModelType> =>
    (method) =>
    (...args) =>
        sendMessageTab(tabId)(method, args[0]);
