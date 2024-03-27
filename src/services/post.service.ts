import {BlogRepository} from "../repositories/blog.repository";
import {
    PostType, PostTypeCreate,
    PostTypeDb,
    UpdatePostType
} from "../models/common/common";
import {PostRepository} from "../repositories/post.repository";
import {PostQueryRepository} from "../repositories/post.query.repository";
import {ObjectId} from "mongodb";
import {BlogQueryRepository} from "../repositories/blog.query.repository";
import {injectable} from "inversify";

@injectable()
export class PostService {


    constructor( private postQueryRepository:PostQueryRepository,
    private blogQueryRepository:BlogQueryRepository,
    private postRepository:PostRepository) {

    }

    async createPost(data: PostTypeCreate): Promise<PostType | null> {
        const {title, createdAt, blogId, content, shortDescription} = data
        const blog = await  this.blogQueryRepository.getById(new ObjectId(blogId))
        if (!blog) {
            return null
        }
        const newPost: PostTypeDb = {
            title,
            content,
            shortDescription,
            blogId,
            blogName: blog.name,
            createdAt
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

    async updatePost(data: UpdatePostType): Promise<boolean | null> {
        return await this.postRepository.updatePost(data)
    }

    async deletePost(id: string): Promise<boolean> {
        return await this.postRepository.deletePost(id)
    }

}