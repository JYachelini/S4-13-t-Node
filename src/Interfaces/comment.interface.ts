import { BaseDTO } from '../DTO/base.dto'
import { Post } from '../Entities/post.entity'
import { User } from '../Entities/user.entity'

export interface ICommentDTO extends BaseDTO {
  comment: string

  user?: User

  post?: Post
}

export interface IComment extends ICommentDTO {}
