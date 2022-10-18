import { PassportUse } from '../Utils/passport.use'
import { Strategy as GoogleStr, StrategyOptionsWithRequest, VerifyFunctionWithRequest } from 'passport-google-oauth2'
import { AuthService } from '../Services/auth.service'
import { Request } from 'express'
import { VerifyCallback } from 'jsonwebtoken'
import { UserService } from '../Services/user.service'

const userService: UserService = new UserService()

export class GoogleStrategy extends AuthService {
  async validate(req: Request, accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    const { email, displayName, id, picture = 'https://loremflickr.com/640/480/cats' } = profile
    const user_found = await userService.find({ email })

    if (user_found) {
      req.user = user_found
      return done(null, user_found)
    } else {
      const user = await userService.create({
        google_id: id,
        email,
        username: `${displayName.replace(/ /g, '.')}.${id}`,
        avatar_url: picture,
      })
      req.user = user
      return done(null, user)
    }
  }

  get use() {
    return PassportUse<GoogleStr, StrategyOptionsWithRequest, VerifyFunctionWithRequest>(
      'google',
      GoogleStr,
      {
        clientID: this.getEnvironment('GOOGLE_CLIENT_ID')!,
        clientSecret: this.getEnvironment('GOOGLE_CLIENT_SECRET')!,
        callbackURL: 'http://localhost:8080/login/google/callback',
        passReqToCallback: true,
      },
      this.validate
    )
  }
}
