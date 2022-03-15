import React, { useState } from 'react';

import { Injection } from './Injection';
import { useQuery } from 'react-query';
import { useQueryClient } from 'react-query';
import { IRpc } from '../../interfaces';
import { factory } from '../../rpc/';
import Users from './Users';
import useChromeStorage from '../../hooks/useChromeStorage';

const Demo: React.FC<{ variant?: string }> = ({ variant }) => {
    const selectTargetEl = () =>
        document.querySelector('#injection > shadow-view');
    const containerClassName = 'test__container';

    const [value, setValue, _, errorMessage] = useChromeStorage('counter', 0);
    const queryClient = useQueryClient();

    const [tabID, setTabID] = useState<number>(0);

    const getTabID = factory<IRpc['getTabID']>('getTabID');

    const getUsers = factory<IRpc['getUsers']>('getUsers');
    const getToken = factory<IRpc['getToken']>('getToken');

    const { data, isLoading, error } = useQuery(
        ['usersList', { sort: '1' }],
        getUsers
    );

    const getTabIDHandler = async () => {
        const id = await getTabID();
        const token = await getToken();
        setTabID(id);
        setTabID(id);
    };

    return (
        <Injection
            selectTargetElement={selectTargetEl}
            position="afterbegin"
            containerClassName={containerClassName}
        >
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
                        <button onClick={getTabIDHandler}>
                            Запросить tabID
                        </button>
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
        </Injection>
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
        position: 'absolute',
        top: '25px',
        left: '25px',
    },
};
