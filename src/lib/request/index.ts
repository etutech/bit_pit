import logger from "../logger"
import { isError } from "./HTTPError"
import initRequest, { generateUrl, processResponse, RequestOptions } from './initRequest'


export const callMethod = (method: string) => {
  return async <T = any>(url: string, options: RequestOptions = {}) => {
    let response: Response
    const { silent } = options
    try {
      response = await fetch(generateUrl(url, options.params), { method, ...initRequest(options) })
    } catch (fetchError) {
      const errMsg = `API call error: ${isError(fetchError) ? fetchError.message : ''}`
      logger.error(fetchError)
      if (silent) return { error: errMsg, data: null as any as T, response }
      throw new Error(errMsg)
    }
    try {
      const resp = await processResponse<T>(response, options)
      return { ...resp, error: '' }
    } catch (processError) {
      logger.error(processError)
      const errMsg = `API get response error: ${isError(processError) ? processError.message : ''}`
      if (silent) return { error: errMsg, data: null as any as T, response }
      throw new Error(errMsg)
    }
  }
}

const request = {
  get: callMethod('GET'),
  post: callMethod('POST'),
  put: callMethod('PUT'),
  patch: callMethod('PATCH'),
  delete: callMethod('DELETE')
}
export default request
