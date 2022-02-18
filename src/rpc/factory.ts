import {IRpc} from "../interfaces";
import {execute} from "./index";
import {QueryFunctionContext} from "react-query";

export function factory<T extends  { Params?: any, Response: any} >
(method: keyof IRpc): (params?: QueryFunctionContext<(string | T['Params'])[], any> | T['Params'] ) => Promise<T['Response']>{
    return (params?) => execute(method, params)
}