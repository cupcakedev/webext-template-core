import React, { useState } from 'react';
import { factory } from '../../rpc';
import { IUser } from '../../interfaces';
import { useMutation, useQueryClient } from 'react-query';

const Users: React.FC<{ users: Array<IUser> | undefined }> = (props) => {
    const [isEdit, setIsEdit] = useState(false);
    const [login, setLogin] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [newLogin, setNewLogin] = useState<string>('');
    const [newName, setNewName] = useState<string>('');
    const [row, setRow] = useState<number>();

    const queryClient = useQueryClient();

    const addUser = factory('addUser');
    const updateUser = factory('updateUser');
    const deleteUser = factory('deleteUser');

    const mutationDelete = useMutation(deleteUser, {
        onSuccess: (data: any) => {
            queryClient.invalidateQueries('usersList');
        },
        onError: () => {
            alert('Удалить не получилось');
        },
    });

    const mutationUpdate = useMutation(updateUser, {
        onSuccess: (data: any) => {
            queryClient.invalidateQueries('usersList');
        },
        onError: () => {
            alert('Обновить не получилось');
        },
    });

    const mutationAdd = useMutation(addUser, {
        onSuccess: (data: any) => {
            queryClient.invalidateQueries('usersList', {});
        },
        onError: () => {
            console.log('Мутация провалилась');
        },
    });

    const changeHandler = (user: IUser, index: number) => {
        setLogin(user.login);
        setName(user.name);
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
                        <tr key={user.id}>
                            {isEdit && row === i ? (
                                <>
                                    <td>{user.id}</td>
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
                                    <td>
                                        <button
                                            onClick={() => setIsEdit(!isEdit)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEdit(!isEdit);
                                                mutationUpdate.mutate({
                                                    id: user.id,
                                                    login,
                                                    name,
                                                });
                                            }}
                                        >
                                            Save
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() =>
                                                mutationDelete.mutate(user.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{user.id}</td>
                                    <td>{user.login}</td>
                                    <td>{user.name}</td>
                                    <td>
                                        <button
                                            onClick={() =>
                                                changeHandler(user, i)
                                            }
                                        >
                                            Change
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() =>
                                                mutationDelete.mutate(user.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </>
                            )}
                        </tr>
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
