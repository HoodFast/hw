
import {ObjectId} from "mongodb";

export declare global {
    declare namespace Express {
        export interface Request {
            userId: ObjectId | null
        }
    }
}