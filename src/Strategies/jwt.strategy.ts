import { PayloadToken } from '../Interfaces/auth.interface'
import { AuthService } from '../Services/auth.service'
import { PassportUse } from '../Utils/passport.use'
import { ExtractJwt, Strategy as JwtStr, StrategyOptions } from 'passport-jwt'

export class JwtStrategy extends AuthService {
  constructor() {
    super()
  }

  async validate(payloadToken: PayloadToken, done: any) {
    return done(null, payloadToken)
  }

  get use() {
    return PassportUse<JwtStr, StrategyOptions, (payload: PayloadToken, done: any) => Promise<PayloadToken>>(
      'jwt',
      JwtStr,
      { jwtFromRequest: ExtractJwt.fromHeader('access_token'), secretOrKey: this.getEnvironment('JWT_SECRET') },
      this.validate
    )
  }
}
