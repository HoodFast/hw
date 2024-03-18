import {MongoClient, ObjectId} from "mongodb";
import {BlogDbType} from "../models/blog/db/blog-db";
import {PostTypeDb} from "../models/common/common";
import {accountDataType, emailConfirmationType, UsersTypeDb} from "../models/users/db/usersDBModel";
import {CommentDbType} from "../models/comments/db/comment.db.model";
import {appConfig} from "../app/config";
import {tokensMetaDbType} from "../models/tokens/token.db.model";
import mongoose from "mongoose";


export const db = {
    client: new MongoClient(appConfig.MONGO_URL),

    getDbName() {
        return this.client.db(appConfig.DB_NAME)
    },

    async run() {
        try {
            await mongoose.connect(appConfig.MONGO_URL + "/" + appConfig.DB_NAME)
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
            await mongoose.disconnect()
            console.log('Error drop db')
            await this.stop()
        }
    }
}
const blogSchema = new mongoose.Schema<BlogDbType>(
    {
        name: {type: String, require},
        description: {type: String, require},
        websiteUrl: {type: String, require},
        createdAt: String,
        isMembership: {type: Boolean},
    }
)
const postSchema = new mongoose.Schema<PostTypeDb>({
    title: {type: String, require},
    shortDescription: {type: String, require},
    content: {type: String, require},
    blogId: {type: String, require},
    blogName: {type: String, require},
    createdAt: {type: String, require},
})


const accountSchema = new mongoose.Schema<accountDataType>({
        _passwordHash: {type: String, require},
        recoveryCode: String,
        login: {type: String, require},
        email: {type: String, require},
        createdAt: Date
    }
)

const emailSchema = new mongoose.Schema<emailConfirmationType>({
        confirmationCode: String,
        expirationDate: Date,
        isConfirmed: Boolean
    }
)

const userSchema = new mongoose.Schema<UsersTypeDb>({
        accountData: accountSchema,
        emailConfirmation: emailSchema,
        tokensBlackList: [String]
    }
)

const commentSchema = new mongoose.Schema<CommentDbType>({
    content: String,
    postId: {type: String, require},
    commentatorInfo: {
        userId: {type: String, require},
        userLogin: {type: String, require},
    },
    createdAt: String
})

const tokenMetaSchema = new mongoose.Schema<tokensMetaDbType>(
    {
        iat: Date,
        expireDate: Date,
        userId: ObjectId,
        deviceId: {type: String, require},
        ip: {type: String, require},
        title: String
    }
)

export const blogModel = mongoose.model('blogs', blogSchema)
export const postModel = mongoose.model('posts', postSchema)
export const userModel = mongoose.model('users', userSchema)
export const commentModel = mongoose.model('comments', commentSchema)
export const tokenMetaModel = mongoose.model('tokensMeta', tokenMetaSchema)

