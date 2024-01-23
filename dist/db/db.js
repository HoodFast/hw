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
exports.db = exports.runDB = exports.postsCollection = exports.blogsCollection = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const mongodb_1 = require("mongodb");
dotenv_1.default.config();
// mongodb+srv://holistic:<vjueBUHFNM1234>@cluster0.9rbemxf.mongodb.net/blog-dev?retryWrites=true&w=majority
const uri = process.env.MONGO_URL || "mongodb";
const client = new mongodb_1.MongoClient(uri);
const dataBase = client.db('blogs-db');
exports.blogsCollection = dataBase.collection('blogs');
exports.postsCollection = dataBase.collection('posts');
const runDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        console.log("Client connection to DB");
    }
    catch (e) {
        console.log(e);
        yield client.close();
    }
});
exports.runDB = runDB;
exports.db = {
    blogs: [
        { description: 'йа описание', name: 'Favorite name', websiteUrl: 'web Url', createdAt: 'string', isMembership: false },
        { description: 'йа описание', name: 'Favorite name', websiteUrl: 'web Url', createdAt: 'string', isMembership: false },
    ],
    posts: [
        {
            id: '11',
            title: 'Ya title',
            shortDescription: 'it`s very cool short description',
            content: "content it is girl",
            blogId: "1",
            blogName: 'Favorite name'
        },
        {
            id: '22',
            title: 'Ya title',
            shortDescription: 'it`s very cool short description',
            content: "content it is man",
            blogId: "2",
            blogName: 'Best Name'
        }
    ]
};
