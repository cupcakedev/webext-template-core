import Demo from './components/Demo';
import { RouteInterface } from '../interfaces';

export const routes: RouteInterface[] = [
    {
        pattern: (pathname) => pathname.includes('google.com'),
        component: () => Demo,
    },
];
