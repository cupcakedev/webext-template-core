export interface RouteInterface {
    pattern: string | ((pathname: string) => any);
    component: React.ComponentType<any>;
}

export interface IUser {
    id: number;
    name: string;
    login: string;
}
