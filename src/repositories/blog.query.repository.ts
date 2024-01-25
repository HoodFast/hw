import {blogsCollection, postsCollection} from "../db/db";
import {blogMapper} from "../models/blog/mappers/blog-mappers";
import {ObjectId} from "mongodb";
import {BlogType, OutputBlogMapType, OutputBlogType, Pagination, PostType} from "../models/common/common";
import {QueryBlogInputModel} from "../models/blog/input/query.blog.input.model";
import {postMapper} from "../models/blog/mappers/post-mappers";

type SortDataSearchType = {
    searchNameTerm: string | null
    sortBy: string
    sortDirection: "asc" | "desc"
    pageNumber: number
    pageSize: number
}

export type SortDataType = {
    sortBy: string
    sortDirection: "asc" | "desc"
    pageNumber: number
    pageSize: number
}


export class BlogQueryRepository {
    static async getAll(sortData: SortDataSearchType): Promise<Pagination<OutputBlogType>> {
        const {sortBy, sortDirection, pageSize, pageNumber, searchNameTerm} = sortData
        let filter = {}
        if (searchNameTerm) {
            filter = {
                name: {
                    $regex: searchNameTerm,
                    $options: 'i'
                }
            }
        }
        const blogs = await blogsCollection
            .find(filter)
            .sort(sortBy, sortDirection)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()
        const totalCount = await blogsCollection.countDocuments(filter)
        const pageCount = Math.ceil(totalCount / pageSize)

        return {
            totalCount,
            pageCount,
            page: pageNumber,
            pageSize,
            items: blogs.map(blogMapper)
        }
    }

    static async getAllPostsToBlog (blogId:string,sortData:SortDataType):Promise<Pagination<PostType>>{
        const {sortBy, sortDirection, pageSize, pageNumber} = sortData

        const posts = await postsCollection
            .find({blogId})
            .sort(sortBy, sortDirection)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()

        const totalCount = await postsCollection.countDocuments({blogId})
        const pageCount = Math.ceil(totalCount / pageSize)

        return {
            totalCount,
            pageCount,
            page: pageNumber,
            pageSize,
            items: posts.map(postMapper)
        }
    }


    static async getById(id: string): Promise<OutputBlogMapType | null> {
        const blog = await blogsCollection.findOne({_id: new ObjectId(id)})
        if (!blog) {
            return null
        }
        return blogMapper(blog)
    }
}