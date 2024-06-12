import {
    PostType, PostTypeCreate, ResultCode,

    UpdatePostType
} from "../models/common/common";
import {PostRepository} from "../repositories/post.repository";
import {PostQueryRepository} from "../repositories/post.query.repository";
import {ObjectId} from "mongodb";
import {BlogQueryRepository} from "../repositories/blog.query.repository";
import {injectable} from "inversify";
import {PostSmart, PostTypeDb} from "../domain/posts/postsModel";
import {likesStatuses} from "../models/comments/db/comment.db.model";
import {UserRepository} from "../repositories/user.repository";

@injectable()
export class PostService {


    constructor(private postQueryRepository: PostQueryRepository,
                private blogQueryRepository: BlogQueryRepository,
                private postRepository: PostRepository) {

    }

    async createPost(data: PostTypeCreate): Promise<PostType | null> {
        const {title, createdAt, blogId, content, shortDescription} = data
        const blog = await this.blogQueryRepository.getById(new ObjectId(blogId))
        if (!blog) {
            return null
        }
        const newPost: PostTypeDb = {
            title,
            content,
            shortDescription,
            blogId,
            likesCount: 0,
            dislikesCount: 0,
            blogName: blog.name,
            createdAt,
            likes: []
        }

        const createPost = await this.postRepository.createPost(newPost)
        if (!createPost) {
            return null
        }

        const post = await this.postQueryRepository.getById(new ObjectId(createPost.id))

        if (!post) {
            return null
        }

        return post
    }

    async updatePost(postId:string,data: UpdatePostType): Promise<boolean | null> {
        return await this.postRepository.updatePost(data)
    }

    async deletePost(id: string): Promise<boolean> {
        return await this.postRepository.deletePost(id)
    }

    async updateLike(userId: string, postId: string, likeStatus: likesStatuses) {
        try {
            let post: PostSmart | null = await this.postRepository.getPostById(postId)
            if (!post) return {code: ResultCode.NotFound}

            const user = await UserRepository.getUserById(userId)
            if (!user) return {code: ResultCode.NotFound}
            post.addLike(userId, likeStatus,user?.accountData.login)
            await post.save()

            return {code: ResultCode.Success}
        } catch (e) {
            return {code: ResultCode.Forbidden}
        }

    }
}