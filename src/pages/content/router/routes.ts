import DemoInjection from '../components/DemoInjection';
import { isSearchPage } from '../searchPage/utils';
import { SearchPage } from '../searchPage/SearchPage';
import { RouteInterface } from './utils';

const isDemoPage = () => true; // (pathname: string) => pathname.includes('/demo');

const routes: RouteInterface[] = [
    {
        pattern: isSearchPage,
        component: SearchPage,
    },
    {
        pattern: isDemoPage,
        component: DemoInjection,
    },
];

export default routes;
