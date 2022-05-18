import Demo from './components/DemoInjection';
import { RouteInterface } from '../interfaces';
import { isSearchPage } from './searchPage/utils';
import { SearchPage } from './searchPage/SearchPage';

const isDemoPage = (pathname: string) => pathname.includes('/demo');

export const routes: RouteInterface[] = [
    {
        pattern: isSearchPage,
        component: SearchPage,
    },
    {
        pattern: isDemoPage,
        component: Demo,
    },
];
