import {postsCollection} from "../db/db";
import {BlogRepository} from "./blog.repository";
import {PostType, PostTypeDb, UpdatePostType} from "../models/common/common";
import {postMapper} from "../models/blog/mappers/post-mappers";
import {ObjectId} from "mongodb";
import {BlogQueryRepository} from "./blog.query.repository";
import {PostQueryRepository} from "./post.query.repository";


export class PostRepository {

    static async createPost(data: PostTypeDb): Promise<PostType | null> {

        const res = await postsCollection.insertOne(data)
        const post = await PostQueryRepository.getById(res.insertedId.toString())
        if (!post) {
            return null
        }
        return post
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