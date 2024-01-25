import {BlogRepository} from "../repositories/blog.repository";
import {
    createPostFromBlog,
    createPostType,
    OutputBlogType,
    PostType, PostTypeCreate,
    PostTypeDb,
    UpdateBlogType, UpdatePostType
} from "../models/common/common";
import {PostRepository} from "../repositories/post.repository";
import {PostQueryRepository} from "../repositories/post.query.repository";
import {BlogQueryRepository} from "../repositories/blog.query.repository";

export class PostService {
    static async createPost(data: PostTypeCreate): Promise<PostType | null> {
        const {title, createdAt, blogId, content, shortDescription} = data
        const blog = await BlogRepository.getById(blogId)
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

        const createPost = await PostRepository.createPost(newPost)
        if (!createPost) {
            return null
        }

        const post = await PostQueryRepository.getById(createPost.id)

        if (!post) {
            return null
        }

        return post
    }

    static async updatePost(data: UpdatePostType): Promise<boolean | null> {
        return await PostRepository.updatePost(data)
    }

    static async deletePost(id:string):Promise<boolean>{
        return await PostRepository.deletePost(id)
    }

}