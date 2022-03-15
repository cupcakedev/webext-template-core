export interface RouteInterface {
    pattern: string | ((pathname: string) => any);
    component: () => React.Component | React.FC<any>;
}

export interface IUser {
    id: number;
    name: string;
    login: string;
}

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
