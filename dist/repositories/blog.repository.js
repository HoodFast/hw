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
exports.BlogRepository = void 0;
const db_1 = require("../db/db");
const mongodb_1 = require("mongodb");
const blog_query_repository_1 = require("./blog.query.repository");
class BlogRepository {
    createBlog(createData) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.blogModel.insertMany(createData);
            const blog = yield blog_query_repository_1.BlogQueryRepository.getById(res[0]._id);
            if (!blog) {
                return null;
            }
            return blog;
        });
    }
    updateBlog(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.blogModel.updateOne({ _id: new mongodb_1.ObjectId(data.id) }, {
                $set: {
                    name: data.name,
                    description: data.description,
                    websiteUrl: data.websiteUrl
                }
            });
            return !!res.matchedCount;
        });
    }
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.blogModel.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return !!res.deletedCount;
        });
    }
}
exports.BlogRepository = BlogRepository;
