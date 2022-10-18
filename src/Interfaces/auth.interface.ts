import { RoleTypes } from './user.interfaces'

export interface PayloadToken {
  role: RoleTypes[]
  sub: any
}
