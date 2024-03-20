import {MongoMemoryServer} from "mongodb-memory-server";
import {appConfig} from "../../src/app/config";
import {db} from "../../src/db/db";
import DoneCallback = jest.DoneCallback;
import {userService} from "../../src/services/user.service";
import {testSeeder} from "../test.seeder";
import {ResultCode} from "../../src/models/common/common";
import {emailAdapter} from "../../src/adapters/email.adapter";
import {authService} from "../../src/services/auth.service";
import {randomUUID} from "crypto";
import {add} from "date-fns/add";
import mongoose from "mongoose";

describe('RECOVER PASS', () => {
    beforeAll(async () => {
        await mongoose.connect(appConfig.MONGO_URL + "/" + appConfig.DB_NAME)
        const mongoServer = await MongoMemoryServer.create()
        const url = mongoServer.getUri()
        appConfig.MONGO_URL = url
    })

    beforeEach(async () => {
        await db.drop()
    })
    afterAll(async () => {
        await mongoose.connection.close()
        await db.drop()
        await db.stop()
    })
    afterAll((done: DoneCallback) => done())

    describe('USER Registration', () => {
        const recoverPassUseCase = authService.sendRecoveryPass

        emailAdapter.sendEmail = jest.fn().mockImplementation((email: string, subject: string, message: string) => {
            return true
        })

        it('should send mail with correct email', async () => {
            const newUser = await testSeeder.registerUser({})
            const result = await recoverPassUseCase(newUser.accountData.email)

            expect(result).toEqual({
                code: ResultCode.Success
            })
            expect(emailAdapter.sendEmail).toBeCalled()
            expect(emailAdapter.sendEmail).toBeCalledTimes(1)
        })

        it('should send mail with no exist email', async () => {
            const result = await recoverPassUseCase('noExist@mail.ru')
            expect(result).toEqual({
                code: ResultCode.Success
            })
            expect(emailAdapter.sendEmail).toBeCalled()
            expect(emailAdapter.sendEmail).toBeCalledTimes(2)
        })

    })})