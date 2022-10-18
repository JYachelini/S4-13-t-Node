import { Request, Response } from 'express'
import { IUser } from '../Interfaces/user.interfaces'
import { UserService } from '../Services/user.service'
import { HttpResponse } from '../Utils/http.response'

export class UserController {
  constructor(
    private readonly userService: UserService = new UserService(),
    private readonly httpResponse: HttpResponse = new HttpResponse()
  ) {}

  async getByAccessToken(req: Request, res: Response) {
    try {
      const { id, username, role, email, avatar_url } = req.user as IUser
      return res.json({ id, username, role, email, avatar_url })
    } catch (error) {
      return this.httpResponse.Error(res, error)
    }
  }

  async create(req: Request, res: Response) {
    try {
      const user = req.body

      const user_exist = await this.userService.find({ username: user.username }, 'password')

      if (user_exist) {
        return this.httpResponse.BadRequest(res, { message: 'User already exist.' })
      }

      const email_exist = await this.userService.find({ email: user.email }, 'password')

      if (email_exist) {
        return this.httpResponse.BadRequest(res, { message: 'Email already exist.' })
      }

      const { email, id, username } = await this.userService.create(user)
      return this.httpResponse.Ok(res, { message: 'User Created Successfully.', user: { email, id, username } })
    } catch (error) {
      return this.httpResponse.Error(res, error)
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const { page = '1', size = '20', sort = 'desc' } = req.query
      const [users, total, last_page] = await this.userService.findAll(Number(page), Number(size), String(sort))
      return this.httpResponse.Ok(res, { users, actual_page: Number(page), size: Number(size), total, last_page })
    } catch (error) {
      return this.httpResponse.Error(res, error)
    }
  }

  async find(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)
      const user = await this.userService.find({ id })

      if (user) return this.httpResponse.Ok(res, { user })

      return this.httpResponse.NotFound(res, 'User not found.')
    } catch (error) {
      return this.httpResponse.Error(res, error)
    }
  }

  async findWithPosts(req: Request, res: Response) {
    try {
      const { page = '1', size = '20', sort = 'desc' } = req.query
      const id = Number(req.params.id)
      const user = await this.userService.findByIdWithPosts(id, Number(page), Number(size), String(sort))

      if (user)
        return this.httpResponse.Ok(res, {
          user,
          actual_page: Number(page),
          size: Number(size),
        })

      return this.httpResponse.NotFound(res, 'User not found.')
    } catch (error) {
      return this.httpResponse.Error(res, error)
    }
  }

  async findWithFavorites(req: Request, res: Response) {
    try {
      const { page = '1', size = '20', sort = 'desc' } = req.query
      const id = Number(req.params.id)
      const user = await this.userService.findByIdWithFavorites(id, Number(page), Number(size), String(sort))

      if (user) return this.httpResponse.Ok(res, { user, actual_page: Number(page), size: Number(page) })

      return this.httpResponse.NotFound(res, 'User not found.')
    } catch (error) {
      return this.httpResponse.Error(res, error)
    }
  }

  async findWithLikes(req: Request, res: Response) {
    try {
      const { page = '1', size = '20', sort = 'desc' } = req.query
      const id = Number(req.params.id)
      const user = await this.userService.findByIdWithLikes(id, Number(page), Number(size), String(sort))

      if (user) return this.httpResponse.Ok(res, { user, actual_page: Number(page), size: Number(page) })

      return this.httpResponse.NotFound(res, 'User not found.')
    } catch (error) {
      return this.httpResponse.Error(res, error)
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)
      const { username, email, password } = req.body

      const user_found = await this.userService.find({ username }, 'password')

      if (user_found) {
        return this.httpResponse.BadRequest(res, 'Username already exist.')
      }

      const email_found = await this.userService.find({ email }, 'password')

      if (email_found) {
        return this.httpResponse.BadRequest(res, 'Email already exist.')
      }

      const { user, error } = await this.userService.update({ id }, { username, email, password })
      if (error) {
        return this.httpResponse.NotFound(res, error)
      }
      return this.httpResponse.Ok(res, { message: 'User Updated Successfully.', user: user[0] })
    } catch (error) {
      return this.httpResponse.Error(res, error)
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const id = Number(req.params.id)
      const { user, error } = await this.userService.remove(id)
      if (error) {
        return this.httpResponse.NotFound(res, error)
      }
      return this.httpResponse.Ok(res, { message: 'User Deleted Successfully.', user: user[0] })
    } catch (error) {
      return this.httpResponse.Error(res, error)
    }
  }
}
