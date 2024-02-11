
import {OutputUsersType} from "../models/users/output/output.users.models";

export declare global {
    declare namespace Express {
        export interface Request {
            user: OutputUsersType | null
        }
    }
}