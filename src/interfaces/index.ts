export type IServices<T> = {
    [name in keyof IRpc]: <T extends { Params?: any; Response: any; }>
    (sender: any, args:IRpc[name]['Params']) => Promise<T['Response']>;
};

export interface RouteInterface {
    pattern: string | ((pathname: string) => any);
    component: () => React.Component | React.FC<any>
}

export interface IUser {
    id: string,
    name: string,
    login: string
}

export interface IRpc {
    getToken: {
        Params: number
        Response: string
    },
    getTabID: {
        Params?: undefined
        Response: string
    },
    getExtensionID: {
        Params?: undefined
        Response: string
    },
    getUsers: {
        Params: {sort: string}
        Response: Array<IUser>
    },
    addUser: {
        Params: {
            name: IUser['name']
            login: IUser['login']
        }
        Response: IUser
    },
    updateUser: {
        Params: IUser
        Response: IUser
    },
    deleteUser: {
        Params: number
        Response: any
    },
}