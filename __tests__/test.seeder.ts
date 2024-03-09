import {UsersTypeDb} from "../src/models/users/db/usersDBModel";
import {randomUUID} from "crypto";
import {add} from "date-fns/add";
import {usersCollection} from "../src/db/db";

export type RegisterUserType = {
    login:string,
    password:string,
    email:string,
    code?:string,
    expirationDate?:Date,
    isConfirmed?:boolean
}
export const testSeeder = {
    createUserDto() {
        return {
            login: "test",
            email: "test@mail.com",
            password: "1234567788"
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
                           login,
                           password,
                           email,
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
        const res = await usersCollection.insertOne({...newUser})
        return {
            id:res.insertedId.toString(),
            ...newUser
        }
    }
}