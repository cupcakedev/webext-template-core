import axiosOriginal from 'axios'
// @ts-ignore
import adapter from 'axios/lib/adapters/xhr'

const axios = axiosOriginal.create({adapter})
import {ITokenArgs} from "../interfaces";

const ID = 1;
const URL_JSON_SERVER = 'http://localhost:3004'

export const Services = {
    getToken: async (sender: any, args?: any) => {
        return axios(`${URL_JSON_SERVER}/tokens/${ID}`);
    },

    getTabID: async (sender: any, args?: any) => {
        return sender.tab.id
    },

    getExtensionID: async (sender: any, args?: any) => {
        return sender.id
    },

    getUsers: async () => {
        try {
            return await (await fetch(`${URL_JSON_SERVER}/users/`, {method: 'GET'})).json();
        } catch (e) {
            return e;
        }
    },

    addUser: async (sender: any, args?: any) => {
        try {
            return await (
                await fetch(
                    `${URL_JSON_SERVER}/users/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8'
                        },
                        body: JSON.stringify(args)
                    })
            ).json();
        } catch (e) {
            return e;
        }
    },

    deleteUser: async (sender: any, args?: any) => {
        try {
            return await (
                await fetch(
                    `${URL_JSON_SERVER}/users/${args.id}`, {
                        method: 'DELETE'
                    })
            ).json();
        } catch (e) {
            return e;
        }
    },

    updateUser: async (sender: any, args?: any) => {
        try {
            return await (
                await fetch(
                    `${URL_JSON_SERVER}/users/${args.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8'
                        },
                        body: JSON.stringify(args)
                    })
            ).json();
        } catch (e) {
            return e;
        }
    }
}

