import dotenv from 'dotenv'
import {MongoClient} from "mongodb";
import {BlogDbType} from "../models/blog/db/blog-db";
import {PostTypeDb} from "../models/common/common";
import {UsersTypeDb} from "../models/users/db/usersDBModel";
import {CommentDbType} from "../models/comments/db/comment.db.model";
import {appConfig} from "../app/config";
import {rateLimitDbType} from "../models/sessions/session.db.model";
import {tokensMetaDbType} from "../models/tokens/token.db.model";

dotenv.config()

// mongodb+srv://holistic:vjueBUHFNM1234@cluster0.9rbemxf.mongodb.net/blog-dev?retryWrites=true&w=majority

// const uri = process.env.MONGO_URL || "mongodb"
//
// const client = new MongoClient(uri)
//
// const dataBase = client.db('blogs-db')
//
// export const blogsCollection = dataBase.collection<BlogDbType>('blogs')
// export const postsCollection = dataBase.collection<PostTypeDb>('posts')
// export const usersCollection = dataBase.collection<UsersTypeDb>('users')
// export const commentsCollection = dataBase.collection<CommentDbType>('comments')





export const db = {
    client: new MongoClient(appConfig.MONGO_URL),

    getDbName() {
        return this.client.db(appConfig.DB_NAME)
    },

    async run() {
        try {
            await this.client.connect()
            await this.getDbName().command({ping: 1})
            console.log('db connected')
        } catch (e: unknown) {
            console.log('db some error')
            await this.client.close()
        }
    },
    async stop() {
        await this.client.close()
        console.log('db closed')
    },
    async drop() {
        try {
            const collections = await this.getDbName().listCollections().toArray()

            for (const collection of collections) {
                const collectionName = collection.name
                await this.getDbName().collection(collectionName).deleteMany({})
            }
        } catch (e: unknown) {
            console.log('Error drop db')
            await this.stop()
        }
    }
}

export const blogsCollection = db.getDbName().collection<BlogDbType>('blogs')
export const postsCollection = db.getDbName().collection<PostTypeDb>('posts')
export const usersCollection = db.getDbName().collection<UsersTypeDb>('users')
export const commentsCollection = db.getDbName().collection<CommentDbType>('comments')
export const rateLimitsCollection = db.getDbName().collection<rateLimitDbType>('rateLimits')
export const tokensMetaCollection = db.getDbName().collection<tokensMetaDbType>('tokensMeta')

export const blCollection = db.getDbName().collection<{ip:string,URL:string}>('blackList')

