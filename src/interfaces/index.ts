export interface RouteInterface {
    pattern: string | ((pathname: string) => any);
    component: () => React.Component | React.FC<any>;
}

export interface IUser {
    id: number;
    name: string;
    login: string;
}
