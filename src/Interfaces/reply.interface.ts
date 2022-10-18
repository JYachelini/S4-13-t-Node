import { BaseDTO } from '../DTO/base.dto'
import { Comment } from '../Entities/comment.entity'
import { User } from '../Entities/user.entity'

export interface IReplyDTO extends BaseDTO {
  reply: string

  user?: User

  comment?: Comment
}

export interface IReply extends IReplyDTO {}
