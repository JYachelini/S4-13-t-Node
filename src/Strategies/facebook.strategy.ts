import { AuthService } from '../Services/auth.service'
import { PassportUse } from '../Utils/passport.use'
import {
  Strategy as FacebookStr,
  VerifyFunctionWithRequest,
  StrategyOptionWithRequest,
  Profile,
} from 'passport-facebook'
import { Request } from 'express'
import { UserService } from '../Services/user.service'

const userService: UserService = new UserService()

export class FacebookStrategy extends AuthService {
  async validate(req: Request, accesToken: string, refreshToken: string, profile: Profile, done: any) {
    const { name, id, email, picture } = profile._json
    const user_found = await userService.find({ facebook_id: id })

    if (user_found) {
      req.user = user_found
      return done(null, user_found)
    } else {
      const user = await userService.create({
        facebook_id: id,
        email,
        username: `${name.replace(/ /g, '.')}.${id}`,
        avatar_url: picture.data.url,
      })
      req.user = user
      return done(null, user)
    }
  }

  get use() {
    return PassportUse<FacebookStr, StrategyOptionWithRequest, VerifyFunctionWithRequest>(
      'facebook',
      FacebookStr,
      {
        clientID: this.getEnvironment('FACEBOOK_APP_ID')!,
        clientSecret: this.getEnvironment('FACEBOOK_APP_SECRET')!,
        callbackURL:
          this.NODE_ENV == 'prod'
            ? 'https://s4-13-t-node-production.up.railway.app/login/facebook/callback'
            : 'http://localhost:8080/login/facebook/callback',
        // callbackURL: 'http://localhost:8080/login/facebook/callback',
        passReqToCallback: true,
        profileFields: ['id', 'displayName', 'email', 'photos'],
      },
      this.validate
    )
  }
}
