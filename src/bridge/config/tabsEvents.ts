import {
    listenBgMessage as listener,
    sendMessageTab as sender,
} from '../tabsEvents';
import { TTabMessageListener, TTabMessegeSender } from './types/tabsEvents';

export const sendMessageTab =
    (tabId: number): TTabMessegeSender =>
    (...args) =>
        sender(tabId)(args[0], args[1]);

export const listenBgMessage: TTabMessageListener = listener;
