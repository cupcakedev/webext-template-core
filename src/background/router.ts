import {ITokenArgs} from "../interfaces";

export const Router = {
    getToken: async (sender: any, args?: any) => {
        return 'Все получилось';
    },

    getTabID: async (sender: any, args?: any) => {
        return sender.tab.id
    },

    getExtensionID: async (sender: any, args?: any) => {
        return sender.id
    }
}