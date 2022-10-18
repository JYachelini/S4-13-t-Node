import { Request, Response } from 'express'
import { IUser } from '../Interfaces/user.interfaces'
import { AuthService } from '../Services/auth.service'
import { HttpResponse } from '../Utils/http.response'

export class AuthController extends AuthService {
  constructor(private readonly httpResponse: HttpResponse = new HttpResponse()) {
    super()
  }

  async login(req: Request, res: Response) {
    try {
      const userEncode = req.user as IUser

      const encode = await this.generateJWT(userEncode)

      if (!encode) {
        return this.httpResponse.Unauthorized(res, 'No permissions.')
      }

      res.header('Content-Type', 'application/json')
      res.cookie('access_token', encode.access_token, { maxAge: 60000 * 15 })
      res.cookie('refresh_token', encode.refresh_token, { maxAge: 60000 * 86400 })
      res.write(JSON.stringify(encode))
      res.end()
    } catch (error) {
      console.error(error)
      return this.httpResponse.Error(res, error)
    }
  }

  async loginSocialMedial(req: Request, res: Response) {
    try {
      const userEncode = req.user as IUser

      const encode = await this.generateJWT(userEncode)

      if (!encode) {
        return this.httpResponse.Unauthorized(res, 'No permissions.')
      }

      res.header('Content-Type', 'application/json')
      res.cookie('access_token', encode.access_token, { maxAge: 60000 * 15 })
      res.cookie('refresh_token', encode.refresh_token, { maxAge: 60000 * 86400 })
      if (this.NODE_ENV == 'prod') {
        res.redirect('https://s413t.vercel.app/')
      } else {
        res.redirect('http://localhost:3000/')
        // res.write(JSON.stringify(encode))
        // res.end()
      }
    } catch (error) {
      return this.httpResponse.Error(res, error)
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const refresh_token = req.refresh_token as string
      const user = req.user as IUser

      const response = await this.compareRefreshToken(refresh_token, user.id)

      if (!response) return this.httpResponse.Unauthorized(res, 'Unauthorized.')

      return this.httpResponse.Ok(res, { ...response })
    } catch (error) {
      return this.httpResponse.Error(res, error)
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const user = req.user as IUser
      const id = user.id
      const response = await this.userService.update({ id }, { refresh_token: null })
      if (response.error) return this.httpResponse.NotFound(res, response.error)

      return this.httpResponse.Ok(res, 'Logout successfully.')
    } catch (error) {
      console.error(error)
      return this.httpResponse.Error(res, error)
    }
  }
}
