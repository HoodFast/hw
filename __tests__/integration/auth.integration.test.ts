import {MongoMemoryServer} from "mongodb-memory-server";
import {appConfig} from "../../src/app/config";
import {db} from "../../src/db/db";
import DoneCallback = jest.DoneCallback;
import {UserService} from "../../src/services/user.service";
import {testSeeder} from "../test.seeder";
import {ResultCode} from "../../src/models/common/common";
import {emailAdapter} from "../../src/adapters/email.adapter";
import {AuthService} from "../../src/services/auth.service";
import {randomUUID} from "crypto";
import {add} from "date-fns/add";
import mongoose from "mongoose";
import {TokenMetaRepository} from "../../src/repositories/tokenMeta.repository";
import {JwtService} from "../../src/application/jwt.service";

describe('AUTH-INTEGRATION', () => {
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
        const registerUserUseCase = UserService.createUser
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
            expect(emailAdapter.sendEmail).toBeCalledTimes(1)
        })
    });

    describe('Confirm email', () => {
        const tokenMetaRepository = new TokenMetaRepository()

        const jwtService = new JwtService(tokenMetaRepository)
        const authService = new AuthService(tokenMetaRepository,jwtService)
        const confirmedEmailUseCase = authService.confirmEmail
        it('should not confirm if user does not exist', async () => {
            const code = randomUUID()
            const result = await confirmedEmailUseCase(code)

            expect(result).toEqual({code: ResultCode.Forbidden})
        })

        it('should not confirm if user has already confirmed', async () => {
            const user = await testSeeder.registerUser({
                ...testSeeder.createUserDto(),
                isConfirmed: true
            })
            const result = await confirmedEmailUseCase(user.emailConfirmation.confirmationCode)

            expect(result).toEqual({code: ResultCode.Forbidden})
        })

        it('should not confirm if user has expired date', async () => {
            const user = await testSeeder.registerUser({
                ...testSeeder.createUserDto(),
                expirationDate: add(new Date(), {minutes: -1})
            })
            const result = await confirmedEmailUseCase(user.emailConfirmation.confirmationCode)

            expect(result.code).toEqual(ResultCode.Forbidden)
            expect(result.errorMessage).toEqual({message: 'expired', field: 'expirationDate'})
        })

        it('should confirm ', async () => {
            const user = await testSeeder.registerUser(testSeeder.createUserDto())
            const result = await confirmedEmailUseCase(user.emailConfirmation.confirmationCode)

            expect(result.code).toEqual(ResultCode.Success)

        })
    })
})