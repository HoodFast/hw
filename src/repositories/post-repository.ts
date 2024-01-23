import {db} from "../db/db";
import {createPostType} from "../routes/posts-route";
import {BlogRepository} from "./blog-repository";


type postType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
}

type updatePostType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
}

export class PostRepository {
    static getAll() {
        return db.posts
    }

    static getById(id: string) {
        const post = db.posts.find(p => p.id === id)
        return post
    }

    static async createPost(data: createPostType) {
        const blog = await BlogRepository.getById(data.blogId)
        if (!blog) {
            return
        }
        const newPost: postType = {
            id: String(+(new Date())),
            title: data.title,
            shortDescription: '',
            content: data.content,
            blogId: data.blogId,
            blogName: blog.name,
        }

        db.posts.push(newPost)

        return newPost
    }

    static updatePost(data:updatePostType) {
       const foundPost = db.posts.find(p=>p.id===data.id)
        if(foundPost){
            foundPost.blogId=data.blogId
            foundPost.content=data.content
            foundPost.title=data.title
            foundPost.shortDescription=data.shortDescription
            return true
        }
        return false
    }

    static deletePost(id:string){
        const foundPost = db.posts.find(p=>p.id===id)
        if(!foundPost){
            return false
        }
        db.posts = db.posts.filter(p=> p.id!==id)
        return true
    }

    static deletePostAll(){
        db.posts = []
        return
    }
}