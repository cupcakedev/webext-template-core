export interface RouteInterface {
    pattern: string | ((pathname: string) => any);
    component: (props: any) => JSX.Element;
}

export interface IUser {
    id: number;
    name: string;
    login: string;
}
