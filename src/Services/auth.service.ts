import * as jwt from 'jsonwebtoken'
import { ConfigServer } from '../Config/config'
import { UserService } from './user.service'
import { BaseService } from './base.service'
import { IUser } from '../Interfaces/user.interfaces'
import { LoginSocialMedia, PayloadToken } from '../Interfaces/auth.interface'

export class AuthService extends ConfigServer {
  constructor(
    protected readonly userService: UserService = new UserService(),
    private readonly jwtInstance = jwt,
    private readonly baseService: BaseService = new BaseService()
  ) {
    super()
  }

  public async validateUser(username: string, password: string): Promise<IUser | null> {
    const userByUsername = await this.userService.find({ username }, 'password')

    if (userByUsername) {
      const isMatch = await this.baseService.compare(password, userByUsername.password!)
      if (isMatch) {
        return userByUsername
      }
    }

    const userByEmail = await this.userService.find({ email: username }, 'password')

    if (userByEmail) {
      const isMatch = await this.baseService.compare(password, userByEmail.password!)
      if (isMatch) {
        return userByEmail
      }
    }

    return null
  }

  async validateSocialMedia(data: LoginSocialMedia): Promise<IUser> {
    const { email, family_name, given_name, picture, sub } = data
    const user_found = await this.userService.find({ email })
    if (user_found) return user_found

    return await this.userService.create({
      google_id: sub,
      email,
      username: `${given_name}.${family_name}.${sub}`,
      avatar_url: picture,
    })
  }

  private sing(payload: jwt.JwtPayload, jwt_secret: any, expiresIn: string) {
    return this.jwtInstance.sign(payload, jwt_secret, { expiresIn })
  }

  protected async generateJWT(user: IUser): Promise<{ access_token: string; refresh_token: string; user: IUser }> {
    const userConsult = await this.userService.findByIdWithRole(user.id, user.role!)

    const payload: PayloadToken = {
      role: userConsult!.role!,
      sub: userConsult!.id,
    }

    if (userConsult) {
      user.password = 'No permission.'
      user.refresh_token = 'No permission.'
    }

    const access_token = this.sing(payload, this.getEnvironment('JWT_SECRET'), '15m')
    const refresh_token = this.sing(payload, this.getEnvironment('JWT_REFRESH_SECRET'), '60d')

    await this.updateRefreshTokenUser(refresh_token, userConsult!.id)

    return {
      access_token,
      refresh_token,
      user,
    }
  }

  private async updateRefreshTokenUser(refresh_token: string, id: number) {
    const hash = await this.baseService.encrypt(refresh_token)
    await this.userService.update({ id }, { refresh_token: hash })
  }

  protected async compareRefreshToken(
    refresh_token: string,
    id: number
  ): Promise<{ access_token: string; refresh_token: string; user: IUser } | false> {
    const user = await this.userService.find({ id }, 'refresh_token')
    if (!user || !user.refresh_token) return false

    const isMatch = await this.baseService.compare(refresh_token, user?.refresh_token!)

    if (!isMatch) return false

    const encode = await this.generateJWT(user)

    await this.userService.update({ id: user.id }, { refresh_token: encode.refresh_token })

    return encode
  }
}
