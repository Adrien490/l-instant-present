import type { auth } from "@/lib/auth";
import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";

type Session = typeof auth.$Infer.Session;

const protectedRoutes = ["/app"];
const publicOnlyRoutes = ["/login"];
const publicApiRoutes = ["/api/webhook/stripe", "/api"];

export default async function middleware(request: NextRequest) {
	try {
		const { data: session } = await betterFetch<Session>(
			"/api/auth/get-session",
			{
				baseURL: request.nextUrl.origin,
				headers: Object.fromEntries(request.headers.entries()),
			}
		);

		const { nextUrl } = request;
		const isLoggedIn = !!session;

		if (publicApiRoutes.some((route) => nextUrl.pathname.startsWith(route))) {
			return NextResponse.next();
		}

		if (
			isLoggedIn &&
			publicOnlyRoutes.some((route) => nextUrl.pathname.startsWith(route))
		) {
			return Response.redirect(new URL("/app/groups", nextUrl.origin));
		}

		if (
			!isLoggedIn &&
			protectedRoutes.some((route) => nextUrl.pathname.startsWith(route))
		) {
			const redirectUrl = new URL("/", nextUrl.origin);
			redirectUrl.searchParams.set("callbackUrl", nextUrl.pathname);
			return Response.redirect(redirectUrl);
		}

		return NextResponse.next();
	} catch (error) {
		console.error("[MIDDLEWARE_ERROR]", error);
		return NextResponse.next();
	}
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
