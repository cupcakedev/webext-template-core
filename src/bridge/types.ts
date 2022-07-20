import { Promisable } from 'src/types/utils';

export type ServicesModelType = Record<
    string,
    {
        Params: any;
        Response: any;
    }
>;

export type IServices<Model extends ServicesModelType> = {
    [Key in keyof Model]: Partial<
        Model[Key]['Params']
    > extends Model[Key]['Params']
        ? (
              sender: chrome.runtime.MessageSender,
              args?: Model[Key]['Params']
          ) => Promisable<Model[Key]['Response']>
        : (
              sender: chrome.runtime.MessageSender,
              args: Model[Key]['Params']
          ) => Promisable<Model[Key]['Response']>;
};

export type TMessageSender<M extends ServicesModelType> = <
    T extends string & keyof M
>(
    ...args: Partial<M[T]['Params']> extends M[T]['Params']
        ? [method: T, params?: M[T]['Params']]
        : [method: T, params: M[T]['Params']]
) => Promise<M[T]['Response']>;

export type TMessageSenderCreator<M extends ServicesModelType> = <
    T extends string & keyof M
>(
    method: T
) => (
    ...args: Partial<M[T]['Params']> extends M[T]['Params']
        ? [params?: M[T]['Params']]
        : [params: M[T]['Params']]
) => Promise<M[T]['Response']>;

export type TMessageListener<M extends ServicesModelType> = <
    Key extends string & keyof M
>(
    type: Key,
    callback: (
        sender: chrome.runtime.MessageSender,
        data: M[Key]['Params']
    ) => Promisable<M[Key]['Response']>
) => void;

export type IRequest<
    Type extends string,
    M extends ServicesModelType = ServicesModelType,
    Key extends string & keyof M = keyof ServicesModelType
> = {
    type: Type;
    method: Key;
    params: M[Key]['Params'];
};
