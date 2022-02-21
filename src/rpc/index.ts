import {IRpc} from "../interfaces";
import {QueryFunctionContext} from "react-query";

export const execute = <T extends { Params: any, Response: any }>(method: keyof IRpc, params: T['Params']) => {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
            type: "command",
            method,
            params: JSON.stringify(params)
        }, (response) => resolve(response));
    })
}

export function factory<T extends  { Params?: any, Response: any} >
(method: keyof IRpc): (params?: QueryFunctionContext<(string | T['Params'])[], any> | T['Params'] ) => Promise<T['Response']>{
    return (params?) => execute(method, params)
}