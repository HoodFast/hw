import {Router} from "express";
import {BlogRepository} from "../repositories/blog-repository";
import {PostRepository} from "../repositories/post-repository";

export const testingRoute = Router({})


testingRoute.delete('/all-data',(req,res)=>{
    BlogRepository.deleteBlogsAll()
    PostRepository.deletePostAll()
    res.sendStatus(204)
})