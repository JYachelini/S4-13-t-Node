import { Request, Response } from 'express'
import { AuthController } from '../Controllers/auth.controller'
import { BaseMiddleware } from '../Middleware/base.middleware'
import { HttpResponse } from '../Utils/http.response'
import { BaseRouter } from './base.routes'

export class AuthRouter extends BaseRouter<AuthController, BaseMiddleware> {
  constructor(private readonly httpResponse: HttpResponse = new HttpResponse()) {
    super(AuthController, BaseMiddleware)
  }

  routes(): void {
    this.router
      .post('/login', this.middleware.passAuth('login', { session: false }), (req: Request, res: Response) =>
        this.controller.login(req, res)
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
