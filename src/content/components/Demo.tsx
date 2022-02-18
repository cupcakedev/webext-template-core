import React, {useState} from "react";

import {Injection} from "./Injection";
import {EXTENSION_PREFIX} from "../../config";
import {QueryFunctionContext, useQuery} from "react-query";
import {useMutation} from "react-query";
import {useQueryClient} from "react-query";
import {IRpc} from "../../interfaces";
import {factory} from "../../rpc/factory";

const Demo: React.FC<{ variant?: string }> = ({variant}) => {

    const [value, setValue] = useState(0)
    const queryClient = useQueryClient()


    const [tabID, setTabID] = useState('')

    const getTabID = factory<IRpc['getTabID']>('getTabID')

    const getUsers = factory<IRpc['getUsers']>('getUsers')
    const getToken = factory<IRpc['getToken']>('getToken')
    const addUser = factory<IRpc['addUser']>('addUser')
    const updateUser = factory<IRpc['updateUser']>('updateUser')
    const deleteUser = factory<IRpc['deleteUser']>('deleteUser')

    const {data, isLoading, error} = useQuery(['usersList', { sort: '1'}], getUsers)

    const mutation = useMutation(addUser, {
        onSuccess: (data: any) => {
            queryClient.invalidateQueries('usersList', {})
        },
        onError: () => {
            console.log("Мутация провалилась")
        },
    })


    const mutationUpdate = useMutation(updateUser , {
        onSuccess: (data: any) => {
            queryClient.invalidateQueries('usersList')
        },
        onError: () => {
            console.log("Мутация провалилась")
        },
    })

    const selectTargetEl = () => document.querySelector('#inject');

    const getTabIDHandler = async () => {
        const id = await getTabID()
        const token = await getToken()
        console.log(token)
        // @ts-ignore
        setTabID(id)
    }

    const users = data as []

    return (
        <Injection selectTargetElement={selectTargetEl}
                   position="afterbegin"
                   containerClassName={`${EXTENSION_PREFIX}__container`}
        >
            <div style={{...styles.box, top: top}}>
                <p>TabID: {tabID || 'Неизвестно'}</p>
                <div>
                    {
                        users && users.map((user: any, key: number) => {
                            return <p key={key}>{user.name}</p>
                        })
                    }
                </div>

                <button onClick={() => mutation.mutate(
                    {
                        name: '342',
                        login: '342'
                    }
                )}>Add</button>
                <button onClick={() => mutationUpdate.mutate({
                    id:'3',
                    name: '342',
                    login: '342'
                })}>Update</button>
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