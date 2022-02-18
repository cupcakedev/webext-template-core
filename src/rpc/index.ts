import {IRpc} from "../interfaces";

export const execute = <T extends { Params: any, Response: any }>(method: keyof IRpc, params: T['Params']) => {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
            type: "command",
            method,
            params: JSON.stringify(params)
        }, (response) => resolve(response));
    })
}
