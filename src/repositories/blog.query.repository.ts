import {blogModel,  postModel} from "../db/db";
import {blogMapper} from "../models/blog/mappers/blog-mappers";
import {ObjectId} from "mongodb";
import { OutputBlogMapType, OutputBlogType, Pagination, PostType} from "../models/common/common";
import {postMapper} from "../models/blog/mappers/post-mappers";

export type SortDataSearchType = {
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
        const blogs = await blogModel
            .find(filter)
            .sort({sortBy: sortDirection})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean()
        const totalCount = await blogModel.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount / pageSize)

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: blogs.map(blogMapper)
        }
    }

    static async getAllPostsToBlog(blogId: string, sortData: SortDataType): Promise<Pagination<PostType>> {
        const {sortBy, sortDirection, pageSize, pageNumber} = sortData

        const posts = await postModel
            .find({blogId})
            .sort({sortBy: sortDirection})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean()

        const totalCount = await postModel.countDocuments({blogId})
        const pagesCount = Math.ceil(totalCount / pageSize)

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: posts.map(postMapper)
        }
    }


    static async getById(id: ObjectId): Promise<OutputBlogMapType | null> {
        const blog = await blogModel.findOne({_id: new ObjectId(id)})
        if (!blog) {
            return null
        }
        return blogMapper(blog)
    }
}