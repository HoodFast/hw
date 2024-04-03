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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenMetaModel = exports.commentModel = exports.userModel = exports.postModel = exports.blogModel = exports.db = void 0;
const mongodb_1 = require("mongodb");
const config_1 = require("../app/config");
const mongoose_1 = __importDefault(require("mongoose"));
const commentsModel_1 = require("../domain/comments/commentsModel");
const postsModel_1 = require("../domain/posts/postsModel");
exports.db = {
    client: new mongodb_1.MongoClient(config_1.appConfig.MONGO_URL),
    getDbName() {
        return this.client.db(config_1.appConfig.DB_NAME);
    },
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield mongoose_1.default.connect(config_1.appConfig.MONGO_URL);
                yield this.client.connect();
                yield this.getDbName().command({ ping: 1 });
                console.log('db connected');
            }
            catch (e) {
                console.log('db some error');
                yield this.client.close();
            }
        });
    },
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.close();
            console.log('db closed');
        });
    },
    drop() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const collections = yield this.getDbName().listCollections().toArray();
                for (const collection of collections) {
                    const collectionName = collection.name;
                    yield this.getDbName().collection(collectionName).deleteMany({});
                }
            }
            catch (e) {
                yield mongoose_1.default.disconnect();
                console.log('Error drop db');
                yield this.stop();
            }
        });
    }
};
const blogSchema = new mongoose_1.default.Schema({
    name: { type: String, require },
    description: { type: String, require },
    websiteUrl: { type: String, require },
    createdAt: String,
    isMembership: { type: Boolean },
});
const accountSchema = new mongoose_1.default.Schema({
    _passwordHash: { type: String, require },
    recoveryCode: String,
    login: { type: String, require },
    email: { type: String, require },
    createdAt: Date
});
const emailSchema = new mongoose_1.default.Schema({
    confirmationCode: String,
    expirationDate: Date,
    isConfirmed: Boolean
});
const userSchema = new mongoose_1.default.Schema({
    accountData: accountSchema,
    emailConfirmation: emailSchema,
    tokensBlackList: [String]
});
const tokenMetaSchema = new mongoose_1.default.Schema({
    iat: Date,
    expireDate: Date,
    userId: mongodb_1.ObjectId,
    deviceId: { type: String, require },
    ip: { type: String, require },
    title: String
});
exports.blogModel = mongoose_1.default.model('blogs', blogSchema);
exports.postModel = mongoose_1.default.model('posts', postsModel_1.postSchema);
exports.userModel = mongoose_1.default.model('users', userSchema);
exports.commentModel = mongoose_1.default.model('comments', commentsModel_1.commentSchema);
exports.tokenMetaModel = mongoose_1.default.model('tokensMeta', tokenMetaSchema);
