
import dotenv from 'dotenv'
import {MongoClient} from "mongodb";
import {BlogDb} from "../models/blog/db/blog-db";
import {OutputBlogType} from "../repositories/blog-repository";
dotenv.config()

// mongodb+srv://holistic:<vjueBUHFNM1234>@cluster0.9rbemxf.mongodb.net/blog-dev?retryWrites=true&w=majority

const uri = process.env.MONGO_URL || "mongodb"

const client = new MongoClient(uri)

const dataBase = client.db('blogs-db')

export const blogsCollection = dataBase.collection<BlogDb>('blogs')
export const postsCollection = dataBase.collection('posts')






export const runDB = async ()=>{
    try {
        await client.connect()
        console.log("Client connection to DB")
    }
    catch (e){
        console.log(e)
        await client.close()
    }
}


export const db:bdType = {
    blogs:[
        {description:'йа описание',name:'Favorite name', websiteUrl:'web Url',createdAt:'string',isMembership:false},
        {description:'йа описание',name:'Favorite name', websiteUrl:'web Url',createdAt:'string',isMembership:false},

    ],

    posts:[
        {
            id: '11',
            title: 'Ya title',
            shortDescription: 'it`s very cool short description',
            content: "content it is girl",
            blogId: "1",
            blogName:'Favorite name'
        },
        {
            id: '22',
            title: 'Ya title',
            shortDescription: 'it`s very cool short description',
            content: "content it is man",
            blogId: "2",
            blogName:'Best Name'
        }
    ]
}


export type postType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}


type bdType = {
    blogs:OutputBlogType[],
    posts:postType[]
}