import 'reflect-metadata'
import { Server } from './app'

const main = async () => {
  try {
    new Server()
  } catch (err) {
    console.error(err)
  }
}

main()
