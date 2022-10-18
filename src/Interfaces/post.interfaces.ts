import { Like } from '../Entities/like.entity'
import { User } from '../Entities/user.entity'
import { IBaseDTO } from './base.interfaces'

export interface IPostDTO extends IBaseDTO {
  title: string
  tags: string[]
  media_url: string
  user?: User
}

export interface IPost extends IPostDTO {
  likesCount: number
  commentsCount: number
  likes?: Like[]
}

export interface UpdatePost {
  title?: string
  tags?: string[]
  likesCount?: number
  commentsCount?: number
}
