import {MongoMemoryServer} from "mongodb-memory-server";
import {appConfig} from "../../src/app/config";
import {db} from "../../src/db/db";
import DoneCallback = jest.DoneCallback;

import {userService} from "../../src/services/user.service";
import {testSeeder} from "../test.seeder";
import {ResultCode} from "../../src/models/common/common";
import {emailAdapter} from "../../src/adapters/email.adapter";
import {emailServiceMock} from "./mocks";

describe('AUTH-INTEGRATION', () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create()
        const url = mongoServer.getUri()
        appConfig.MONGO_URL = url
    }),

        beforeEach(async () => {
            await db.drop()
        })
    afterAll(async () => {
        await db.drop()
        await db.stop()
    }),
        afterAll((done: DoneCallback) => done()),
        describe('USER Registration', () => {
            const registerUserUseCase = userService.createUser
            emailAdapter.sendEmail = emailServiceMock.sendEmail
            it('should register user with correct data', async () => {
                const {login, pass, email} = testSeeder.createUserDto()
                const result = await registerUserUseCase(login, pass, email)

                expect(result).toEqual({
                    code: ResultCode.Success,
                    data: {
                        accountData: {
                            _passwordHash: expect.any(String),
                            createdAt: expect.any(Date),
                            email,
                            login
                        },
                        emailConfirmation: {
                            confirmationCode: expect.any(String),
                            expirationDate: expect.any(Date),
                            isConfirmed: false
                        },
                        tokensBlackList: []
                    }
                })
            })
        })
})