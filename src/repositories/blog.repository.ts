import {blogModel} from "../db/db";

import {ObjectId} from "mongodb";
import {BlogType, OutputBlogMapType, OutputBlogType} from "../models/common/common";

import {BlogQueryRepository} from "./blog.query.repository";
import {BlogDbType} from "../models/blog/db/blog-db";







export class BlogRepository {

    static async createBlog(createData: OutputBlogType):Promise<OutputBlogMapType | null> {
        const res = await blogModel.insertMany(createData)
        const blog = await BlogQueryRepository.getById(res[0]._id)
        if (!blog) {
            return null
        }
        return blog
    }

    static async updateBlog(data: BlogType):Promise<boolean> {

        const res = await blogModel.updateOne({_id:new ObjectId(data.id)}, {
            $set : {
                name:data.name,
                description:data.description,
                websiteUrl:data.websiteUrl
            }
        })
        return !!res.matchedCount
    }

    static async getById(id: string): Promise<BlogDbType | null> {
        const blog = await blogModel.findOne({_id: new ObjectId(id)})
        if (!blog) {
            return null
        }
        return blog
    }

    static async deleteById(id: string):Promise<boolean> {
        const res = await blogModel.deleteOne({_id:new ObjectId(id)})
        return !!res.deletedCount
    }
}