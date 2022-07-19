import {
    IServices,
    ServicesModelType,
    TMessageListener,
    TMessageSender,
} from '../../types';

export interface ITabsServicesModel extends ServicesModelType {
    updateUrl: {
        Params: undefined;
        Response: boolean;
    };
    getStatus: {
        Params: undefined;
        Response: 'ok' | 'loading' | 'error';
    };
}

export type ITabServices = IServices<ITabsServicesModel>;

export type TTabMessegeSender = TMessageSender<ITabsServicesModel>;

export type TTabMessageListener = TMessageListener<ITabsServicesModel>;
