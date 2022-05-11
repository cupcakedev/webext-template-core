import { IUser } from '../interfaces';

export interface IRpc {
    getToken: {
        Params: undefined;
        Response: string;
    };
    getTabID: {
        Params: undefined;
        Response: number;
    };
    getExtensionID: {
        Params: { id?: string };
        Response: string;
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
        Response: any;
    };
}

export type RequestMessage = {
    type: 'command';
    method: string;
    params: string;
};

type Request = <T extends keyof IRpc>(
    ...args: Partial<IRpc[T]['Params']> extends IRpc[T]['Params']
        ? [method: T, params?: IRpc[T]['Params']]
        : [method: T, params: IRpc[T]['Params']]
) => Promise<IRpc[T]['Response']>;

export const execute: Request = (...args) =>
    new Promise<IRpc[typeof args[0]]['Response']>((resolve) => {
        const request: RequestMessage = {
            type: 'command',
            method: args[0],
            params: JSON.stringify(args[1]),
        };
        chrome.runtime.sendMessage(request, (response) => resolve(response));
    });

type Factory = <T extends keyof IRpc>(
    method: T
) => (
    ...args: Partial<IRpc[T]['Params']> extends IRpc[T]['Params']
        ? [params?: IRpc[T]['Params']]
        : [params: IRpc[T]['Params']]
) => Promise<IRpc[T]['Response']>;

export const factory: Factory =
    (method) =>
    (...args) =>
        execute(method, args[0]);
