import {routerPaths} from "../../../src/models/common/paths/paths";
import {ADMIN_LOGIN, ADMIN_PASS} from "../../../src/auth/guards/base.auth.guard";

const request = require('supertest');


export const createUser = async (app: any) => {
    const resp = await request(app)
        .post(routerPaths.users)
        .auth(ADMIN_LOGIN, ADMIN_PASS)
        .send({
            login: 'test',
            email: 'test@gmail.com',
            password: '1234567'
        }).expect(201)
    return resp.body
}

export const createUsers = async (app: any, count: number) => {
    const users = []
    for (let i = 0; i <= count-1; i++) {

        const resp = await request(app)
            .post(routerPaths.users)
            .auth(ADMIN_LOGIN, ADMIN_PASS)
            .send({
                login: `atest${i}`,
                email: `123test${i}@gmail.com`,
                password: '1234567'
            }).expect(201)

        users.push(resp.body)
    }
    return users
}

export const createAndLoginManyUsers = async (app: any, count: number) => {
    const users = await createUsers(app, count)
    const tokensList = []
    for (let i = 0; i < users.length; i++) {
        const resp = await request(app)
            .post(routerPaths.login)
            .send({loginOrEmail: users[i].login, password: '1234567'})
        tokensList.push(resp.body.accessToken)
    }
    return tokensList
}


export const createUserJwtToken = async (app: any) => {
    const newUser = await createUser(app)
    const resp = await request(app)
        .post(routerPaths.login)
        .send({loginOrEmail: newUser.login, password: '1234567'})
    return resp.body.accessToken
}