import { validate } from 'class-validator'
import { NextFunction, Request, Response } from 'express'
import { UpdateUserDTO, UserDTO } from '../DTO/user.dto'
import { IUser } from '../Interfaces/user.interfaces'
import { BaseMiddleware } from './base.middleware'

export class UserMiddleware extends BaseMiddleware {
  constructor() {
    super()
  }

  async checkUserIsUserOwner(req: Request, res: Response, next: NextFunction) {
    const user = req.user
    const id = Number(req.params.id)

    const user_found = await this.userService.find({ id })

    if (user.id === user_found?.id) {
      next()
    } else {
      return this.httpResponse.Unauthorized(res), 'Unauthorized.'
    }
  }

  registerValidator(req: Request, res: Response, next: NextFunction) {
    const { username, email, password }: IUser = req.body

    const valid = new UserDTO()

    valid.username = username
    valid.email = email
    valid.password = password!

    validate(valid, { validationError: { target: false } }).then(err => {
      if (err.length > 0) {
        return this.httpResponse.BadRequest(res, err)
      } else {
        next()
      }
    })
  }

  updateValidator(req: Request, res: Response, next: NextFunction) {
    const { username, email, password }: UpdateUserDTO = req.body

    const valid = new UpdateUserDTO()

    valid.username = username
    valid.email = email
    valid.password = password

    if (username || email || password) {
      validate(valid, { validationError: { target: false } }).then(err => {
        if (err.length > 0) {
          return this.httpResponse.BadRequest(res, err)
        } else {
          next()
        }
      })
    } else {
      return this.httpResponse.BadRequest(res, 'Need at least one value: username, email or password.')
    }
  }
}
