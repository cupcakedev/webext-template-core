import { Promisable } from 'src/interfaces/utils';
import { IUser } from '../interfaces';

export interface IBgModel {
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
    [Key in keyof IBgModel]: Partial<
        IBgModel[Key]['Params']
    > extends IBgModel[Key]['Params']
        ? (
              sender: chrome.runtime.MessageSender,
              args?: IBgModel[Key]['Params']
          ) => Promisable<IBgModel[Key]['Response']>
        : (
              sender: chrome.runtime.MessageSender,
              args: IBgModel[Key]['Params']
          ) => Promisable<IBgModel[Key]['Response']>;
};

export interface IBgRequest<Key extends keyof IBgModel = keyof IBgModel> {
    type: 'command';
    method: Key;
    params: IBgModel[Key]['Params'];
}

type BgCaller = <T extends keyof IBgModel>(
    ...args: Partial<IBgModel[T]['Params']> extends IBgModel[T]['Params']
        ? [method: T, params?: IBgModel[T]['Params']]
        : [method: T, params: IBgModel[T]['Params']]
) => Promise<IBgModel[T]['Response']>;

export const callBg: BgCaller = (...args) =>
    new Promise((resolve) => {
        const request: IBgRequest = {
            type: 'command',
            method: args[0],
            params: args[1],
        };
        chrome.runtime.sendMessage(request, (response) => resolve(response));
    });

type BgFactory = <T extends keyof IBgModel>(
    method: T
) => (
    ...args: Partial<IBgModel[T]['Params']> extends IBgModel[T]['Params']
        ? [params?: IBgModel[T]['Params']]
        : [params: IBgModel[T]['Params']]
) => Promise<IBgModel[T]['Response']>;

export const getBgCaller: BgFactory =
    (method) =>
    (...args) =>
        callBg(method, args[0]);
