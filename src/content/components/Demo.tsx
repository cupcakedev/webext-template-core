import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import Users from './Users';
import useChromeStorage from '../../hooks/useChromeStorage';
import { getBgCaller } from '../../rpc/bg';
import { IUser } from '../../interfaces';
import createChromeStorageStateHook from 'src/storage/createChromeStorageStateHook';
import 'src/storage/storage.test';
import Modal from './Modal';

const getTabID = getBgCaller('getTabID');
const getUsers = getBgCaller('getUsers');
const getToken = getBgCaller('getToken');

const useTokensUpdating = createChromeStorageStateHook('tokensUpdating', true);

const Demo: React.FC<{ variant?: string }> = ({ variant }) => {
    const [counter, setCounter] = useChromeStorage('counter', 0);

    const [JWSToken, setJWSToken, _, error] = useChromeStorage('JWSToken');

    const [tokensUpdating, setTokensUpdating] = useTokensUpdating();

    const [tabID, setTabID] = useState<number | undefined>();

    const [users, setUsers] = useState<IUser[] | undefined>(undefined);

    useEffect(() => {
        getUsers({ sort: 'ASC' }).then((users) => setUsers(users));
    }, []);

    useEffect(() => {
        console.log('React effect: tokensUpdating', tokensUpdating);
    }, [tokensUpdating]);

    const getTabIDHandler = async () => {
        const id = await getTabID();
        const token = await getToken();
        setTabID(id);
        setTabID(id);
    };

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        console.log('show modal', showModal);
    }, [showModal]);

    const onAccept = () => {
        setShowModal(false);
    };

    const onClose = () => {
        setShowModal(false);
    };

    return (
        <Root>
            <div>
                <div
                    style={{
                        display: 'flex',
                        gap: '11px',
                        height: '25px',
                        alignItems: 'center',
                    }}
                >
                    <button onClick={() => setShowModal((prev) => !prev)}>
                        Открыть модальное окно
                    </button>
                    {showModal && (
                        <Modal onClose={onClose} onAccept={onAccept} />
                    )}
                </div>
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
                    <p>Счетчик: {counter}</p>
                    <button
                        onClick={() => {
                            setCounter((prev) => prev + 1);
                        }}
                    >
                        Increment
                    </button>
                    <button
                        onClick={() => {
                            setCounter((prev) => 0);
                        }}
                    >
                        Clear
                    </button>
                    <button
                        onClick={() => {
                            setCounter((prev) => prev - 1);
                        }}
                    >
                        Decrement
                    </button>
                </div>
            </div>
            <Users users={users} />
        </Root>
    );
};

const Root = styled.div`
    color: black;
    border: 1px solid black;
    background: rgb(221, 221, 221);
    font-size: 14px;
    font-family: 'sans-serif';
    padding: 24px;
`;

export default Demo;
