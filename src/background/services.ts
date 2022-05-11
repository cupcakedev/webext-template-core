import axiosOriginal from 'axios';
// @ts-ignore
import adapter from 'axios/lib/adapters/xhr';
import { IRpc } from '../rpc';

const axios = axiosOriginal.create({ adapter });

const URL_JSON_SERVER = 'http://localhost:3004';

export type IServices = {
    [name in keyof IRpc]: (
        sender: any,
        args: IRpc[name]['Params']
    ) => Promise<IRpc[name]['Response']>;
};

export const Services: IServices = {
    getToken: async (_, args) => {
        try {
            const res = await axios(`${URL_JSON_SERVER}/tokens/${args}`);
            return res.data;
        } catch (e) {
            return undefined;
        }
    },

    getTabID: (sender) => sender.tab.id,

    getExtensionID: (sender) => sender.id,

    getUsers: async (_, { sort }) => {
        try {
            return await (
                await fetch(`${URL_JSON_SERVER}/users/`, { method: 'GET' })
            ).json();
        } catch (e) {
            return undefined;
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
            return undefined;
        }
    },

    deleteUser: async (_, { id }) => {
        try {
            return await (
                await fetch(`${URL_JSON_SERVER}/users/${id}`, {
                    method: 'DELETE',
                })
            ).json();
        } catch (e) {
            return undefined;
        }
    },

    updateUser: async (_, { user }) => {
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
            return undefined;
        }
    },
};
