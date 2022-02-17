import React, {useState} from "react";
import {useChromeStorageLocal} from "../../storage";
import {Injection} from "./Injection";
import {EXTENSION_PREFIX} from "../../config";
import {getCurrentTabId} from "../../common/utils";
import {execute} from "../../rpc";
import {useQuery} from "../../query/UseBaseQuery";
import {useMutation} from "../../query/useMutation";
import {useQueryClient} from "../../query/Provider";
import axios from "axios";

const Demo: React.FC<{ variant?: string }> = ({variant}) => {

    const queryClient = useQueryClient()

    const [tabID, setTabID] = useState('')
    const key = 'counter';
    const [value, setValue, isPersistent, errorMessage] = useChromeStorageLocal(key, 0);

    const getUsers = async (_keys: any) => {
        const [_key, page, status ] = _keys
        // console.log("Обновление users началось")
        // try {
        //     const data = await axios(`http://localhost:3004/users/`, {method: 'GET'});
        //     console.log(data)
        //     return data.data
        // } catch (e) {
        //     return e;
        // }
        return execute({method: 'getUsers', params:{page, status }})
    }

    const addUser = () => {
        const params = {name:"Костя",login:"Kostya"}
        return execute({method: 'addUser', params})
    }

    const updateUser = () => {
        const params = {id: 6, name:"Игорь", login:"Igor"}
        return execute({method: 'updateUser', params})
    }

    const [data, isLoading, error] = useQuery(['usersList', { page: 1}], getUsers, {option: 'paramOption'})
    //
    // console.log(`isLoading: ${isLoading}`)
    // console.log(`error: ${error}`)
    // console.log(`data: ${JSON.stringify(data)}`)

    const mutation = useMutation(addUser, {
        onSuccess: (data: any) => {
            queryClient.invalidateQueries('usersList', {})
        },
        onError: () => {
            console.log("Мутация провалилась")
        },
    })

    const mutationUpdate = useMutation(updateUser, {
        onSuccess: (data: any) => {
            queryClient.invalidateQueries('usersList', {})
        },
        onError: () => {
            console.log("Мутация провалилась")
        },
    })

    const selectTargetEl = () => document.querySelector('#inject');

    const getTabIDHandler = async () => {
        const id = await getCurrentTabId()
        // @ts-ignore
        setTabID(id)
    }

    return (
        <Injection selectTargetElement={selectTargetEl}
                   position="afterbegin"
                   containerClassName={`${EXTENSION_PREFIX}__container`}
        >
            <div style={{...styles.box, top: top}}>
                <p>TabID: {tabID || 'Неизвестно'}</p>
                <p>Счетчик: {value}</p>
                <div>
                    {
                        data && data.map((user: any, key: number) => {
                            return <p key={key}>{user.name}</p>
                        })
                    }
                </div>

                <button onClick={() => mutation.mutate()}>Add</button>
                <button onClick={() => mutationUpdate.mutate()}>Update</button>
                <button onClick={getTabIDHandler}>Запросить tabID</button>
                <button
                    onClick={() => {
                        setValue((prev: number) => (prev + 1));
                    }}
                >Инкремент
                </button>
                <button
                    onClick={() => {
                        setValue((prev: number) => (0));
                    }}
                >Очистить
                </button>
                <button
                    onClick={() => {
                        setValue((prev: number) => (prev - 1));
                    }}
                >Декремент
                </button>
            </div>
        </Injection>
    )
}

export default Demo

const styles: any = {
    box: {
        color: "black",
        width: "145px",
        border: "1px solid black",
        background: "rgb(221, 221, 221)",
        fontSize: "22px",
        padding: "24px"
    }
}