import {blogsCollection} from "../db/db";
import {blogMapper} from "../models/blog/mappers/blog-mappers";
import {ObjectId} from "mongodb";
import {blogType} from "../routes/blog-route";

export type OutputBlogType = {
    name: string
    description: string
    websiteUrl: string
    createdAt:string
    isMembership:boolean
}


// export type blogType = {
//     id: string,
//     name: string
//     description: string
//     websiteUrl: string
// }


export class BlogRepository {
    static async getAll(): Promise<OutputBlogType[]> {
        const blogs = await blogsCollection.find({}).toArray()
        return blogs.map(blogMapper)
    }

    static async createBlog(createData: OutputBlogType):Promise<OutputBlogType | null> {
        const res = await blogsCollection.insertOne(createData)
        const blog = await this.getById(res.insertedId.toString())
        if (!blog) {
            return null
        }
        return blog
    }

    static async getById(id: string): Promise<OutputBlogType | null> {
        const blog = await blogsCollection.findOne({_id: new ObjectId(id)})
        if (!blog) {
            return null
        }
        return blogMapper(blog)
    }

    static async updateBlog(data: blogType):Promise<boolean> {

        const res = await blogsCollection.updateOne({_id:new ObjectId(data.id)}, {
            $set : {
                name:data.name,
                description:data.description,
                websiteUrl:data.websiteUrl
            }
        })
        return !!res.matchedCount
    }

    static async deleteById(id: string):Promise<boolean> {
        const res = await blogsCollection.deleteOne({_id:new ObjectId(id)})
        return !!res.deletedCount
    }
}