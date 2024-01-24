import {WithId} from "mongodb";
import {PostType, PostTypeDb} from "../../common/common";


export const postMapper = (post:WithId<PostTypeDb>):PostType =>{

    return {
        id: post._id.toString(),
        title:post.title,
        shortDescription:post.shortDescription,
        content:post.content,
        blogId:post.blogId,
        blogName:post.blogName,
        createdAt:post.createdAt
    }
}