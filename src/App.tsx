import React, {useEffect, useState} from 'react'
import {execute} from './rpc'
import {listenToMessage, findRoute} from "./common/utils";
import {EXTENSION_PREFIX} from "./config";
import {routes} from "./content/routes";

interface IExample {
    /** Текст внутри кнопки */
    name: string,
    top: string
}

const App = () => {
    const [pathname, setPathname] = useState<string>(window.location.pathname)
    const [search, setSearch] = useState<string>(window.location.search)
    const Route = findRoute(routes, pathname)

    useEffect(()=>{
        let prevPathname = window.location.pathname
        let prevSearch = window.location.search;
        listenToMessage(`${EXTENSION_PREFIX}__change_url`, (sender, sendResponse) => {
            if(window.location.pathname !== prevPathname) {
                setPathname(window.location.pathname)
                prevPathname = window.location.pathname
            }
            if(window.location.search !== prevSearch){
                setSearch(window.location.search)
                prevSearch = window.location.search
            }
        })
    },[])

    if(!Route) return null;
    // @ts-ignore
    return <Route.Component {...Route.props} />
}

export default App;