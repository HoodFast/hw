import {BlogRepository} from "../repositories/blog.repository";
import {
    createPostFromBlog,
    createPostType,
    OutputBlogType,
    PostType,
    PostTypeDb,
    UpdateBlogType
} from "../models/common/common";
import {PostRepository} from "../repositories/post.repository";
import {PostQueryRepository} from "../repositories/post.query.repository";
import {BlogQueryRepository} from "../repositories/blog.query.repository";

export class BlogService {
    static async createPostToBlog(blogId: string, CreatePostData: createPostFromBlog): Promise<PostType | null> {
        const {title, content, shortDescription} = CreatePostData
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
            createdAt: new Date().toISOString()
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

    static async updateBlog(blogId: string, updateData: UpdateBlogType): Promise<boolean | null> {
        const {name, description, websiteUrl} = updateData
        const findUpdateBlog = await BlogQueryRepository.getById(blogId)
        if (!findUpdateBlog) {
            return null
        }

        return await BlogRepository.updateBlog({id: blogId, ...updateData})
    }

    static async createBlog(data: OutputBlogType): Promise<OutputBlogType | null> {
        const createBlog = await BlogRepository.createBlog(data)
        if (!createBlog) {
            return null
        }

        const blog = await BlogQueryRepository.getById(createBlog.id)
        if (!blog) {
            return null
        }
        return blog
    }

    static async deleteBlog(blogId: string): Promise<boolean | null> {
        const findBlog = await BlogQueryRepository.getById(blogId)
        if (!findBlog) {
            return null
        }
        return await BlogRepository.deleteById(blogId)
    }
}