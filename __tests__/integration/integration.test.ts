import {MongoMemoryServer} from "mongodb-memory-server"
import {appConfig} from "../../src/app/config";
import {db} from "../../src/db/db";
import {UserService} from "../../src/services/user.service";
import {testSeeder} from "../test.seeder";
import {emailAdapter} from "../../src/adapters/email.adapter";
import {ResultCode} from "../../src/models/common/common";
import mongoose from "mongoose";

describe('AUTH-INTEGRATION', () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create()
        const url = mongoServer.getUri()
        appConfig.MONGO_URL = url
        await mongoose.connect(url)
    })

    beforeEach(async () => {
        await db.drop()
    })

    afterAll(async () => {
        await mongoose.connection.close()
        await db.drop()
        await db.stop()
    })

    describe('User Registration',  () => {
        const registerUserUseCase = UserService.createUser
        emailAdapter.sendEmail = jest.fn().mockImplementation((email: string, subject: string, message: string) => {
            return true
        })
        it('should register user with correct data', async () => {

            const {login, password, email} = testSeeder.createUserDto()
            const result = await registerUserUseCase(login,email, password)
            expect(result)
                .toEqual({
                    code: ResultCode.Success,
                    data: {
                        id: expect.any(String),
                        login: expect.any(String),
                        email: expect.any(String),
                        createdAt: expect.any(Date)
                    }
                })

        })
    })
})