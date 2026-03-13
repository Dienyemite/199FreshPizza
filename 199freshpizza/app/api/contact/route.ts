import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  const { firstName, lastName, email, phone, message } = await request.json()

  if (!firstName || !email || !message) {
    return NextResponse.json({ error: "First name, email, and message are required." }, { status: 400 })
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })

  const mailOptions = {
    from: `"$1.99 Fresh Pizza Website" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    replyTo: email,
    subject: `New Contact Form Message from ${firstName} ${lastName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4a3728;">New Message from Website Contact Form</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5d9c8; font-weight: bold; width: 140px; color: #6b5744;">Name</td>
            <td style="padding: 8px; border-bottom: 1px solid #e5d9c8;">${firstName} ${lastName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5d9c8; font-weight: bold; color: #6b5744;">Email</td>
            <td style="padding: 8px; border-bottom: 1px solid #e5d9c8;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          ${phone ? `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5d9c8; font-weight: bold; color: #6b5744;">Phone</td>
            <td style="padding: 8px; border-bottom: 1px solid #e5d9c8;">${phone}</td>
          </tr>` : ""}
          <tr>
            <td style="padding: 8px; font-weight: bold; vertical-align: top; color: #6b5744;">Message</td>
            <td style="padding: 8px; white-space: pre-wrap;">${message}</td>
          </tr>
        </table>
        <p style="margin-top: 24px; font-size: 12px; color: #999;">
          Reply directly to this email to respond to ${firstName}.
        </p>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact form email error:", error)
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 })
  }
}
