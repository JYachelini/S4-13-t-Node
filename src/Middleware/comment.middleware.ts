import { validate } from 'class-validator'
import { NextFunction, Request, Response } from 'express'
import { ReplyDTO } from '../DTO/reply.dto'
import { IReply } from '../Interfaces/reply.interface'
import { CommentService } from '../Services/comment.service'
import { BaseMiddleware } from './base.middleware'

export class CommentMiddleware extends BaseMiddleware {
  constructor(private readonly commentService: CommentService = new CommentService()) {
    super()
  }

  async checkUserIsCommentOwner(req: Request, res: Response, next: NextFunction) {
    const user = req.user
    const id = Number(req.params.id)

    const comment = await this.commentService.findWithUser({ id })
    if (!comment) return this.httpResponse.BadRequest(res, 'Comment not found.')

    if (user.id === comment?.user?.id) {
      next()
    } else {
      return this.httpResponse.Unauthorized(res, 'Unauthorized')
    }
  }

  replyCommentValidator(req: Request, res: Response, next: NextFunction) {
    const { reply }: IReply = req.body

    const valid = new ReplyDTO()

    valid.reply = reply

    validate(valid, { validationError: { target: false } }).then(err => {
      if (err.length > 0) {
        return this.httpResponse.BadRequest(res, err)
      } else {
        next()
      }
    })
  }
}
