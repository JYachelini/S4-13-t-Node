import * as bcrypt from 'bcryptjs'

export class BaseService {
  private async salt(salt: number = 10) {
    return await bcrypt.genSalt(salt)
  }

  async encrypt(toEncrypt: string, salt: number = 10) {
    return await bcrypt.hash(toEncrypt, await this.salt(salt))
  }

  async compare(toCompare: string, encrypt: string) {
    return await bcrypt.compare(toCompare, encrypt)
  }
}
