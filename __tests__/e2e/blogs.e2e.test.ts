import {app} from '../../src/settings'

import {UpdateBlogType} from "../../src/models/common/common";
import {createUserJwtToken} from "./utils/createUsers";


const request = require('supertest');

const path = {
    blogs: '/ht_02/api/blogs'
}


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
    let token:string
    beforeAll(async () => {
debugger
        token = await createUserJwtToken(app)
        await request(app).delete('/ht_02/api/testing/all-data')
        const blogs = await request(app).get(path.blogs)
        await request(app).post(path.blogs).auth('admin', 'qwerty').send(newBlog)
    })

    beforeEach(async () => {

    })
    afterAll(async () => {

    })

    it('+get blogs', async () => {

        const blogs = await request(app).get(path.blogs)
        expect(blogs.body.items.length).toBe(1)
    })

    it('+create blog with correct data', async () => {
        const createResponse = await request(app)
            .post(path.blogs)
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)

        const expectedObject = {
            id: '1',
            name: 'string',
            description: 'string',
            websiteUrl: 'https://string.ru',
            isMembership: true,
            createdAt: 'string'
        }
        const isValidType = typeof expectedObject

        expect(isValidType).toEqual(typeof createResponse.body)

        expect(createResponse.body).toEqual({
            id: expect.any(String),
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl,
            isMembership: expect.any(Boolean),
            createdAt: expect.any(String)
        })
        const getBlogs = await request(app)
            .get(path.blogs)
            .expect(200)
        debugger
        expect(getBlogs.body.items.length).toBe(2)
    })
    it('+update blog with correct data', async () => {
        const updateData: UpdateBlogType = {
            name: 'test2',
            description: 'description update test',
            websiteUrl: 'https://test.ru'
        }
        const blog = await request(app).get(path.blogs)
        const currentId = blog.body.items[0].id

        await request(app)
            .put(`${path.blogs}/${currentId}`)
            .auth('admin', 'qwerty')
            .send(updateData)
            .expect(204)

        const updatedBlogs = await request(app).get(`${path.blogs}/${currentId}`)
        expect(updatedBlogs.body).toEqual({
            id: currentId,
            name: updateData.name,
            description: updateData.description,
            websiteUrl: updateData.websiteUrl,
            isMembership: expect.any(Boolean),
            createdAt: expect.any(String)
        })
    })

    it('+blog should be delete by id', async () => {
        const blog = await request(app).get(path.blogs)
        const blogs = blog.body.items.length
        const currentId = blog.body.items[0].id
        await request(app)
            .delete(`${path.blogs}/${currentId}`)
            .auth('admin', 'qwerty')
            .expect(204)

        const allBlogs = await request(app).get(path.blogs)
        expect(allBlogs.body.items.length).toBe(blogs - 1)
    })

    it('-blog create with incorrect data errors', async () => {
        const res = await request(app)
            .post(path.blogs)
            .auth('admin', 'qwerty')
            .send({name: '', description: '', websiteUrsdcl: 'https://test.ru'})
            .expect(400)

        expect(res.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: expect.stringMatching('name')
                },
                {
                    message: expect.any(String),
                    field: expect.stringMatching('description')
                },
                {
                    message: expect.any(String),
                    field: expect.stringMatching('websiteUrl')
                },
            ]
        })
    })

})
