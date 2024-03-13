import {postsCollection, tokensMetaCollection} from "../db/db";
import {UpdatePostType} from "../models/common/common";
import {ObjectId} from "mongodb";
import {BlogQueryRepository} from "./blog.query.repository";

import {tokensMetaDbType} from "../models/tokens/token.db.model";


export class TokenMetaRepository {

    static async setTokenMetaData(data: tokensMetaDbType): Promise<boolean | null> {

        await tokensMetaCollection.insertOne(data)
        const TokenMeta = await this.getByDeviceId(data.deviceId)
        if (!TokenMeta) {
            return null
        }
        return !!TokenMeta
    }

    static async getByDeviceId(deviceId:string){
        const meta = await tokensMetaCollection.findOne({deviceId})
        if(!meta) return null
        return meta
    }

    static async getSession(userId:ObjectId,title:string){
        const meta = await tokensMetaCollection.findOne({userId,title})
        if(!meta) return null
        return meta
    }

    static async deleteById(id:ObjectId){
        const res = await tokensMetaCollection.deleteOne({_id:new ObjectId(id)})
        return !!res.deletedCount
    }
    static async updatePost(data: UpdatePostType): Promise<boolean> {
        try {
            const blog = await BlogQueryRepository.getById(data.blogId)
            if (!blog) {
                return false
            }
            const res = await postsCollection.updateOne({_id: new ObjectId(data.id)}, {
                $set: {
                    title: data.title,
                    shortDescription: data.shortDescription,
                    content: data.content,
                    blogId: data.blogId,
                    blogName: blog.name
                }
            })

            return !!res.matchedCount
        } catch (e) {
            console.log(e)
            return false
        }
    }

    static async deletePost(id: string) {
        const res = await postsCollection.deleteOne({_id: new ObjectId(id)})
        return !!res.deletedCount
    }
}