import HTTPError from "./HTTPError"

const _parseCookie = (cookie: string = '') => {
  if (!cookie) return {}
  const parsedItems: { [key: string]: string } = {}
  const cookiesItems = cookie.split(';')
  cookiesItems.forEach(cookies => {
    const parsedItem = cookies.split('=')
    if (!parsedItem[0] || typeof parsedItem[1] !== 'string') return
    const value = parsedItem[1].trim()
    if (value) {
      parsedItems[parsedItem[0].trim()] = decodeURIComponent(value)
    }
  })
  return parsedItems
}
const _getCustomHeaders = (_cookies = '') => {
  if (!_cookies) return {}
  const _headers: Record<string, string> = {}
  const cookies = _parseCookie(_cookies)
  const session = cookies['session']
  if (session) {
    _headers['Authorization'] = `Bearer ${session}`
  }
  return _headers
}

export interface RequestOptions extends RequestInit {
  getResponse?: boolean
  params?: object | URLSearchParams
  data?: object
  dataType?: 'json' | 'text'
  silent?: boolean
}

export const generateUrl = (url: string, params?: any) => {
  const u = new URL(
    url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000'}${url}`
  )
  if (params) {
    Object.keys(params).forEach(key => {
      if (typeof params[key] !== 'undefined') u.searchParams.append(key, params[key])
    })
  }
  return u.toString()
}

const initRequest = (rest: RequestOptions = {}) => {
  rest.dataType = rest.dataType || 'json'
  rest.headers = {
    'Content-Type': 'application/json',
    'Timezone-Offset': (-(new Date().getTimezoneOffset() / 60)).toString(),
    ...rest.headers
  }
  delete rest.params
  delete rest.silent
  if (rest.data) {
    rest.body = JSON.stringify(rest.data)
    delete rest.data
  }
  return rest
}

export default initRequest

export const processResponse = async <T = any>(response: Response, options: RequestOptions) => {
  let resp: any = {}
  try {
    resp = options.dataType === 'json' ? await response.json() : await response.text()
  } catch (_e) {
    throw new HTTPError('parse response error', 500)
  }

  // Error handler
  if (response.status && response.status >= 400) {
    const errMsg = resp.errMsg || resp.message || resp.msg || response.statusText
    // 401 退出
    if (response.status === 401) {
      console.info(`API call error: ${errMsg} ${response.url}`)
      if (typeof window !== 'undefined') {
        // alert('call failure: 401')
        // window.location.href = '/login'
      }
      return
    }
    throw new HTTPError(errMsg, response.status)
  }

  if (options.getResponse) return { response, data: resp as T }

  return { data: resp as T }
}