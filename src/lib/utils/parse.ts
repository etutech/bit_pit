import { z, ZodObject } from "zod"

export const parseQuery = <T = Record<string, string>>(url: string) => {
  const { searchParams } = new URL(url)
  return Object.fromEntries(searchParams.entries()) as T
}

const parseEntries = <T = Record<string, string>>(searchParams: URLSearchParams | FormData) => {
  return Object.fromEntries(searchParams.entries()) as T
}

export type ParseError = {
  [x: string]: string[];
  [x: number]: string[];
  [x: symbol]: string[];
}

export const parseBySchema = <Value extends ZodObject<any>, T extends z.infer<Value>>
  (args: Record<string, any>, schema: Value) => {
  const parsed = schema.safeParse(args)
  if (parsed.success) {
    return { data: parsed.data as T }
  } else if (parsed.error) {
    const { fieldErrors } = parsed.error.flatten()
    return { error: fieldErrors, data: args as T }
  }
}

export const parseEntriesBySchema = <Value extends ZodObject<any>, T extends z.infer<Value>>
  (searchParams: URLSearchParams | FormData, schema: Value) => {
  return parseBySchema<Value, T>(parseEntries(searchParams), schema)
}

export const parseUrlBySchema = <Value extends ZodObject<any>, T extends z.infer<Value>>(url = '', schema: Value) => {
  const query = parseQuery(url)
  const { data, error } = parseBySchema(query, schema)
  if (error) return { error, data: data as T }
  return { data: data as T }
}


