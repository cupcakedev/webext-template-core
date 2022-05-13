import React, { useEffect, useState } from 'react';
import { listenToMessage, findRoute } from '../common/utils';
import { routes } from './Routes';

const { EXTENSION_NAME_PREFIX } = process.env;

const App = () => {
    const [url, setUrl] = useState<string>(window.location.href);
    const [search, setSearch] = useState<string>(window.location.search);
    const Route = findRoute(routes, url);

    useEffect(() => {
        let prevUrl = window.location.href;
        let prevSearch = window.location.search;
        listenToMessage(
            `${EXTENSION_NAME_PREFIX}__change_url`,
            (sender, sendResponse) => {
                if (window.location.href !== prevUrl) {
                    setUrl(window.location.href);
                    prevUrl = window.location.href;
                }
                if (window.location.search !== prevSearch) {
                    setSearch(window.location.search);
                    prevSearch = window.location.search;
                }
                sendResponse();
            }
        );
    }, []);

    if (!Route) return null;
    // @ts-ignore
    return <Route.Component {...Route.props} />;
};

export default App;
