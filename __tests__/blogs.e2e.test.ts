import {app} from '../src/settings'
import assert = require("node:assert");
import {OutputBlogMapType} from "../src/models/common/common";


const request = require('supertest');

const path = {
    blogs: '/ht_02/api/blogs'
}

// const auth = 'admin','qwerty'

const errorMessages = {
    errorsMessages: [
        {message: 'invalid title!', field: 'title'},
        {message: 'invalid author!', field: 'author'},
    ],
}
describe('ht_02/api/blogs', () => {
    let newBlog: { name: string, description: string, websiteUrl: string } = {
        name: "string",
        description: "string",
        websiteUrl: "https://2MZjvsQkpz3JI_Z-cVql4fftm4AdjS_PPsHMs0aB9.6b4A7UT31-KsZs2c0ZX_mdLK"
    }

    beforeAll(async () => {

        await request(app).delete('/ht_02/api/testing/all-data')

    })

    beforeEach(async () => {
        await request(app).post(path.blogs).auth('admin', 'qwerty').send(newBlog)
    })
    afterAll(async () => {

    })

    it('get blogs', async () => {
        const blogs = await request(app).get(path.blogs)
        console.log(blogs)
        expect(blogs.body.items.length).toBe(1)
    })

    it('create blog with correct data', async () => {
        const createResponse = await request(app)
            .post(path.blogs)
            .auth('admin', 'qwerty')
            .send(newBlog)
            .expect(201)

        const expectedObject = {
            id: '1',
            name: 'string',
            description: 'string',
            websiteUrl: 'http//string.ru',
            isMembership: true,
            createdAt: 'string'
        }
        const isValidType = typeof expectedObject

        expect(isValidType).toEqual(typeof createResponse.body)

    })
})
