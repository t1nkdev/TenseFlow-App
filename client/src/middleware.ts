import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const DOMAIN = process.env.NODE_ENV === 'development' ? 'localhost:3000' : 'yourdomain.com'

const SUBDOMAIN_CONFIG = {
  'accounts': {
    defaultRoute: '/auth/sign-in',
    allowedPaths: ['/auth'],
  },
  'app': {
    defaultRoute: '/main/dashboard',
    allowedPaths: ['/main', '/admin'],
  }
} as const

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host')
  const subdomain = hostname?.split('.')[0]
  
  // Only allow specific subdomains
  if (!hostname || !subdomain || !Object.keys(SUBDOMAIN_CONFIG).includes(subdomain)) {
    return new NextResponse('Access denied', {
      status: 403,
      statusText: 'Forbidden',
      headers: {
        'Content-Type': 'text/plain',
      }
    })
  }

  const path = request.nextUrl.pathname
  const config = SUBDOMAIN_CONFIG[subdomain as keyof typeof SUBDOMAIN_CONFIG]
  
  // Redirect root to default route for subdomain
  if (path === '/') {
    const url = request.nextUrl.clone()
    url.pathname = config.defaultRoute
    return NextResponse.rewrite(url)
  }

  // Check if path is allowed for this subdomain
  const isAllowedPath = config.allowedPaths.some(allowedPath => 
    path.startsWith(allowedPath)
  )

  if (!isAllowedPath) {
    // Redirect to appropriate subdomain
    const targetSubdomain = path.startsWith('/auth') ? 'accounts' : 'app'
    if (targetSubdomain !== subdomain) {
      const url = request.nextUrl.clone()
      url.host = `${targetSubdomain}.${hostname.split('.').slice(1).join('.')}`
      return NextResponse.redirect(url)
    }
    
    return new NextResponse('Access denied', {
      status: 403,
      statusText: 'Forbidden',
    })
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 