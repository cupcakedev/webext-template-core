export interface ITokenArgs {
    login: string
}

export interface ICommandGetToken {
    method: 'getToken';
    params?: ITokenArgs;
    response? : (data:any) => void
}

export interface ICommandGetTabID {
    method: 'getTabID';
    params?: any
    response? : (data:any) => void
}

export interface ICommandGetExtensionID {
    method: 'getExtensionID';
    params?: any
    response? : (data:any) => void
}

export interface ICommandGetUsers {
    method: 'getUsers';
    params?: any
    response? : (data:any) => void
}

export interface ICommandAddUsers {
    method: 'addUser';
    params?: any
    response? : (data:any) => void
}

export interface ICommandUpdateUser {
    method: 'updateUser';
    params?: any
    response? : (data:any) => void
}

export type ICommand = ICommandGetToken | ICommandGetTabID | ICommandGetExtensionID | ICommandGetUsers | ICommandAddUsers | ICommandUpdateUser// | ICommandSomething

export interface IRoute {
    method: string;
    params?: {};
    response? : (data:any) => void
    sender?: any
}

export interface RouteInterface {
    pattern: string | ((pathname: string)=>any);
    component: () => React.Component | React.FC<any>
}