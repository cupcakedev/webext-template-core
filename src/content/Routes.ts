import Demo from './components/Demo';
import { RouteInterface } from '../interfaces';

export const routes: RouteInterface[] = [
    { pattern: '/demo', component: () => Demo },
];
