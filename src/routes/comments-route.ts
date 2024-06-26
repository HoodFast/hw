import "reflect-metadata"
import {Response, Router} from "express";
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
import {likesStatuses} from "../models/comments/db/comment.db.model";
import {likesValidators} from "../validators/likes-validator";
import {accessTokenGetId} from "../middlewares/auth/accesstoken-getId";
import {injectable} from "inversify";
import {container} from "../composition-root";

export const commentsRoute = Router({})
@injectable()
class CommentController {


    constructor(protected commentService: CommentsService) {

    }

    async getCommentById(req: RequestWithParams<ParamsType>, res: ResponseType<CommentsOutputType>) {
        const id = req.params.id
        let userId:string
        if(!req.userId){
            userId=''
        }else{
            userId = req.userId!.toString()
        }

        if (!ObjectId.isValid(id)) return res.sendStatus(404)

        const comment = await CommentsQueryRepository.getById(new ObjectId(id),userId)

        if (!comment) return res.sendStatus(404)

        return res.send(comment)
    }

    async deleteCommentById(req: RequestWithParams<ParamsType>, res: Response) {
        const id = req.params.id
        let userId = req.userId!.toString()
        if (!ObjectId.isValid(id)) return res.sendStatus(404)
        const deleted = await this.commentService.deleteCommentById(id, userId)
        switch (deleted.code) {
            case ResultCode.NotFound:
                return res.sendStatus(404)
            case ResultCode.Forbidden:
                return res.sendStatus(403)
            case ResultCode.Success:
                return res.sendStatus(204)
            default:
                return res.sendStatus(404)
        }
    }

    async updateComment(req: RequestWithParamsAndBody<ParamsType, CreateCommentInputType>, res: Response) {
        const id = req.params.id
        let userId = req.userId!.toString()
        if (!ObjectId.isValid(id)) return res.sendStatus(404)
        const updateComment = await this.commentService.updateComment(id, req.body.content, userId)
        switch (updateComment.code) {
            case ResultCode.NotFound:
                return res.sendStatus(404)
            case ResultCode.Forbidden:
                return res.sendStatus(403)
            case ResultCode.Success:
                return res.sendStatus(204)
            default:
                return res.sendStatus(404)
        }
    }

    async updateLikes(req: RequestWithParamsAndBody<ParamsType, { likeStatus: likesStatuses }>, res: Response) {

        let userId = req.userId!.toString()
        const commentId = req.params.id
        const likeStatus = req.body.likeStatus
        const updateLike = await this.commentService.updateLike(userId, commentId, likeStatus)
        switch (updateLike.code) {
            case ResultCode.NotFound:
                return res.sendStatus(404)
            case ResultCode.Forbidden:
                return res.sendStatus(403)
            case ResultCode.Success:
                return res.sendStatus(204)
            default:
                return res.sendStatus(404)
        }
    }

}

const commentController = container.resolve<CommentController>(CommentController)

commentsRoute.get('/:id',accessTokenGetId, commentController.getCommentById.bind(commentController))
commentsRoute.delete('/:id', accessTokenGuard, commentController.deleteCommentById.bind(commentController))
commentsRoute.put('/:id', accessTokenGuard, commentsValidation(), commentController.updateComment.bind(commentController))
commentsRoute.put('/:id/like-status', accessTokenGuard,likesValidators(), commentController.updateLikes.bind(commentController))