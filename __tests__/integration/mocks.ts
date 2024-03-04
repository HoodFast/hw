import {emailAdapter} from "../../src/adapters/email.adapter";

export const emailServiceMock: typeof emailAdapter = {
    async sendEmail(email:string, subject:string, message:string):Promise<boolean>{
        return true
    }
}