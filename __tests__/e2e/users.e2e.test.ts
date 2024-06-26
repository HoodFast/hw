import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../src/db/db";
import {app} from "../../src/settings";
import {routerPaths} from "../../src/models/common/paths/paths";
import {ADMIN_LOGIN, ADMIN_PASS} from "../../src/auth/guards/base.auth.guard";
import {testSeeder} from "../test.seeder";
import mongoose from "mongoose";

const request = require('supertest');

describe("USER TESTS", () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create()
        await mongoose.connect( mongoServer.getUri())
    })

    beforeEach(async () => {
        await db.drop()
    })

    afterAll(async () => {
        await mongoose.connection.close()
        await db.stop()
    })


    it('- not create user without authorisation', async () => {
        await request(app)
            .post(routerPaths.users)
            .send()
            .expect(401)
    })
    it('+create user with correct data', async () => {
        const userDto = testSeeder.createUserDto()

        const newUser = await request(app)
            .post(routerPaths.users)
            .auth(ADMIN_LOGIN, ADMIN_PASS)
            .send(userDto)
            .expect(201)
    })

})