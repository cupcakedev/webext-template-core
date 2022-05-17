export interface RouteInterface {
    pattern: string | ((pathname: string) => any);
    component: React.ComponentType;
}

export interface IUser {
    id: number;
    name: string;
    login: string;
}
