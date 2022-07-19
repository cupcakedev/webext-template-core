import {
    IServices,
    ServicesModelType,
    TMessageListener,
    TMessageSender,
} from '../../types';
import { IUser } from '../../../types';

export interface IBgServicesModel extends ServicesModelType {
    getToken: {
        Params: undefined;
        Response: string;
    };
    getTabID: {
        Params: undefined;
        Response: number | undefined;
    };
    getExtensionID: {
        Params: { id?: string };
        Response: string | undefined;
    };
    getUsers: {
        Params: { sort?: string };
        Response: Array<IUser>;
    };
    addUser: {
        Params: {
            name: IUser['name'];
            login: IUser['login'];
        };
        Response: IUser;
    };
    updateUser: {
        Params: { user: IUser };
        Response: IUser;
    };
    deleteUser: {
        Params: { id: number };
        Response: undefined;
    };
}

export type IBgServices = IServices<IBgServicesModel>;

export type TBgMessegeSender = TMessageSender<IBgServicesModel>;

export type TBgMessageListener = TMessageListener<IBgServicesModel>;
