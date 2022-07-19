import {
    listenContentMessages as listener,
    sendMessageBg as sender,
} from '../bgEvents';
import { IBgServices, TBgMessegeSender } from './types/bgEvents';

export const sendMessageBg: TBgMessegeSender = (...args) =>
    sender<any>(args[0], args[1]);

export const listenContentMessages = (model: IBgServices) => listener(model);
