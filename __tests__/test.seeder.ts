import {UsersTypeDb} from "../src/models/users/db/usersDBModel";
import {randomUUID} from "crypto";
import {add} from "date-fns/add";
import {userModel} from "../src/db/db";

export type RegisterUserType = {
    login?:string,
    password?:string,
    email?:string,
    code?:string,
    expirationDate?:Date,
    isConfirmed?:boolean
}
export const testSeeder = {
    createUserDto() {
        return {
            login: "test",
            password: "1234567788",
            email: "test@mail.com"
        }
    },
    
    createUserDtos(count: number) {
        const users = []

        for (let i = 0; i <= count; i++) {
            users.push({
                login: `test ${i}`,
                email: `test${i}@mail.com`,
                password: "1234567788"
            })
        }
        return users
    },

    async registerUser({
                           login='test2',
                           password='1234567',
                           email='test2@mail.ru',
                           code,
                           expirationDate,
                           isConfirmed
                       }:RegisterUserType) {
        const newUser:UsersTypeDb = {
            accountData:{
                login,
                email,
                _passwordHash:password,
                createdAt:new Date()
            },
            emailConfirmation: {
                confirmationCode: code ?? randomUUID(),
                expirationDate: expirationDate ?? add(new Date(),{minutes: 30}),
                isConfirmed: isConfirmed ?? false
            },
            tokensBlackList: []
        }
        const res = await userModel.insertMany({...newUser})
        return {
            id:res[0]._id.toString(),
            ...newUser
        }
    }
}