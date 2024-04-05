import {PostType} from "../../common/common";
import {PostSmart} from "../../../domain/posts/postsModel";
import {likesStatuses} from "../../comments/db/comment.db.model";
import {newestLikesMapper} from "../../post/mappers/newestLikes.mapper";



export const postMapper = (post: PostSmart,userId?:string): PostType => {
    const getNewestLikes = post.getNewestLikes()
    const newestLikes = getNewestLikes.map(newestLikesMapper)
    let myStatus = likesStatuses.none
    if (userId) {
        myStatus = post.getMyStatus(userId)
    }

    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
            likesCount: post.likesCount,
            dislikesCount: post.dislikesCount,
            myStatus,
            newestLikes
        }
    }
}