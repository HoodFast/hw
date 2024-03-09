import {MongoMemoryServer} from "mongodb-memory-server";
import {appConfig} from "../../src/app/config";
import {db} from "../../src/db/db";
import DoneCallback = jest.DoneCallback;

import {userService} from "../../src/services/user.service";
import {testSeeder} from "../test.seeder";
import {ResultCode} from "../../src/models/common/common";
import {emailAdapter} from "../../src/adapters/email.adapter";

describe('AUTH-INTEGRATION', () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create()
        const url = mongoServer.getUri()
        console.log(url)
        appConfig.MONGO_URL = url
    })

    beforeEach(async () => {
        await db.drop()
    })
    afterAll(async () => {
        await db.drop()
        await db.stop()
    })
    afterAll((done: DoneCallback) => done())
    describe('USER Registration', () => {
        const registerUserUseCase = userService.createUser
        // emailAdapter.sendEmail = emailServiceMock.sendEmail
        // emailAdapter.sendEmail=jest.fn()
        emailAdapter.sendEmail = jest.fn().mockImplementation((email: string, subject: string, message: string) => {
            return true
        })

        it('should register user with correct data', async () => {
            const {login, password, email} = testSeeder.createUserDto()
            const result = await registerUserUseCase(login, email, password)

            expect(result).toEqual({
                code: ResultCode.Success,
                data: {
                    id: expect.any(String),
                    login: expect.any(String),
                    email: expect.any(String),
                    createdAt: expect.any(Date)
                }
            })
            expect(emailAdapter.sendEmail).toBeCalled()
            expect(emailAdapter.sendEmail).toBeCalledTimes(1)
        })
        it('Should not register user twice', async () => {
            const {login, password, email} = testSeeder.createUserDto()
            await testSeeder.registerUser({login, password, email})
            const result = await registerUserUseCase(login, email, password)
            expect(result).toEqual({
                code: ResultCode.Forbidden
            })
        })
    })
})