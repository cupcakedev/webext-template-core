export interface RouteInterface {
    pattern: string | ((pathname: string) => any);
    component: (props: any) => JSX.Element;
}

export const findRoute = (routes: RouteInterface[], pathname: string) => {
    for (const route of routes) {
        if (typeof route.pattern === 'string') {
            const match = new RegExp(route.pattern).test(pathname);
            if (match) {
                const Component = route.component;
                return { Component };
            }
        }
        if (typeof route.pattern === 'function') {
            const match = route.pattern(pathname);
            if (match) {
                const Component = route.component;
                return { Component, props: match };
            }
        }
    }
    return null;
};
