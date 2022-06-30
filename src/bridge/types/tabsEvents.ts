import { Promisable } from 'src/types/utils';

export interface ITabsServiceModel {
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
    [Key in keyof ITabsServiceModel]: Partial<
        ITabsServiceModel[Key]['Params']
    > extends ITabsServiceModel[Key]['Params']
        ? (
              sender: chrome.runtime.MessageSender,
              args?: ITabsServiceModel[Key]['Params']
          ) => Promise<ITabsServiceModel[Key]['Response']>
        : (
              sender: chrome.runtime.MessageSender,
              args: ITabsServiceModel[Key]['Params']
          ) => Promise<ITabsServiceModel[Key]['Response']>;
};

export interface ITabRequest<
    Key extends keyof ITabsServiceModel = keyof ITabsServiceModel
> {
    key: 'tabs_command';
    type: Key;
    params: ITabsServiceModel[Key]['Params'];
}

export type TabMessageSender = <T extends keyof ITabsServiceModel>(
    ...args: Partial<
        ITabsServiceModel[T]['Params']
    > extends ITabsServiceModel[T]['Params']
        ? [tabId: number, method: T, params?: ITabsServiceModel[T]['Params']]
        : [tabId: number, method: T, params: ITabsServiceModel[T]['Params']]
) => Promise<ITabsServiceModel[T]['Response']>;

export type TabMessageSenderCreator = <T extends keyof ITabsServiceModel>(
    method: T
) => (
    ...args: Partial<
        ITabsServiceModel[T]['Params']
    > extends ITabsServiceModel[T]['Params']
        ? [tabId: number, params?: ITabsServiceModel[T]['Params']]
        : [tabId: number, params: ITabsServiceModel[T]['Params']]
) => Promisable<ITabsServiceModel[T]['Response']>;

export type TabMessageListener = <Key extends keyof ITabsServiceModel>(
    type: Key,
    callback: (
        sender: chrome.runtime.MessageSender,
        data: ITabsServiceModel[Key]['Params']
    ) => Promisable<ITabsServiceModel[Key]['Response']>
) => void;
