import {routerPaths} from "../../../src/models/common/paths/paths";
import {ADMIN_LOGIN, ADMIN_PASS} from "../../../src/auth/guards/base.auth.guard";

const request = require('supertest');



export const createUser = async (app:any)=>{
    const resp = await request(app)
        .post(routerPaths.users)
        .auth(ADMIN_LOGIN, ADMIN_PASS)
        .send({
            login: 'test',
            email: 'test@gmail.com',
            password: '123456'
        }).expect(201)
    return resp.body
}

export const createUsers=async (app:any,count:any)=>{
    const users = []
    for (let i = 0; i <= count ; i++) {
        const resp = await request(app)
            .post(routerPaths.users)
            .auth(ADMIN_LOGIN, ADMIN_PASS)
            .send({
                login: `test ${i}`,
                email: `test${i}@gmail.com`,
                password: '123456'
            }).expect(201)
        users.push(resp.body)
    }
    return users
}


export const createUserJwtToken=async (app:any)=>{
    const newUser = await createUser(app)

    const resp = await request(app)
        .post(routerPaths.login).auth('admin', 'qwerty').send({loginOrEmail:newUser.login,password:'123456'})
    return resp.body.accessToken
}