import { Response } from 'express'

export enum HttpStatus {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHROIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export class HttpResponse {
  Ok(res: Response, data?: any): Response {
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      statusMsg: 'Success.',
      data: data,
    })
  }

  NotFound(res: Response, data?: any): Response {
    return res.status(HttpStatus.NOT_FOUND).json({
      status: HttpStatus.NOT_FOUND,
      statusMsg: 'Not Found.',
      error: data,
    })
  }

  Unauthorized(res: Response, data?: any): Response {
    return res.status(HttpStatus.UNAUTHROIZED).json({
      status: HttpStatus.UNAUTHROIZED,
      statusMsg: 'Unauthorized.',
      error: data,
    })
  }

  Forbidden(res: Response, data?: any): Response {
    return res.status(HttpStatus.FORBIDDEN).json({
      status: HttpStatus.FORBIDDEN,
      statusMsg: 'Forbidden resource.',
      error: data,
    })
  }

  BadRequest(res: Response, data?: any): Response {
    return res.status(HttpStatus.BAD_REQUEST).json({
      status: HttpStatus.BAD_REQUEST,
      statusMsg: 'Bad request.',
      error: data,
    })
  }

  Error(res: Response, data?: any): Response {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      statusMsg: 'Internal Server Error.',
      error: data,
    })
  }
}

// export default new HttpResponse()
