import { IUser } from 'src/interfaces';

export interface IRpc {
    getToken: {
        Params: number;
        Response: string;
    };
    getTabID: {
        Params?: undefined;
        Response: number;
    };
    getExtensionID: {
        Params?: undefined;
        Response: string;
    };
    getUsers: {
        Params: { sort: string };
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
        Params: IUser;
        Response: IUser;
    };
    deleteUser: {
        Params: number;
        Response: any;
    };
}

export type Request = {
    type: 'command';
    method: string;
    params: string;
};

export const execute = <T extends keyof IRpc>(
    method: T,
    params?: IRpc[T]['Params']
) =>
    new Promise<IRpc[T]['Response']>((resolve) => {
        const request: Request = {
            type: 'command',
            method,
            params: JSON.stringify(params),
        };
        chrome.runtime.sendMessage(request, (response) => resolve(response));
    });
