import {ResultCode} from "../models/common/common";

export type Result<T=null>={
    code:ResultCode
    errorMessage?:string
    data?:T
}