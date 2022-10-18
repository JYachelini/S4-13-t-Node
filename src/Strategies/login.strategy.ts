import { IUser } from '../Interfaces/user.interfaces'
import { AuthService } from '../Services/auth.service'
import { PassportUse } from '../Utils/passport.use'
import { Strategy as LocalStrategy, VerifyFunction } from 'passport-local'

const authService: AuthService = new AuthService()

export class LoginStrategy {
  async validate(username: string, password: string, done: any): Promise<IUser> {
    const user = await authService.validateUser(username, password)
    if (!user) {
      return done(null, false, { message: 'Invalid username or password' })
    }

    return done(null, user)
  }

  get use() {
    return PassportUse<LocalStrategy, Object, VerifyFunction>(
      'login',
      LocalStrategy,
      { usernameField: 'username', passwordField: 'password' },
      this.validate
    )
  }
}
