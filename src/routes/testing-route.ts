import {Router} from "express";
import {blogsCollection, commentsCollection, postsCollection, usersCollection} from "../db/db";

export const testingRoute = Router({})


testingRoute.delete('/all-data',async (req,res)=>{
    await blogsCollection.deleteMany({})
    await postsCollection.deleteMany({})
    await usersCollection.deleteMany({})
    await commentsCollection.deleteMany({})
    res.sendStatus(204)
})