import {postsCollection} from "../db/db";
import {BlogRepository} from "./blog-repository";
import {PostType, PostTypeDb, UpdatePostType} from "../models/common/common";
import {postMapper} from "../models/blog/mappers/post-mappers";
import {ObjectId} from "mongodb";


export class PostRepository {
    static async getAll(): Promise<PostType[]> {
        const posts = await postsCollection.find({}).toArray()
        return posts.map(postMapper)
    }

    static async getById(id: string): Promise<PostType | null> {
        const post = await postsCollection.findOne({_id: new ObjectId(id)})
        if (!post) {
            return null
        }
        return postMapper(post)
    }

    static async createPost(data: PostTypeDb): Promise<PostType | null> {
        const blog = await BlogRepository.getById(data.blogId)
        if (!blog) {
            return null
        }

        const res = await postsCollection.insertOne(data)
        const post = await this.getById(res.insertedId.toString())
        if (!post) {
            return null
        }
        return post
    }

    static async updatePost(data: UpdatePostType): Promise<boolean> {
        try {
            const blog = await BlogRepository.getById(data.blogId)
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