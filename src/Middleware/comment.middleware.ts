import { NextFunction, Request, Response } from 'express'
import { RequestUser } from '../Interfaces/user.interfaces'
import { CommentService } from '../Services/comment.service'
import { BaseMiddleware } from './base.middleware'

export class CommentMiddleware extends BaseMiddleware {
  constructor(private readonly commentService: CommentService = new CommentService()) {
    super()
  }

  async checkUserIsCommentOwner(req: Request, res: Response, next: NextFunction) {
    const user = req.user as RequestUser
    const id = Number(req.params.id)

    const comment = await this.commentService.findWithUser({ id })
    if (!comment) return this.httpResponse.BadRequest(res, 'Comment not found.')

    if (user.id === comment?.user?.id) {
      next()
    } else {
      return this.httpResponse.Unauthorized(res, 'Unauthorized')
    }
  }
}
