import axiosOriginal from 'axios'
// @ts-ignore
import adapter from 'axios/lib/adapters/xhr'
import {IRpc, IServices} from "../interfaces";

const axios = axiosOriginal.create({adapter})

const URL_JSON_SERVER = 'http://localhost:3004'

export const Services: IServices<IRpc> = {
    getToken: (_, args) => {
        return axios(`${URL_JSON_SERVER}/tokens/${args}`);
    },

    getTabID: (sender) => {
        console.log(sender)
        return sender.tab.id
    },

    getExtensionID: (sender) => {
        return sender.id
    },

    getUsers: async () => {
        try {
            return await (await fetch(`${URL_JSON_SERVER}/users/`, {method: 'GET'})).json();
        } catch (e) {
            return e;
        }
    },

    addUser: async (_, user) => {
        try {
            return await (
                await fetch(
                    `${URL_JSON_SERVER}/users/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8'
                        },
                        body: JSON.stringify(user)
                    })
            ).json();
        } catch (e) {
            return e;
        }
    },

    deleteUser: async (_, id) => {
        try {
            return await (
                await fetch(
                    `${URL_JSON_SERVER}/users/${id}`, {
                        method: 'DELETE'
                    })
            ).json();
        } catch (e) {
            return e;
        }
    },

    updateUser: async (_, user) => {
        try {
            return await (
                await fetch(
                    `${URL_JSON_SERVER}/users/${user.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8'
                        },
                        body: JSON.stringify(user)
                    })
            ).json();
        } catch (e) {
            return e;
        }
    }
}

