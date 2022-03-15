import React, { useEffect, useState } from 'react';
import { listenToMessage, findRoute } from '../common/utils';
import { routes } from './Routes';

const { EXTENSION_NAME_PREFIX } = process.env;

const App = () => {
    const [pathname, setPathname] = useState<string>(window.location.pathname);
    const [search, setSearch] = useState<string>(window.location.search);
    const Route = findRoute(routes, pathname);

    useEffect(() => {
        let prevPathname = window.location.pathname;
        let prevSearch = window.location.search;
        listenToMessage(
            `${EXTENSION_NAME_PREFIX}__change_url`,
            (sender, sendResponse) => {
                if (window.location.pathname !== prevPathname) {
                    setPathname(window.location.pathname);
                    prevPathname = window.location.pathname;
                }
                if (window.location.search !== prevSearch) {
                    setSearch(window.location.search);
                    prevSearch = window.location.search;
                }
            }
        );
    }, []);

    if (!Route) return null;
    // @ts-ignore
    return <Route.Component {...Route.props} />;
};

export default App;
