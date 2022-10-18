import { Post } from '../Entities/post.entity'
import { User } from '../Entities/user.entity'
import { IBaseDTO } from './base.interfaces'

export interface ILikeDTO extends IBaseDTO {
  user: User
  post: Post
}

export interface ILike extends ILikeDTO {}
