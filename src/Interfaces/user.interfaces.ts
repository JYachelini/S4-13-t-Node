import { Comment } from '../Entities/comment.entity'
import { Like } from '../Entities/like.entity'
import { IBaseDTO } from './base.interfaces'

export enum RoleTypes {
  USER = 'User',
  ADMIN = 'Admin',
}

export interface CreateUserDTO {
  username: string
  email?: string
  password?: string
  google_id?: string
  facebook_id?: string
  avatar_url?: string
}

export interface IUserDTO extends IBaseDTO {
  username: string
  avatar_url?: string
  role?: RoleTypes[]
  email: string
  likes?: Like[]
  comments?: Comment[]
}

export interface IUser extends IUserDTO {
  password: string | null
  refresh_token?: string | null
  actual_page?: number
  size?: number
  likesCount?: number
  sub?: number
}

export interface UpdateUser {
  avatar_url?: string
  username?: string
  email?: string
  password?: string
  refresh_token?: string | null
}
