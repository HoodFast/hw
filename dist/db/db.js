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
exports.commentsCollection = exports.usersCollection = exports.postsCollection = exports.blogsCollection = exports.db = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const mongodb_1 = require("mongodb");
const config_1 = require("../app/config");
dotenv_1.default.config();
// mongodb+srv://holistic:vjueBUHFNM1234@cluster0.9rbemxf.mongodb.net/blog-dev?retryWrites=true&w=majority
// const uri = process.env.MONGO_URL || "mongodb"
//
// const client = new MongoClient(uri)
//
// const dataBase = client.db('blogs-db')
//
// export const blogsCollection = dataBase.collection<BlogDbType>('blogs')
// export const postsCollection = dataBase.collection<PostTypeDb>('posts')
// export const usersCollection = dataBase.collection<UsersTypeDb>('users')
// export const commentsCollection = dataBase.collection<CommentDbType>('comments')
exports.db = {
    client: new mongodb_1.MongoClient(config_1.appConfig.MONGO_URL),
    getDbName() {
        return this.client.db(config_1.appConfig.DB_NAME);
    },
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
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
                console.log('Error drop db');
                yield this.stop();
            }
        });
    }
};
exports.blogsCollection = exports.db.getDbName().collection('blogs');
exports.postsCollection = exports.db.getDbName().collection('posts');
exports.usersCollection = exports.db.getDbName().collection('users');
exports.commentsCollection = exports.db.getDbName().collection('comments');
