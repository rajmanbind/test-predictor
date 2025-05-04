import crypto from "crypto"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Get Razorpay signature from the request headers
    const razorpaySignature = request.headers.get("X-Razorpay-Signature")

    // Get payload from the request
    const body = await request.text()

    // The secret key from Razorpay Webhook settings
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET // Use your actual Razorpay secret key here

    // Generate the HMAC SHA256 signature
    const generatedSignature = crypto
      .createHmac("sha256", webhookSecret!)
      .update(body)
      .digest("hex")

    // Compare the generated signature with the one from Razorpay
    if (generatedSignature === razorpaySignature) {
      return NextResponse.json(
        { message: "Payment verified successfully", isOk: true },
        { status: 200 },
      )
    } else {
      return NextResponse.json(
        { message: "Payment verification failed", isOk: false },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}
