import crypto from "crypto"
import { NextRequest, NextResponse } from "next/server"

// Required to get raw body
export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!
  const razorpaySignature = req.headers.get("x-razorpay-signature")
  const rawBody = await req.arrayBuffer()
  const bodyString = Buffer.from(rawBody).toString("utf-8")

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(bodyString)
    .digest("hex")

  console.log(
    "------ RAZORPAY_WEBHOOK ------",
    process.env.RAZORPAY_WEBHOOK_SECRET,
  )

  if (expectedSignature !== razorpaySignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const payload = JSON.parse(bodyString)

  console.log("------ PAYLOAD ------", payload)

  // ✅ Handle events
  if (payload.event === "payment.captured") {
    const paymentInfo = payload.payload.payment.entity
    console.log("Payment captured:", paymentInfo)
    // Save to DB or perform your logic
  }

  return NextResponse.json({ received: true })
}

