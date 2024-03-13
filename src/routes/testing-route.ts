import {Router} from "express";
import {blogsCollection, commentsCollection, postsCollection, tokensMetaCollection, usersCollection} from "../db/db";

export const testingRoute = Router({})


testingRoute.delete('/all-data',async (req,res)=>{
    await blogsCollection.deleteMany({})
    await postsCollection.deleteMany({})
    await usersCollection.deleteMany({})
    await commentsCollection.deleteMany({})
    await tokensMetaCollection.deleteMany({})
    res.sendStatus(204)
})