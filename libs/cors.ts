// lib/cors.ts
import { NextResponse } from "next/server";

export function withCorsHandler(handler: (req: Request) => Promise<NextResponse>) {
  return async (req: Request): Promise<NextResponse> => {
    if (req.method === "OPTIONS") {
      const res = new NextResponse(null, { status: 204 });
      res.headers.set("Access-Control-Allow-Origin", "*");
      res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      return res;
    }

    const res = await handler(req);
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res;
  };
}

export function withCors() {
  return (handler: (req: Request) => Promise<NextResponse>) => {
    return withCorsHandler(handler);
  };
}
