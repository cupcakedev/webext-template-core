import {ICommand} from "../interfaces";

export const execute = ({method, params}:ICommand) => {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
            type: "command",
            method,
            params: JSON.stringify(params)
        }, (response) => resolve(response));
    })
}
