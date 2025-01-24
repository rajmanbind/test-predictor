import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body
    if (
      username === process.env.admin_username &&
      password === process.env.admin_password
    ) {
      return NextResponse.json({
        msg: "Login successful",
        isAuthenticated: true,
      })
    }
    return NextResponse.json({
      msg: "Username or Password is wrong",
      isAuthenticated: false,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { err, msg: "Something went wrong!" },
      {
        status: 400,
      },
    )
  }
}
