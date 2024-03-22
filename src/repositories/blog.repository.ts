import {blogModel} from "../db/db";
import {ObjectId} from "mongodb";
import {BlogType, OutputBlogMapType, OutputBlogType} from "../models/common/common";
import {blogMapper} from "../models/blog/mappers/blog-mappers";







export class BlogRepository {

    async createBlog(createData: OutputBlogType):Promise<OutputBlogMapType | null> {
        const res = await blogModel.insertMany(createData)
        const blog = await blogModel.findOne(res[0]._id)
        if (!blog) {
            return null
        }
        return blogMapper(blog)
    }

    async updateBlog(data: BlogType):Promise<boolean> {

        const res = await blogModel.updateOne({_id:new ObjectId(data.id)}, {
            $set : {
                name:data.name,
                description:data.description,
                websiteUrl:data.websiteUrl
            }
        })
        return !!res.matchedCount
    }



    async deleteById(id: string):Promise<boolean> {
        const res = await blogModel.deleteOne({_id:new ObjectId(id)})
        return !!res.deletedCount
    }
}