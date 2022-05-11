import React, { useEffect, useState } from 'react';

import Users from './Users';
import useChromeStorage from '../../hooks/useChromeStorage';
import { factory } from '../../rpc';
import { IUser } from '../../interfaces';

const getTabID = factory('getTabID');
const getUsers = factory('getUsers');
const getToken = factory('getToken');

const Demo: React.FC<{ variant?: string }> = ({ variant }) => {
    const [value, setValue, _, errorMessage] = useChromeStorage('counter', 0);

    const [tabID, setTabID] = useState<number>(0);

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
                    <p>TabID: {tabID || 'Неизвестно'}</p>
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
