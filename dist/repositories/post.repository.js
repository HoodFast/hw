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
exports.PostRepository = void 0;
const db_1 = require("../db/db");
const mongodb_1 = require("mongodb");
const blog_query_repository_1 = require("./blog.query.repository");
const post_query_repository_1 = require("./post.query.repository");
class PostRepository {
    static createPost(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.postsCollection.insertOne(data);
            const post = yield post_query_repository_1.PostQueryRepository.getById(res.insertedId.toString());
            if (!post) {
                return null;
            }
            return post;
        });
    }
    static updatePost(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blog = yield blog_query_repository_1.BlogQueryRepository.getById(data.blogId);
                if (!blog) {
                    return false;
                }
                const res = yield db_1.postsCollection.updateOne({ _id: new mongodb_1.ObjectId(data.id) }, {
                    $set: {
                        title: data.title,
                        shortDescription: data.shortDescription,
                        content: data.content,
                        blogId: data.blogId,
                        blogName: blog.name
                    }
                });
                return !!res.matchedCount;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
    }
    static deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.postsCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return !!res.deletedCount;
        });
    }
}
exports.PostRepository = PostRepository;