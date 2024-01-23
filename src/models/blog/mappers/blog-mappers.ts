import {WithId} from "mongodb";
import {BlogDb} from "../db/blog-db";
import {OutputBlogType} from "../../../repositories/blog-repository";

type OutputBlogMapType = {
    id:string
    name: string
    description: string
    websiteUrl: string
    createdAt:string
    isMembership:boolean
}

export const blogMapper = (blog:WithId<BlogDb>):OutputBlogMapType =>{

    return {
        id: blog._id.toString(),
        name:blog.name,
        description:blog.description,
        websiteUrl:blog.websiteUrl,
        isMembership:blog.isMembership,
        createdAt:blog.createdAt
    }
}