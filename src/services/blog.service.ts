import {BlogRepository} from "../repositories/blog.repository";
import {
    createPostFromBlog,
    OutputBlogType,
    PostType,
    PostTypeDb,
    UpdateBlogType
} from "../models/common/common";
import {PostRepository} from "../repositories/post.repository";
import {PostQueryRepository} from "../repositories/post.query.repository";
import {BlogQueryRepository} from "../repositories/blog.query.repository";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class BlogService {

    constructor(
        protected blogRepository:BlogRepository,
        protected blogQueryRepository:BlogQueryRepository,
        protected postRepository:PostRepository,
        protected postQueryRepository:PostQueryRepository
    ) {

    }
     async createPostToBlog(blogId: string, CreatePostData: createPostFromBlog): Promise<PostType | null> {
        const {title, content, shortDescription} = CreatePostData
        const blog = await this.blogQueryRepository.getById(new ObjectId(blogId))
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

     async updateBlog(blogId: string, updateData: UpdateBlogType): Promise<boolean | null> {
        const {name, description, websiteUrl} = updateData
        const findUpdateBlog = await this.blogQueryRepository.getById(new ObjectId(blogId))
        if (!findUpdateBlog) {
            return null
        }

        return await this.blogRepository.updateBlog({id: blogId, ...updateData})
    }

     async createBlog(data: OutputBlogType): Promise<OutputBlogType | null> {
        const createBlog = await this.blogRepository.createBlog(data)
        if (!createBlog) {
            return null
        }

        const blog = await this.blogQueryRepository.getById(new ObjectId(createBlog.id))
        if (!blog) {
            return null
        }
        return blog
    }

     async deleteBlog(blogId: string): Promise<boolean | null> {
        const findBlog = await this.blogQueryRepository.getById(new ObjectId(blogId))
        if (!findBlog) {
            return null
        }
        return await this.blogRepository.deleteById(blogId)
    }
}