import { Request, Response } from 'express'
import { AuthController } from '../Controllers/auth.controller'
import { AuthMiddleware } from '../Middleware/auth.middleware'
import { BaseRouter } from './base.routes'

export class AuthRouter extends BaseRouter<AuthController, AuthMiddleware> {
  constructor() {
    super(AuthController, AuthMiddleware)
  }

  routes(): void {
    this.router
      .post(
        '/login',
        (req, res, next) => this.middleware.validate(req, res, next),
        (req: Request, res: Response) => this.controller.login(req, res)
      )
      .post(
        '/refresh',
        (req, res, next) => this.middleware.getRefreshToken(req, res, next),
        (req, res) => this.controller.refresh(req, res)
      )
      .post(
        '/logout',
        (req, res, next) => this.middleware.getAccessToken(req, res, next),
        (req, res) => this.controller.logout(req, res)
      )
      .post('/login/social', (req, res) => this.controller.loginSocialMedia(req, res))
  }
}
