import { RoleTypes } from './user.interfaces'

export interface PayloadToken {
  role: RoleTypes[]
  sub: any
}

export interface LoginSocialMedia {
  email: string
  given_name: string
  family_name: string
  sub: string
  picture: string
}
