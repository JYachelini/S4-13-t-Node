import { Request } from 'express'
import { IUser } from '../../Interfaces/user.interfaces'

export {}

declare global {
  namespace Express {
    export interface Request {
      access_token: string | string[] | undefined
      refresh_token: string | string[] | undefined
      user_id: number
      user: IUser
    }
  }
}
