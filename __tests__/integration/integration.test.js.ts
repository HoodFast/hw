import {MongoMemoryServer} from "mongodb-memory-server"
import {after, before, describe} from "node:test";
import {appConfig} from "../../src/app/config";
import {db} from "../../src/db/db";
import {authService} from "../../src/services/auth.service";
import {userService} from "../../src/services/user.service";

describe('AUTH-INTEGRATION', () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create()
        const url = mongoServer.getUri()
        appConfig.MONGO_URL = url
    })

    beforeEach(async () => {
        await db.drop()
    })

    afterAll(async () => {
        await db.drop()
        await db.stop()
    })

    describe('User Registration', async () => {
        const registerUserUseCase = userService.createUser
        it('should register user with correct data', async () => {
            // @ts-ignore
            const {login, pass, email} = testSeeder.createUserDto()
            const result = await registerUserUseCase(login, pass, email)
            expect(result)
                .toEqual({
                    login,
                    email,
                    passwordHash: expect.any(String),
                    createdAt:expect.any(Date),
                    emailConfirmation: {
                        confirmationCode: expect.any(String),
                        expirationDate: expect.any(Date),
                        isConfirmed:false
                    }
                })

        })
    })
})