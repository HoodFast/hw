import {app} from '../src/settings'

import {CreatePostType, UpdateBlogType} from "../src/models/common/common";


const request = require('supertest');

const path = {
    blogs: '/ht_02/api/blogs',
    posts: '/ht_02/api/posts'
}


describe('ht_02/api/blogs', () => {
    let newBlog: { name: string, description: string, websiteUrl: string } = {
        name: "string",
        description: "string",
        websiteUrl: "https://2MZjvsQkpz3JI_Z-cVql4fftm4AdjS_PPsHMs0aB9.6b4A7UT31-KsZs2c0ZX_mdLK"
    }


    beforeAll(async () => {

        await request(app).delete('/ht_02/api/testing/all-data')

        await request(app).post(path.blogs).auth('admin', 'qwerty').send(newBlog)
        const blogs = await request(app).get(path.blogs)
        const blogId = blogs.body.items[0].id
        const newPostCreateData: CreatePostType = {
            title: 'test',
            blogId,
            content: 'test content',
            shortDescription: "test"
        }

        for (let i = 0; i < 15; i++) {
            await request(app).post(path.posts).auth('admin', 'qwerty').send(newPostCreateData)
        }


    })

    afterAll(async () => {

    })

    it('+get post, should be 10 posts', async () => {
        const posts = await request(app).get(path.posts)
        expect(posts.body.items.length).toBe(10)
    })

    it('+create post with correct data', async () => {
        const blogs = await request(app).get(path.blogs)
        const blogId = blogs.body.items[0].id
        const newPost:CreatePostType = {
            title: 'test',
            blogId,
            content: 'test content',
            shortDescription: "test"
        }

        const createResponse = await request(app)
            .post(path.posts)
            .auth('admin', 'qwerty')
            .send(newPost)
            .expect(201)

        const expectedObject = {
            id: '1',
            title: "string",
            shortDescription: '',
            content: 'string',
            blogId: 'string',
            blogName: 'string',
            createdAt: new Date().toISOString()
        }
        const isValidType = typeof expectedObject

        expect(isValidType).toEqual(typeof createResponse.body)

        expect(createResponse.body).toEqual({
            id: expect.any(String),
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            blogId: expect.any(String),
            blogName:blogs.body.items[0].name,
            createdAt: expect.any(String)
        })

        const getPosts = await request(app)
            .get(path.posts)
            .expect(200)
        debugger
        expect(getPosts.body.totalCount).toBe(16)
    })
    // it('+update blog with correct data', async () => {
    //     const updateData: UpdateBlogType = {
    //         name: 'test2',
    //         description: 'description update test',
    //         websiteUrl: 'https://test.ru'
    //     }
    //     const blog = await request(app).get(path.blogs)
    //     const currentId = blog.body.items[0].id
    //
    //     await request(app)
    //         .put(`${path.blogs}/${currentId}`)
    //         .auth('admin', 'qwerty')
    //         .send(updateData)
    //         .expect(204)
    //
    //     const updatedBlogs = await request(app).get(`${path.blogs}/${currentId}`)
    //     expect(updatedBlogs.body).toEqual({
    //         id: currentId,
    //         name: updateData.name,
    //         description: updateData.description,
    //         websiteUrl: updateData.websiteUrl,
    //         isMembership: expect.any(Boolean),
    //         createdAt: expect.any(String)
    //     })
    // })
    //
    // it('+blog should be delete by id', async () => {
    //     const blog = await request(app).get(path.blogs)
    //     const blogs = blog.body.items.length
    //     const currentId = blog.body.items[0].id
    //     await request(app)
    //         .delete(`${path.blogs}/${currentId}`)
    //         .auth('admin', 'qwerty')
    //         .expect(204)
    //
    //     const allBlogs = await request(app).get(path.blogs)
    //     expect(allBlogs.body.items.length).toBe(blogs - 1)
    // })
    //
    // it('-blog create with incorrect data errors', async () => {
    //     const res = await request(app)
    //         .post(path.blogs)
    //         .auth('admin', 'qwerty')
    //         .send({name: '', description: '', websiteUrsdcl: 'https://test.ru'})
    //         .expect(400)
    //
    //     expect(res.body).toEqual({
    //         errorsMessages: [
    //             {
    //                 message: expect.any(String),
    //                 field: expect.stringMatching('name')
    //             },
    //             {
    //                 message: expect.any(String),
    //                 field: expect.stringMatching('description')
    //             },
    //             {
    //                 message: expect.any(String),
    //                 field: expect.stringMatching('websiteUrl')
    //             },
    //         ]
    //     })
    // })

})
