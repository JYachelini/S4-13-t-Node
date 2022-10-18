import { NextFunction, Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import passport, { AuthenticateOptions } from 'passport'
import { RequestUser, RoleTypes } from '../Interfaces/user.interfaces'
import { HttpResponse } from '../Utils/http.response'
import { PostService } from '../Services/post.service'
import { UserService } from '../Services/user.service'
import { ConfigServer } from '../Config/config'
import { CommentService } from '../Services/comment.service'

export class BaseMiddleware extends ConfigServer {
  constructor(
    public httpResponse: HttpResponse = new HttpResponse(),
    protected readonly userService: UserService = new UserService()
  ) {
    super()
  }

  passAuth(type: string, callback: AuthenticateOptions) {
    return passport.authenticate(type, callback)
  }

  checkAdminRole(req: Request, res: Response, next: NextFunction) {
    const user = req.user as RequestUser

    if (!user.role!.includes(RoleTypes.ADMIN)) {
      return this.httpResponse.Unauthorized(res, 'No permissions.')
    }

    return next()
  }

  async getAccessToken(req: Request, res: Response, next: NextFunction) {
    const token = String(req.headers['access_token'])

    if (!token) return this.httpResponse.Unauthorized(res, 'No access token provided.')
    const decoded = jwt.verify(token, this.getEnvironment('JWT_SECRET')!)
    const id = Number(decoded.sub)

    const user = await this.userService.find({ id })
    if (!user) return this.httpResponse.BadRequest(res, 'No user found.')

    req.user = user
    req.access_token = token

    next()
  }

  async getRefreshToken(req: Request, res: Response, next: NextFunction) {
    const token = String(req.headers['refresh_token'])

    if (!token) return this.httpResponse.Unauthorized(res, 'No refresh token provided.')

    const decoded = jwt.verify(token, this.getEnvironment('JWT_REFRESH_SECRET')!)
    const id = Number(decoded.sub)

    const user = await this.userService.find({ id })
    if (!user) return this.httpResponse.BadRequest(res, 'No user found.')

    req.user = user

    req.refresh_token = token

    next()
  }
}
