import {Router} from "express";
import {
    blCollection,
    blogsCollection,
    commentsCollection,
    postsCollection,
    rateLimitsCollection,
    tokensMetaCollection,
    usersCollection
} from "../db/db";

export const testingRoute = Router({})


testingRoute.delete('/all-data',async (req,res)=>{
    await blogsCollection.deleteMany({})
    await postsCollection.deleteMany({})
    await usersCollection.deleteMany({})
    await commentsCollection.deleteMany({})
    await tokensMetaCollection.deleteMany({})
    await rateLimitsCollection.deleteMany({})
    await blCollection.deleteMany({})
    res.sendStatus(204)
})