import React, { useEffect, useState } from 'react';
import { listenBgMessage } from 'src/bridge/tabsEvents';
import routes from './routes';
import { findRoute } from './utils';

const Router = () => {
    const [url, setUrl] = useState<string>(window.location.href);
    const [search, setSearch] = useState<string>(window.location.search);
    const Route = findRoute(routes, url);

    useEffect(() => {
        let prevUrl = window.location.href;
        let prevSearch = window.location.search;
        listenBgMessage('updateUrl', (sender, data) => {
            if (window.location.href !== prevUrl) {
                setUrl(window.location.href);
                prevUrl = window.location.href;
                return true;
            }
            if (window.location.search !== prevSearch) {
                setSearch(window.location.search);
                prevSearch = window.location.search;
                return true;
            }
            return false;
        });
    }, []);

    if (!Route) return null;

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Route.Component {...Route.props} />;
};

export default Router;
