import {app} from '../../src/settings'

import {CreatePostType, UpdateBlogType} from "../../src/models/common/common";
import {routerPaths} from "../../src/models/common/paths/paths";
import {CreateCommentInputType} from "../../src/models/comments/input/create.comment.input.model";
import {createUserJwtToken} from "./utils/createUsers";


const request = require('supertest');


describe('ht_02/api/blogs', () => {
    let newBlog: { name: string, description: string, websiteUrl: string } = {
        name: "string",
        description: "string",
        websiteUrl: "https://2MZjvsQkpz3JI_Z-cVql4fftm4AdjS_PPsHMs0aB9.6b4A7UT31-KsZs2c0ZX_mdLK"
    }

    let postId: string
    let commentatorUserId:string
    let commentatorUserLogin:string='test'
    beforeAll(async () => {
        commentatorUserId = await createUserJwtToken(app)
        await request(app).delete(routerPaths.deleteAll)

        await request(app).post(routerPaths.blogs).auth('admin', 'qwerty').send(newBlog)
        const blogs = await request(app).get(routerPaths.blogs)
        const blogId = blogs.body.items[0].id
        const newPostCreateData: CreatePostType = {
            title: 'test',
            blogId,
            content: 'test content',
            shortDescription: "test"
        }

        for (let i = 0; i < 15; i++) {
            await request(app).post(routerPaths.posts).auth('admin', 'qwerty').send(newPostCreateData)
        }
        const posts = await request(app).get(routerPaths.posts)
        postId = posts.body.items[1].id
    })

    afterAll(async () => {

    })

    it('+get post, should be 10 posts', async () => {
        const posts = await request(app).get(routerPaths.posts)
        expect(posts.body.items.length).toBe(10)
    })

    it('+create post with correct data', async () => {
        const blogs = await request(app).get(routerPaths.blogs)
        const blogId = blogs.body.items[0].id
        const newPost: CreatePostType = {
            title: 'test',
            blogId,
            content: 'test content',
            shortDescription: "test"
        }

        const createResponse = await request(app)
            .post(routerPaths.posts)
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
            blogName: blogs.body.items[0].name,
            createdAt: expect.any(String)
        })

        const getPosts = await request(app)
            .get(routerPaths.posts)
            .expect(200)
        debugger
        expect(getPosts.body.totalCount).toBe(16)
    })

    it('+create comment to post with correct data', async () => {

        const newComment: CreateCommentInputType = {
            content: 'test content'
        }

        const createComment = await request(app)
            .post(`${routerPaths.posts}/${postId}/comments`)
            .set('Authorization', `Bearer ${commentatorUserId}`)
            .send(newComment)
            .expect(201)

        const allCommentsToPost = await request(app)
            .get(`${routerPaths.posts}/${postId}/comments`)
            .set('Authorization', `Bearer ${commentatorUserId}`)
            .expect(200)

        allCommentsToPost.body.items.length.toBe(1)

        const expectedObject = {
            id: '1111',
            content: 'string',
            commentatorInfo: {
                userId:'string',
                userLogin:'string'
            },
            createdAt: 'string'
        }
        const isValidType = typeof expectedObject
        expect(isValidType).toEqual(typeof allCommentsToPost.body.items[0])

        allCommentsToPost.body.items[0].commentatorInfo.userLogin.toBe(commentatorUserLogin)

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
