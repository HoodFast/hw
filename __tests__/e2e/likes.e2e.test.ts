import {app} from '../../src/settings'

import {CreatePostType, UpdateBlogType} from "../../src/models/common/common";
import {createAndLoginManyUsers, createUserJwtToken} from "./utils/createUsers";
import {routerPaths} from "../../src/models/common/paths/paths";
import mongoose from "mongoose";
import {appConfig} from "../../src/app/config";
import {ADMIN_LOGIN, ADMIN_PASS} from "../../src/auth/guards/base.auth.guard";
import {createNewBlogDto, createNewPostDto} from "./utils/createDto";


const request = require('supertest');

const path = {
    comments: '/ht_02/api/comments/'
}

const getNewLike = (myStatus: string) => {
    return {likeStatus: myStatus}
}

const errorMessages = {
    errorsMessages: [
        {message: 'invalid title!', field: 'title'},
        {message: 'invalid author!', field: 'author'},
    ],
}
describe('COMMENT LIKES', () => {


    let tokensList:string[] = []
    let commentId: string
    beforeAll(async () => {
        await mongoose.connect(appConfig.MONGO_URL)
        await request(app).delete(routerPaths.deleteAll).expect(204)

        tokensList = await createAndLoginManyUsers(app, 5)
        const createNewBlog = await request(app)
            .post(routerPaths.blogs)
            .auth(ADMIN_LOGIN, ADMIN_PASS)
            .send(createNewBlogDto())
            .expect(201)
        const blogId = createNewBlog.body.id

        const createNewPost = await request(app)
            .post(routerPaths.posts)
            .auth(ADMIN_LOGIN, ADMIN_PASS)
            .send(createNewPostDto(blogId))
            .expect(201)
        const postId = createNewPost.body.id

        const comment = await request(app)
            .post(routerPaths.posts + '/' + postId + '/comments')
            .set('Authorization',`Bearer ${tokensList[0]}`)
            .send({content: 'string string string '})
            .expect(201)
        commentId = comment.body.id

    })

    beforeEach(async () => {

    })
    afterAll(async () => {
        await mongoose.connection.close()
    })

    it('+put correct like-statuses', async () => {
        const likeStatuses = ['Like', 'Like', 'Like', 'Like', 'Dislike']
        for (let i = 0; i < likeStatuses.length; i++) {
            const res = await request(app)
                .put(routerPaths.comments+'/'+commentId+'/like-status')
                .set('Authorization',`Bearer ${tokensList[i]}`)
                .send(
                    getNewLike(likeStatuses[i])
                ).expect(204)
        }
        const res = await request(app)
            .get(routerPaths.comments+'/'+commentId)
            .set('Authorization',`Bearer ${tokensList[0]}`)
            .expect(200)

        expect(res.body.likesInfo.likesCount).toBe(4)
        expect(res.body.likesInfo.dislikesCount).toBe(1)
        expect(res.body.likesInfo.myStatus).toBe('Like')
    })

    it('-don`t put incorrect like-status', async () => {
        console.log(commentId)
        const res = await request(app)
            .put(routerPaths.comments+'/'+commentId+'/like-status')
            .set('Authorization',`Bearer ${tokensList[0]}`)
            .send(
                getNewLike('azaza')
            ).expect(400)
    })

    it('-don`t put like-status Unauthorized', async () => {
        const res = await request(app)
            .put(routerPaths.comments+'/660074788cf4e135cc068461/like-status')
            .send(
                getNewLike('Like')
            ).expect(401)
    })

    it('+update like-status ', async () => {
        const likeStatuses = ['Like', 'Like', 'Like', 'Like', 'Like']
        for (let i = 0; i < likeStatuses.length; i++) {
            const res = await request(app)
                .put(routerPaths.comments+'/'+commentId+'/like-status')
                .set('Authorization',`Bearer ${tokensList[i]}`)
                .send(
                    getNewLike(likeStatuses[i])
                ).expect(204)
        }
        const res = await request(app)
            .get(routerPaths.comments+'/'+commentId)
            .set('Authorization',`Bearer ${tokensList[0]}`)
            .expect(200)
    })


})
