import { Post } from '../Entities/post.entity'
import { User } from '../Entities/user.entity'
import { IBaseDTO } from './base.interfaces'

export interface ILikeDTO extends IBaseDTO {
  user: User
  userId: number
  post: Post
  postId: number
}

export interface ILike extends ILikeDTO {}
