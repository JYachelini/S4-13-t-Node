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
      .get('/login/google', this.middleware.passAuth('google', { session: false, scope: ['email', 'profile'] }))
      .get(
        '/login/google/callback',
        this.middleware.passAuth('google', {
          session: false,
          // successRedirect: 'http://localhost:3000',
          failureRedirect: '/login/failure',
        }),
        (req, res) => {
          this.controller.loginSocialMedial(req, res)
        }
      )
      // .get('/login/google/success', (req, res) => this.controller.loginSocialMedial(req, res))
      .get(
        '/login/facebook',
        this.middleware.passAuth('facebook', { session: false, scope: ['email', 'user_location'] })
      )
      .get(
        '/login/facebook/callback',
        this.middleware.passAuth('facebook', { session: false, failureRedirect: '/login/failure' }),
        (req, res) => {
          this.controller.loginSocialMedial(req, res)
        }
      )
      .get('/login/failure', (req, res) => {
        this.httpResponse.BadRequest(res, 'Something went wrong.')
      })
    // .post('/login/google', (req, res) => {
    //   console.log(req)
    //   console.log(req.body)
    //   res.json({ a: 'a' })
    // })
  }
}
