import { IRpc } from '../interfaces';
import { QueryFunctionContext } from 'react-query';

export type Request = {
    type: 'command';
    method: string;
    params: string;
};

export const execute = <T extends keyof IRpc>(
    method: T,
    params?: IRpc[T]['Params'] | QueryFunctionContext
) =>
    new Promise((resolve) => {
        const request: Request = {
            type: 'command',
            method,
            params: JSON.stringify(params),
        };
        chrome.runtime.sendMessage(request, (response) => resolve(response));
    });

export function factory<T extends keyof IRpc>(
    method: T
): (
    params?: IRpc[T]['Params'] | QueryFunctionContext
) => Promise<IRpc[T]['Response']> {
    return (params?) => execute(method, params);
}
