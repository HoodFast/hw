import {WithId} from "mongodb";
import {BlogDb} from "../db/blog-db";
import {OutputBlogMapType} from "../../common/common";


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