import {ResultCode} from "../models/common/common";

export type Result<T=null>={
    code:ResultCode
    errorMessage?:errorMessageType
    data?:T
}

export type errorMessageType = {
    message:string,
    field:string
}