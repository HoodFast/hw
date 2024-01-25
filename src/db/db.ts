
import dotenv from 'dotenv'
import {MongoClient} from "mongodb";
import {BlogDbType} from "../models/blog/db/blog-db";;
import {PostTypeDb} from "../models/common/common";
dotenv.config()

// mongodb+srv://holistic:<vjueBUHFNM1234>@cluster0.9rbemxf.mongodb.net/blog-dev?retryWrites=true&w=majority

const uri = process.env.MONGO_URL || "mongodb"

const client = new MongoClient(uri)

const dataBase = client.db('blogs-db')

export const blogsCollection = dataBase.collection<BlogDbType>('blogs')
export const postsCollection = dataBase.collection<PostTypeDb>('posts')






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


