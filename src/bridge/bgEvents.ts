import { logger } from 'src/logger';
import {
    IRequest,
    IServices,
    ServicesModelType,
    TMessageSender,
    TMessageSenderCreator,
} from './types';

type IBgRequest = IRequest<'command'>;

const isPromise = (value: any) => !!value && typeof value.then === 'function';

export const listenContentMessages = (Services: IServices<ServicesModelType>) =>
    chrome.runtime.onMessage.addListener(
        (request: IBgRequest, sender, sendResponse) => {
            if (chrome.runtime.lastError) {
                sendResponse(chrome.runtime.lastError);
                return true;
            }
            if (request.type !== 'command') {
                return true;
            }
            logger('request', request.method, ' => send');
            const { method, params } = request;

            if (!Object.keys(Services).includes(method)) {
                return Promise.reject();
            }

            const result = Services[method](sender, params as never);

            if (isPromise(result)) {
                (result as Promise<any>)
                    .then((promisedResult) => {
                        logger(promisedResult);
                        sendResponse(promisedResult);
                    })
                    .catch((e: any) => {
                        logger({ error: e.message });
                        sendResponse({ error: e.message });
                    });
            } else {
                logger(result);
                sendResponse(result);
            }

            return true;
        }
    );

export const sendMessageBg: TMessageSender<ServicesModelType> = (...args) =>
    new Promise((resolve) => {
        const request: IBgRequest = {
            type: 'command',
            method: args[0],
            params: args[1],
        };
        chrome.runtime.sendMessage(request, (response) => resolve(response));
    });

export const createBgMessageSender: TMessageSenderCreator<ServicesModelType> =
    (method) =>
    (...args) =>
        sendMessageBg(method, args[0]);
