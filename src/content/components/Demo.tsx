/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import Users from './Users';
import { IUser } from '../../interfaces';
import useChromeStorage from '../../hooks/useChromeStorage';
import { LocalStorageKeys, SyncStorageKeys } from 'src/storage/config';
import 'src/storage/storage.test';
import Modal from './Modal';
import { createBgMessageSender } from 'src/bridge/bgEvents';

const getTabID = createBgMessageSender('getTabID');
const getUsers = createBgMessageSender('getUsers');
const getToken = createBgMessageSender('getToken');

const Demo: React.FC<{ variant?: string }> = ({ variant }) => {
    const [counter, setCounter] = useChromeStorage(LocalStorageKeys.counter, 0);

    const [JWSToken, setJWSToken, error] = useChromeStorage(
        SyncStorageKeys.JWSToken
    );

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

    const [showModal, setShowModal] = useState(false);
    const [showSecondModal, setShowSecondModal] = useState(false);
    const [showThirdModal, setShowThirdModal] = useState(false);

    useEffect(() => {
        console.log('show modal', showModal);
    }, [showModal]);

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
                        <Modal
                            onClose={() => setShowModal(false)}
                            onAccept={() => setShowSecondModal(true)}
                        />
                    )}
                    {showSecondModal && (
                        <Modal
                            padding="20px 20px 0 0"
                            onClose={() => setShowSecondModal(false)}
                            onAccept={() => setShowThirdModal(true)}
                        />
                    )}
                    {showThirdModal && (
                        <Modal
                            padding="40px 40px 0 0"
                            onClose={() => setShowThirdModal(false)}
                            onAccept={() => {
                                setShowModal(false);
                                setShowSecondModal(false);
                                setShowThirdModal(false);
                            }}
                        />
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
    padding: 24px;
`;

export default Demo;
