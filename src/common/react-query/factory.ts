import { QueryFunctionContext } from 'react-query';
import { execute, IRpc } from 'src/rpc';

type QueryParams<T extends keyof IRpc> =
    | IRpc[T]['Params']
    | QueryFunctionContext;

export function factory<T extends keyof IRpc>(
    method: T
): (params?: QueryParams<T>) => Promise<IRpc[T]['Response']> {
    return (params?) => execute(method, params as any);
}
