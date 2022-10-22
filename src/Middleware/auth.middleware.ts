import { NextFunction, Request, Response } from 'express'
import { AuthService } from '../Services/auth.service'
import { BaseMiddleware } from './base.middleware'

export class AuthMiddleware extends BaseMiddleware {
  constructor(private readonly authService: AuthService = new AuthService()) {
    super()
  }

  async validate(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body
    if (!username || !password) return this.httpResponse.BadRequest(res, 'Invalid body.')

    const user = await this.authService.validateUser(username, password)
    if (!user) return this.httpResponse.BadRequest(res, 'Invalid credentials.')

    req.user = user
    next()
  }
}
