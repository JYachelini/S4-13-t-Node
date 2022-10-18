import { CommentController } from '../Controllers/comment.controller'
import { CommentMiddleware } from '../Middleware/comment.middleware'
import { BaseRouter } from './base.routes'

export class CommentRouter extends BaseRouter<CommentController, CommentMiddleware> {
  constructor() {
    super(CommentController, CommentMiddleware)
  }

  routes(): void {
    this.router.delete(
      '/comment/:id',
      this.middleware.passAuth('jwt', { session: false }),
      (req, res, next) => this.middleware.getAccessToken(req, res, next),
      (req, res, next) => this.middleware.checkUserIsCommentOwner(req, res, next),
      (req, res) => this.controller.deleteComment(req, res)
    )

    this.router.post(
      '/comment/:id/reply',
      this.middleware.passAuth('jwt', { session: false }),
      (req, res, next) => this.middleware.getAccessToken(req, res, next),
      (req, res, next) => this.middleware.replyCommentValidator(req, res, next),
      (req, res) => this.controller.replyComment(req, res)
    )
  }
}
