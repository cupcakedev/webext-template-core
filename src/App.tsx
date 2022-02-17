import React, {useEffect, useState} from 'react'
import {useChromeStorageLocal} from './storage/';
import {execute, useApi} from './rpc'
import {listenToMessage, findRoute} from "./common/utils";
import {EXTENSION_PREFIX} from "./config";
import {routes} from "./content/routes";
import {useQuery} from "./query/UseBaseQuery";
import {useMutation} from "./query/useMutation";

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

const Example: React.FC<IExample> = ({name, top}) => {
    const key = 'samolet';
    //const [value, setValue] = useState(1)
    const [value, setValue, isPersistent, error] = useChromeStorageLocal(key, 0);

    const responseListener = (response: any) => {
        console.log(response)
    }

    //const {data, error, isLoading} = useApi({method: 'getToken', params:{login:'login'}, response:responseListener});

    // console.log(data)
    // console.log(error)
    // console.log(isLoading)

    // if (error) {
    //     return <p>{`An error has occurred: ${error}`}</p>
    // }



    const clickHandler = () => {
        execute({method: 'getToken', params:{login:'login'}, response:responseListener})
            .then(data => {
                console.log('data: ' + data)
                // console.log(error)
                // console.log(isLoading)
            })
        //const {data, error, isLoading} =

    }

    return (
        <div style={{...styles.box, top: top}}>
            <p>Счетчик: {value}</p>
            <button
                onClick={() => {
                    clickHandler();
                }}
            >Выполнить команду</button>
            <button
                onClick={() => {
                    setValue((prev: number) => (prev + 1));
                }}
            >Инкремент</button>
            <button
                onClick={() => {
                    setValue((prev: number) => (0));
                }}
            >Очистить</button>
            <button
                onClick={() => {
                    setValue((prev: number) => (prev - 1));
                }}
            >Декремент</button>
        </div>
    )
}

const styles: any = {
    box: {
        height: "150px",
        position: "absolute",
        width: "100px",
        border: "1px solid black",
        background: "#ddd",
        top: "129px",
        left: "10px",
    }
}