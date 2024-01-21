import {Request, Response, Router} from "express";
import {PostRepository} from "../repositories/post-repository";
import {postValidation} from "../validators/post-validators";
import {authMiddleware} from "../middlewares/auth/auth-middleware";


export type createPostType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}

type RequestWithBody<B> = Request<{}, {}, B, {}>
type RequestWithParams<P> = Request<P, {}, {}, {}>
type RequestWithParamsSndBody<P, B> = Request<P, {}, B, {}>

export const postRoute = Router({})

postRoute.get('/', (req: Request, res: Response) => {
    const blogs = PostRepository.getAll()
    res.send(blogs)
})

postRoute.get('/:id', (req: RequestWithParams<{ id: string }>, res: Response) => {
    const foundPost = PostRepository.getById(req.params.id)
    if (!foundPost) {
        res.sendStatus(404)
        return
    }
    res.send(foundPost)
})

postRoute.post('/', authMiddleware, postValidation(), (req: RequestWithBody<createPostType>, res: Response) => {
    const newPost = PostRepository.createPost(req.body)
    res.status(201).send(newPost)
})

postRoute.put('/:id', authMiddleware, postValidation(), (req: RequestWithParamsSndBody<{
    id: string
}, createPostType>, res: Response) => {
    const updatePost = PostRepository.updatePost({...req.body, id: req.params.id})
    if (!updatePost) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
})

postRoute.delete('/:id', authMiddleware, (req: RequestWithParams<{ id: string }>, res: Response) => {
    const deletePost = PostRepository.deletePost(req.params.id)
    if (!deletePost) {
        res.sendStatus(404)
        return
    }

    res.sendStatus(204)
})
