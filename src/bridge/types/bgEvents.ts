import { Promisable } from 'src/interfaces/utils';
import { IUser } from '../../interfaces';

export interface IBgServicesModel {
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

export type IBgServices = {
    [Key in keyof IBgServicesModel]: Partial<
        IBgServicesModel[Key]['Params']
    > extends IBgServicesModel[Key]['Params']
        ? (
              sender: chrome.runtime.MessageSender,
              args?: IBgServicesModel[Key]['Params']
          ) => Promisable<IBgServicesModel[Key]['Response']>
        : (
              sender: chrome.runtime.MessageSender,
              args: IBgServicesModel[Key]['Params']
          ) => Promisable<IBgServicesModel[Key]['Response']>;
};

export interface IBgRequest<
    Key extends keyof IBgServicesModel = keyof IBgServicesModel
> {
    type: 'command';
    method: Key;
    params: IBgServicesModel[Key]['Params'];
}

export type BgMessageSender = <T extends keyof IBgServicesModel>(
    ...args: Partial<
        IBgServicesModel[T]['Params']
    > extends IBgServicesModel[T]['Params']
        ? [method: T, params?: IBgServicesModel[T]['Params']]
        : [method: T, params: IBgServicesModel[T]['Params']]
) => Promise<IBgServicesModel[T]['Response']>;

export type BgMessageSenderCreator = <T extends keyof IBgServicesModel>(
    method: T
) => (
    ...args: Partial<
        IBgServicesModel[T]['Params']
    > extends IBgServicesModel[T]['Params']
        ? [params?: IBgServicesModel[T]['Params']]
        : [params: IBgServicesModel[T]['Params']]
) => Promise<IBgServicesModel[T]['Response']>;
