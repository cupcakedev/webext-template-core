import React, { useState } from 'react';

import { useQuery, useQueryClient } from 'react-query';
import Users from './Users';
import useChromeStorage from '../../hooks/useChromeStorage';
import { factory } from '../../common/react-query/factory';

const getTabID = factory('getTabID');
const getUsers = factory('getUsers');
const getToken = factory('getToken');

const Demo: React.FC<{ variant?: string }> = ({ variant }) => {
    const [value, setValue, _, errorMessage] = useChromeStorage('counter', 0);
    const queryClient = useQueryClient();

    const [tabID, setTabID] = useState<number>(0);
    const { data, isLoading, error } = useQuery('usersList', () =>
        getUsers({ sort: 'ASC' })
    );

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
            <Users users={data} />
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
