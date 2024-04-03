import {WithId} from "mongodb";
import {PostType} from "../../common/common";
import {PostSmart, PostTypeDb} from "../../../domain/posts/postsModel";
import {likesStatuses} from "../../comments/db/comment.db.model";


export const postMapper = (post:PostSmart):PostType =>{
const newestLikes = post.getNewestLikes()
    return {
        id: post._id.toString(),
        title:post.title,
        shortDescription:post.shortDescription,
        content:post.content,
        blogId:post.blogId,
        blogName:post.blogName,
        createdAt:post.createdAt,
        extendedLikesInfo:{
            likesCount:0,
            dislikesCount:0,
            myStatus:likesStatuses.none,
            newestLikes
        }
    }
}