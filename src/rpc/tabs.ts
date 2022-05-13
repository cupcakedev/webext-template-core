import { Promisable } from 'src/interfaces/utils';

export interface ITabsMessenger {
    updateUrl: {
        Params: undefined;
        Response: boolean;
    };
    getStatus: {
        Params: undefined;
        Response: 'ok' | 'loading' | 'error';
    };
}

export type ITabServices = {
    [Key in keyof ITabsMessenger]: Partial<
        ITabsMessenger[Key]['Params']
    > extends ITabsMessenger[Key]['Params']
        ? (
              sender: chrome.runtime.MessageSender,
              args?: ITabsMessenger[Key]['Params']
          ) => Promise<ITabsMessenger[Key]['Response']>
        : (
              sender: chrome.runtime.MessageSender,
              args: ITabsMessenger[Key]['Params']
          ) => Promise<ITabsMessenger[Key]['Response']>;
};

export interface ITabRequest<
    Key extends keyof ITabsMessenger = keyof ITabsMessenger
> {
    key: 'tabs_command';
    type: Key;
    params: ITabsMessenger[Key]['Params'];
}

type TabCaller = <T extends keyof ITabsMessenger>(
    ...args: Partial<
        ITabsMessenger[T]['Params']
    > extends ITabsMessenger[T]['Params']
        ? [tabId: number, method: T, params?: ITabsMessenger[T]['Params']]
        : [tabId: number, method: T, params: ITabsMessenger[T]['Params']]
) => Promise<ITabsMessenger[T]['Response']>;

export const callTab: TabCaller = (...args) =>
    new Promise((resolve) => {
        const request: ITabRequest = {
            key: 'tabs_command',
            type: args[1],
            params: args[2],
        };
        chrome.tabs.sendMessage(args[0], request, (response) =>
            resolve(response)
        );
    });

type TabCallerFactory = <T extends keyof ITabsMessenger>(
    method: T
) => (
    ...args: Partial<
        ITabsMessenger[T]['Params']
    > extends ITabsMessenger[T]['Params']
        ? [tabId: number, params?: ITabsMessenger[T]['Params']]
        : [tabId: number, params: ITabsMessenger[T]['Params']]
) => Promisable<ITabsMessenger[T]['Response']>;

export const getTabCaller: TabCallerFactory =
    (method) =>
    (...args) =>
        callTab(args[0], method, args[1]);

type TabListener = <Key extends keyof ITabsMessenger>(
    type: Key,
    callback: (
        sender: chrome.runtime.MessageSender,
        data: ITabsMessenger[Key]['Params']
    ) => Promisable<ITabsMessenger[Key]['Response']>
) => void;

export const listenBgMessage: TabListener = (type, callback) => {
    chrome.runtime.onMessage.addListener(
        async (request: ITabRequest, sender, sendResponse) => {
            if (request.type === type) {
                console.log('receive from bg', request);
                const response = await callback(sender, request.params);
                console.log('send response', type, response);
                sendResponse(response);
            }
            return true;
        }
    );
};
