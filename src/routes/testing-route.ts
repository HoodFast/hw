import {Router} from "express";
import {blogsCollection, postsCollection, usersCollection} from "../db/db";

export const testingRoute = Router({})


testingRoute.delete('/all-data',async (req,res)=>{
    await blogsCollection.deleteMany({})
    await postsCollection.deleteMany({})
    await usersCollection.deleteMany({})
    res.sendStatus(204)
})