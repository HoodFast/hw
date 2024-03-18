"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogQueryRepository = void 0;
const db_1 = require("../db/db");
const blog_mappers_1 = require("../models/blog/mappers/blog-mappers");
const mongodb_1 = require("mongodb");
const post_mappers_1 = require("../models/blog/mappers/post-mappers");
class BlogQueryRepository {
    static getAll(sortData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sortBy, sortDirection, pageSize, pageNumber, searchNameTerm } = sortData;
            let filter = {};
            if (searchNameTerm) {
                filter = {
                    name: {
                        $regex: searchNameTerm,
                        $options: 'i'
                    }
                };
            }
            const blogs = yield db_1.blogModel
                .find(filter)
                .sort({ sortBy: sortDirection })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .lean();
            const totalCount = yield db_1.blogModel.countDocuments(filter);
            const pagesCount = Math.ceil(totalCount / pageSize);
            return {
                pagesCount,
                page: pageNumber,
                pageSize,
                totalCount,
                items: blogs.map(blog_mappers_1.blogMapper)
            };
        });
    }
    static getAllPostsToBlog(blogId, sortData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sortBy, sortDirection, pageSize, pageNumber } = sortData;
            const posts = yield db_1.postModel
                .find({ blogId })
                .sort({ sortBy: sortDirection })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .lean();
            const totalCount = yield db_1.postModel.countDocuments({ blogId });
            const pagesCount = Math.ceil(totalCount / pageSize);
            return {
                pagesCount,
                page: pageNumber,
                pageSize,
                totalCount,
                items: posts.map(post_mappers_1.postMapper)
            };
        });
    }
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield db_1.blogModel.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!blog) {
                return null;
            }
            return (0, blog_mappers_1.blogMapper)(blog);
        });
    }
}
exports.BlogQueryRepository = BlogQueryRepository;
