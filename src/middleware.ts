import logger from "@/lib/logger"
import { errorResponse } from "@/lib/request/HTTPError"
import { NextRequest, NextResponse } from "next/server"

const ROUTES_CONFIG = {
  /** Public Page Routes */
  public_page_routes: [
    "/",
    "/draw",
    "/support",
    "/signin",
    "/signup",
    "/signout",
    "/auth_callback",
    "/test/*",
    "/not-found",
  ],
  /** Public API Routes */
  public_api_routes: [
    "/api/test",
  ],
  /** Static Files Configure */
  ignore_static_paths: /^\/.*\.(ico|png|jpg|jpeg|svg|webp|gif)$/g
}

const isPublicRoute = (pathname = "") => {
  // Check API
  const apiRoute = ROUTES_CONFIG.public_api_routes.find(route => {
    if (route === pathname) return true
    if (route.endsWith("/*")) return pathname.startsWith(route.slice(0, -2))
  })
  if (apiRoute) return true

  // Check Page
  const pageRoute = ROUTES_CONFIG.public_page_routes.find(route => {
    if (route === pathname) return true
    if (route.endsWith("/*")) return pathname.startsWith(route.slice(0, -2))
  })
  if (pageRoute) return true

  return false
}

const ALLOWED_ORIGINS: string[] = []
const CORS_OPTS = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  console.log("MIDDLEWARE", path)
  // ignore static files
  if (path.match(ROUTES_CONFIG.ignore_static_paths)) return NextResponse.next()
  const origin = req.headers.get('host') ?? ''
  const isOriginAllowed = ALLOWED_ORIGINS.includes(origin)

  // Handle preflighted requests (CORS)
  if (req.method === 'OPTIONS') {
    return NextResponse.json({}, {
      headers: {
        ...(isOriginAllowed && { 'Access-Control-Allow-Origin': origin }),
        ...CORS_OPTS,
      }
    })
  }

  const isApiRoute = path.startsWith("/api/")
  logger.log(`\x1b[33m[Middleware${isApiRoute ? '(api)' : '(page)'}]\x1b[33m`, path)

  const headers = new Headers(req.headers)
  headers.set("x-url", req.url)
  headers.set("x-host", req.nextUrl.host)
  headers.set("x-path-name", req.nextUrl.pathname)
  if (isOriginAllowed) headers.set('Access-Control-Allow-Origin', origin)

  const response = NextResponse.next({ request: { headers } })

  if (isPublicRoute(path)) return response
  const next = new URL(`/signin?next=${encodeURIComponent(path + req.nextUrl.search)}`, req.url)
  return isApiRoute ? errorResponse("Unauthorized", 401) : NextResponse.redirect(next)
}

// Add your protected routes
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|fonts|opengraph-image*|robots.txt|sitemap.xml|manifest.webmanifest).*)",
  ],
}
