import { NextResponse } from "next/server"

class HTTPError extends Error {
  private _statusCode: number
  constructor(message: string, code: number) {
    super(message)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HTTPError)
    }
    this._statusCode = code
  }

  public toString() {
    return `Request Error: ${this._statusCode} ${this.message}`
  }

  public get statusCode() {
    return this._statusCode
  }
}

export default HTTPError

export const isError = (error: any): error is Error => (error instanceof Error)
export const isHTTPError = (error: any): error is HTTPError => (error instanceof HTTPError)

export type ErrorResponse = {
  errMsg: string | object
  error?: Error | object
  code: number
}

export const errorReturn = (errMsg: string | object, status = 400, code?: number): ErrorResponse => {
  if (typeof errMsg === "object") {
    return {
      errMsg: isError(errMsg) ? errMsg.message : 'error',
      error: errMsg,
      code: code || status
    }
  }
  return { errMsg, code: code || status }
}

export const errorResponse = (errMsg: string | object, status = 400, code?: number): NextResponse<ErrorResponse> => {
  if (typeof errMsg === "object") {
    return NextResponse.json({
      errMsg: isError(errMsg) ? errMsg.message : 'error',
      error: errMsg,
      code: code || status
    }, { status: status })
  }
  return NextResponse.json({ errMsg, code: code || status }, { status: status })
}