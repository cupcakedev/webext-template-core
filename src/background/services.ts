import { getCurrentTab } from '@common/utils';
import { IBgServices } from '../bridge/types/bgEvents';

const URL_JSON_SERVER = 'http://localhost:3004';

export const Services: IBgServices = {
    getToken: async (_, args) => {
        try {
            return await (
                await fetch(`${URL_JSON_SERVER}/tokens/${args}`)
            ).json();
        } catch (e) {
            return undefined;
        }
    },

    getTabID: async (sender) => sender.tab?.id ?? (await getCurrentTab())?.id,

    getExtensionID: (sender) => sender.id,

    getUsers: async (_, args) => {
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
