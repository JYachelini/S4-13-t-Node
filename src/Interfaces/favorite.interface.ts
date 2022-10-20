import { BaseDTO } from '../DTO/base.dto'
import { Post } from '../Entities/post.entity'
import { User } from '../Entities/user.entity'

export interface IFavoriteDTO extends BaseDTO {
  user: User
  userId: number
  post: Post
  postId: number
}

export interface IFavorite extends IFavoriteDTO {}
