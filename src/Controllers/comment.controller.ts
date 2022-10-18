import { Request, Response } from 'express'
import { ConfigServer } from '../Config/config'
import { IUser } from '../Interfaces/user.interfaces'
import { CommentService } from '../Services/comment.service'
import { PostService } from '../Services/post.service'
import { HttpResponse } from '../Utils/http.response'

export class CommentController extends ConfigServer {
  constructor(
    private readonly commentService: CommentService = new CommentService(),
    private readonly httpResponse: HttpResponse = new HttpResponse(),
    private readonly postService: PostService = new PostService()
  ) {
    super()
  }

  async deleteComment(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)
      const { comment, error } = await this.commentService.delete({ id })

      if (error) return this.httpResponse.BadRequest(res, error)

      const post = await this.postService.find({ id: comment[0].post_id })
      await this.postService.update({ id: comment[0].post_id }, { commentsCount: post?.commentsCount! - 1 })
      return this.httpResponse.Ok(res, comment[0])
    } catch (error) {
      return this.httpResponse.Error(res, error)
    }
  }

  async replyComment(req: Request, res: Response) {
    try {
      const user = req.user as IUser
      const id = Number(req.params.id)
      const { reply } = req.body
      const response = await this.commentService.replyComment({ user: user.id, comment: id, reply })
      if (response.error) return this.httpResponse.BadRequest(res, response.error)

      return this.httpResponse.Ok(res, { ...response })
    } catch (error) {
      return this.httpResponse.Error(res, error)
    }
  }
}
