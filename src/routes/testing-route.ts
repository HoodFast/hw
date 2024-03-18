import {Router} from "express";
import {
    blogModel,
    commentModel,
    postModel,
    tokenMetaModel,
    userModel,
} from "../db/db";

export const testingRoute = Router({})


testingRoute.delete('/all-data',async (req,res)=>{
    await blogModel.deleteMany({})
    await postModel.deleteMany({})
    await userModel.deleteMany({})
    await commentModel.deleteMany({})
    await tokenMetaModel.deleteMany({})

    res.sendStatus(204)
})