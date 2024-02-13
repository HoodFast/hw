import {Router} from "express";
import {
    ParamsType,
    RequestWithParams,
    RequestWithParamsAndBody,
    ResponseType,
    ResultCode
} from "../models/common/common";
import {CommentsOutputType} from "../models/comments/otput/comments.output.model";
import {ObjectId} from "mongodb";
import {CommentsQueryRepository} from "../repositories/comment.query.repository";
import {accessTokenGuard} from "../middlewares/auth/accesstoken-middleware";
import {CommentsService} from "../services/comments.service";
import {CreateCommentInputType} from "../models/comments/input/create.comment.input.model";
import {commentsValidation} from "../validators/comments-validators";

export const commentsRoute = Router({})


commentsRoute.get('/:id', async (req: RequestWithParams<ParamsType>, res: ResponseType<CommentsOutputType>) => {
    const id = req.params.id
    if (!ObjectId.isValid(id)) return res.sendStatus(404)

    const comment = await CommentsQueryRepository.getById(id)

    if (!comment) return res.sendStatus(404)

    return res.send(comment)
})
commentsRoute.delete('/:id', accessTokenGuard, async (req: RequestWithParams<ParamsType>, res) => {
    const id = req.params.id
    const userId = req.user!.id
    if (!ObjectId.isValid(id)) return res.sendStatus(404)
    const deleted = await CommentsService.deleteCommentById(id, userId)
    switch (deleted.code) {
        case ResultCode.NotFound:
            return res.sendStatus(404)
        case ResultCode.Forbidden:
            return res.sendStatus(403)
        case ResultCode.Success:
            return res.sendStatus(204)

    }
})

commentsRoute.put('/:id', accessTokenGuard, commentsValidation(), async (req: RequestWithParamsAndBody<ParamsType, CreateCommentInputType>, res: ResponseType<void>) => {
    const id = req.params.id
    const userId = req.user!.id
    if (!ObjectId.isValid(id)) return res.sendStatus(404)
    const updateComment = await CommentsService.updateComment(id, req.body.content, userId)
    switch (updateComment.code) {
        case ResultCode.NotFound:
            return res.sendStatus(404)
        case ResultCode.Forbidden:
            return res.sendStatus(403)
        case ResultCode.Success:
            return res.sendStatus(204)
    }
})