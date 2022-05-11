/* eslint-disable react/button-has-type */
import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { IUser } from '../../interfaces';
import { factory } from '../../common/react-query/factory';

const addUser = factory('addUser');
const updateUser = factory('updateUser');
const deleteUser = factory('deleteUser');

const User: React.FC<{
    user: IUser;
    changeHandler: () => void;
    deleteHandler: () => void;
    saveHandler: (login: string, name: string) => void;
    cancelHandler: () => void;
    edit: boolean;
}> = ({
    user,
    changeHandler,
    deleteHandler,
    saveHandler,
    cancelHandler,
    edit,
}) => {
    const [login, setLogin] = useState<string>(user.login);
    const [name, setName] = useState<string>(user.name);

    return (
        <tr>
            <td>{user.id}</td>
            {!edit && (
                <>
                    <td>{user.login}</td>
                    <td>{user.name}</td>
                </>
            )}
            {edit && (
                <>
                    <td>
                        <input
                            value={login}
                            placeholder="login"
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                setLogin(e.target.value);
                            }}
                        />
                    </td>
                    <td>
                        <input
                            value={name}
                            placeholder="name"
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => setName(e.target.value)}
                        />
                    </td>
                </>
            )}
            {!edit && (
                <td>
                    <button onClick={changeHandler}>Change</button>
                </td>
            )}
            {edit && (
                <td>
                    <button
                        onClick={() => {
                            setLogin(user.login);
                            setName(user.name);
                            cancelHandler();
                        }}
                    >
                        Cancel
                    </button>
                    <button onClick={() => saveHandler(login, name)}>
                        Save
                    </button>
                </td>
            )}
            <td>
                <button onClick={deleteHandler}>Delete</button>
            </td>
        </tr>
    );
};

const Users: React.FC<{ users: Array<IUser> | undefined }> = (props) => {
    const [isEdit, setIsEdit] = useState(false);
    const [newLogin, setNewLogin] = useState<string>('');
    const [newName, setNewName] = useState<string>('');
    const [row, setRow] = useState<number>();

    const queryClient = useQueryClient();

    const mutationDelete = useMutation(deleteUser, {
        onSuccess: () => {
            queryClient.invalidateQueries('usersList');
        },
        onError: () => {
            alert('Удалить не получилось');
        },
    });

    const mutationUpdate = useMutation(updateUser, {
        onSuccess: () => {
            queryClient.invalidateQueries('usersList');
        },
        onError: () => {
            alert('Обновить не получилось');
        },
    });

    const mutationAdd = useMutation(addUser, {
        onSuccess: () => {
            queryClient.invalidateQueries('usersList', {});
        },
        onError: () => {
            console.log('Мутация провалилась');
        },
    });

    const changeHandler = (user: IUser, index: number) => {
        setIsEdit(!isEdit);
        setRow(index);
    };

    return (
        <table>
            <tbody>
                <tr>
                    <th>ID</th>
                    <th>Login</th>
                    <th>Name</th>
                    <th>Update</th>
                    <th>Delete</th>
                </tr>
                {props.users &&
                    props.users.map((user: IUser, i: number) => (
                        <User
                            key={user.id}
                            edit={isEdit && row === i}
                            user={user}
                            changeHandler={() => changeHandler(user, i)}
                            deleteHandler={() => mutationDelete.mutate(user.id)}
                            saveHandler={(login, name) => {
                                console.log('handle save', login, name);
                                setIsEdit(!isEdit);
                                mutationUpdate.mutate({
                                    id: user.id,
                                    login,
                                    name,
                                });
                            }}
                            cancelHandler={() => setIsEdit(!isEdit)}
                        />
                    ))}
                <tr>
                    <td>#</td>
                    <td>
                        <input
                            value={newLogin}
                            placeholder="login"
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                setNewLogin(e.target.value);
                            }}
                        />
                    </td>
                    <td>
                        <input
                            value={newName}
                            placeholder="name"
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => setNewName(e.target.value)}
                        />
                    </td>
                    <td />
                    <td>
                        <button
                            style={{ width: '100%' }}
                            onClick={() => {
                                mutationAdd.mutate({
                                    login: newLogin,
                                    name: newName,
                                });
                                setNewLogin('');
                                setNewName('');
                            }}
                        >
                            Add
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default Users;
