import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get("authorization")

  if (basicAuth) {
    const [scheme, encoded] = basicAuth.split(" ")
    if (scheme === "Basic" && encoded) {
      const decoded = Buffer.from(encoded, "base64").toString("utf-8")
      const [user, password] = decoded.split(":")
      if (
        user === process.env.BASIC_AUTH_USER &&
        password === process.env.BASIC_AUTH_PASSWORD
      ) {
        return NextResponse.next()
      }
    }
  }

  return new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Koe"',
    },
  })
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
