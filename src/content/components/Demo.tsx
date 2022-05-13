import React, { useEffect, useState } from 'react';

import Users from './Users';
import useChromeStorage from '../../hooks/useChromeStorage';
import { getBgCaller } from '../../rpc/bg';
import { IUser } from '../../interfaces';

const getTabID = getBgCaller('getTabID');
const getUsers = getBgCaller('getUsers');
const getToken = getBgCaller('getToken');

const Demo: React.FC<{ variant?: string }> = ({ variant }) => {
    const [value, setValue, _, errorMessage] = useChromeStorage('counter', {
        initialValue: 0,
    });

    const [token, setToken, _, errorMessage] = useChromeStorage('JWSToken', {
        storageArea: 'sync',
        emptyValue: null,
    });

    const [tabID, setTabID] = useState<number | undefined>();

    const [users, setUsers] = useState<IUser[] | undefined>(undefined);

    useEffect(() => {
        getUsers({ sort: 'ASC' }).then((users) => setUsers(users));
    }, []);

    const getTabIDHandler = async () => {
        const id = await getTabID();
        const token = await getToken();
        setTabID(id);
        setTabID(id);
    };

    return (
        <div style={styles.box}>
            <div>
                <div
                    style={{
                        display: 'flex',
                        gap: '11px',
                        height: '25px',
                        alignItems: 'center',
                    }}
                >
                    <p>TabID: {tabID}</p>
                    <button onClick={getTabIDHandler}>Запросить tabID</button>
                </div>
                <div
                    style={{
                        display: 'flex',
                        gap: '11px',
                        height: '25px',
                        alignItems: 'center',
                    }}
                >
                    <p>Счетчик: {value}</p>
                    <button
                        onClick={() => {
                            setValue((prev: number) => prev + 1);
                        }}
                    >
                        Increment
                    </button>
                    <button
                        onClick={() => {
                            setValue((prev: number) => 0);
                        }}
                    >
                        Clear
                    </button>
                    <button
                        onClick={() => {
                            setValue((prev: number) => prev - 1);
                        }}
                    >
                        Decrement
                    </button>
                </div>
            </div>
            <Users users={users} />
        </div>
    );
};

export default Demo;

const styles: any = {
    box: {
        color: 'black',
        border: '1px solid black',
        background: 'rgb(221, 221, 221)',
        fontSize: '14px',
        padding: '24px',
    },
};
