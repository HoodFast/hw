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
exports.PostQueryRepository = void 0;
const db_1 = require("../db/db");
const post_mappers_1 = require("../models/blog/mappers/post-mappers");
class PostQueryRepository {
    getAll(sortData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sortBy, sortDirection, pageSize, pageNumber } = sortData;
            const posts = yield db_1.postModel
                .find({})
                .sort({ [sortBy]: sortDirection })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .lean();
            const totalCount = yield db_1.postModel.countDocuments({});
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
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield db_1.postModel.findOne({ _id: id });
            if (!post) {
                return null;
            }
            return (0, post_mappers_1.postMapper)(post);
        });
    }
}
exports.PostQueryRepository = PostQueryRepository;
