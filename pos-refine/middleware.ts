import { METHODS } from 'http';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { BaseURL } from 'src/baseURl'
import axios from 'axios';
import { url } from 'inspector';
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    let oldUrl = new URL(request.url).pathname

    const token = request.cookies.get("posCookie")?.value



    const res = await fetch(`${BaseURL}/auth-user/`, { method: "GET", credentials: "same-origin", headers: { 'Authorization': token ? token : "none" }, });
    const resJson = await res.json()
    const nextUrl = request.nextUrl.pathname

    // console.log("resJson.success === true && token !== undefined",resJson)

    if (resJson.success !== false && token !== undefined) {
        let permissions: string[] = []

        resJson.authUser.role.permissions.forEach((permission: { _id: string, name: string }) => {
            permissions.push(permission.name)
        });

        if (nextUrl.includes("/login")) {
            return NextResponse.redirect(new URL("/dashboard", request.url))
        }


        // FOR USER MODEL ACCESS *****
        if (nextUrl === "/user" && !permissions.includes("user list")) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        if (nextUrl === "/user/create" && !permissions.includes("user add")) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        if (nextUrl.includes("/user/show/") && !permissions.includes("user show")) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        if (nextUrl.includes("/user/edit/") && !permissions.includes("user edit")) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // FOR ROLE MODEL ACCESS *****
        if (nextUrl === "/role" && !permissions.includes("role list")) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        if (nextUrl === "/role/create" && !permissions.includes("role add")) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        if (nextUrl.includes("/role/show/") && !permissions.includes("role show")) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        if (nextUrl.includes("/role/edit/") && !permissions.includes("role edit")) {
            return NextResponse.redirect(new URL('/login', request.url))
        }


        // FOR PERMISSION MODEL ACCESS *****
        if (nextUrl === "/permission" && !permissions.includes("permission list")) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        if (nextUrl === "/permission/create" && !permissions.includes("permission add")) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        if (nextUrl.includes("/permission/show/") && !permissions.includes("permission show")) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        if (nextUrl.includes("/permission/edit/") && !permissions.includes("permission edit")) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // FOR SUPPLIER MODEL ACCESS *****
        if (nextUrl === "/supplier" && !permissions.includes("supplier list")) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        if (nextUrl === "/supplier/create" && !permissions.includes("supplier add")) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        if (nextUrl.includes("/supplier/show/") && !permissions.includes("supplier show")) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        if (nextUrl.includes("/supplier/edit/") && !permissions.includes("supplier edit")) {
            return NextResponse.redirect(new URL('/login', request.url))
        }


        // FOR CUSTOMER MODEL ACCESS *****
        if (nextUrl === "/customer" && !permissions.includes("customer list")) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        if (nextUrl === "/customer/create" && !permissions.includes("customer add")) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        if (nextUrl.includes("/customer/show/") && !permissions.includes("customer show")) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        if (nextUrl.includes("/customer/edit/") && !permissions.includes("customer edit")) {
            return NextResponse.redirect(new URL('/login', request.url))
        }


        // FOR CATEGORY MODEL ACCESS *****
        if (nextUrl === "/category" && !permissions.includes("category list")) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        if (nextUrl === "/category/create" && !permissions.includes("category add")) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        if (nextUrl.includes("/category/show/") && !permissions.includes("category show")) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        if (nextUrl.includes("/category/edit/") && !permissions.includes("category edit")) {
            return NextResponse.redirect(new URL('/login', request.url))
        }


        // FOR PRODUCT MODEL ACCESS *****
        if (nextUrl === "/product" && !permissions.includes("product list")) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        if (nextUrl === "/product/create" && !permissions.includes("product add")) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        if (nextUrl.includes("/product/show/") && !permissions.includes("product show")) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        if (nextUrl.includes("/product/edit/") && !permissions.includes("product edit")) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // FOR SALE MODEL ACCESS *****
        if (nextUrl === "/sale" && !permissions.includes("sale add")) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        if (nextUrl.includes("/sales-report/show/") && !permissions.includes("sale show")) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        if (nextUrl.includes("/sales-report/") && !permissions.includes("sale list")) {
            return NextResponse.redirect(new URL('/login', request.url))
        }


    } else {
        if (!nextUrl.includes("/login")) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }


}

export const config = {
    matcher: ['/login((?!general).*)', '/user((?!general).*)', '/role((?!general).*)', '/permission((?!general).*)', '/supplier((?!general).*)', '/customer((?!general).*)', '/category((?!general).*)', '/product((?!general).*)', '/sale((?!general).*)', '/sale-report((?!general).*)', '/dashboard((?!general).*)',],
}
