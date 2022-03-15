import axiosOriginal from 'axios';
// @ts-ignore
import adapter from 'axios/lib/adapters/xhr';
import { IRpc } from '../interfaces';

const axios = axiosOriginal.create({ adapter });

const URL_JSON_SERVER = 'http://localhost:3004';

export type IServices<T> = {
    [name in keyof IRpc]: <T extends { Params?: any; Response: any }>(
        sender: any,
        args: IRpc[name]['Params']
    ) => Promise<T['Response']>;
};

export const Services: IServices<IRpc> = {
    getToken: (_, args) => axios(`${URL_JSON_SERVER}/tokens/${args}`),

    getTabID: (sender) => sender.tab.id,

    getExtensionID: (sender) => sender.id,

    getUsers: async () => {
        try {
            return await (
                await fetch(`${URL_JSON_SERVER}/users/`, { method: 'GET' })
            ).json();
        } catch (e) {
            return e;
        }
    },

    addUser: async (_, user) => {
        try {
            return await (
                await fetch(`${URL_JSON_SERVER}/users/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                    },
                    body: JSON.stringify(user),
                })
            ).json();
        } catch (e) {
            return e;
        }
    },

    deleteUser: async (_, id) => {
        try {
            return await (
                await fetch(`${URL_JSON_SERVER}/users/${id}`, {
                    method: 'DELETE',
                })
            ).json();
        } catch (e) {
            return e;
        }
    },

    updateUser: async (_, user) => {
        try {
            return await (
                await fetch(`${URL_JSON_SERVER}/users/${user.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                    },
                    body: JSON.stringify(user),
                })
            ).json();
        } catch (e) {
            return e;
        }
    },
};
