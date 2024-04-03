import {blogModel, postModel} from "../db/db";
import {PostType, UpdatePostType} from "../models/common/common";
import {ObjectId} from "mongodb";

import {postMapper} from "../models/blog/mappers/post-mappers";
import {injectable} from "inversify";
import {PostTypeDb} from "../domain/posts/postsModel";

@injectable()
export class PostRepository {

    async createPost(data: PostTypeDb): Promise<PostType | null> {

        const res = await postModel.insertMany(data)
        const post = await postModel.findOne(res[0]._id)
        if (!post) {
            return null
        }
        return postMapper(post)
    }

    async updatePost(data: UpdatePostType): Promise<boolean> {
        try {
            const blog = await blogModel.findOne(new ObjectId(data.blogId))
            if (!blog) {
                return false
            }
            const res = await postModel.updateOne({_id: new ObjectId(data.id)}, {
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

    async deletePost(id: string) {
        const res = await postModel.deleteOne({_id: new ObjectId(id)})
        return !!res.deletedCount
    }
    async getPostById(id:string) {
        const post = await postModel.findOne({_id: id})
        return post
    }
}