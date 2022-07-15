import { isSearchPage } from '../searchPage/utils';
import { SearchPage } from '../searchPage/SearchPage';
import { RouteInterface } from './utils';

const routes: RouteInterface[] = [
    {
        pattern: isSearchPage,
        component: SearchPage,
    },
];

export { routes };
