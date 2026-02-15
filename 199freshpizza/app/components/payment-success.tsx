"use client"

import { CheckCircle, Download, Home, Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface PaymentSuccessProps {
  orderNumber: string
  amount: number
  customerEmail: string
  estimatedDelivery: string
}

export default function PaymentSuccess({ orderNumber, amount, customerEmail, estimatedDelivery }: PaymentSuccessProps) {
  return (
    <div className="min-h-screen bg-albescent-white flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-venus/20 shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-cocoa-bean mb-2">Payment Successful!</CardTitle>
          <p className="text-ferra">Thank you for your order. Your delicious pizza is being prepared!</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Order Details */}
          <div className="bg-white p-6 rounded-lg border border-venus/20">
            <h3 className="text-lg font-semibold text-cocoa-bean mb-4">Order Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-ferra">Order Number</p>
                <p className="font-semibold text-cocoa-bean">{orderNumber}</p>
              </div>
              <div>
                <p className="text-ferra">Total Paid</p>
                <p className="font-semibold text-cocoa-bean">${amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-ferra">Email</p>
                <p className="font-semibold text-cocoa-bean">{customerEmail}</p>
              </div>
              <div>
                <p className="text-ferra">Estimated Delivery</p>
                <p className="font-semibold text-cocoa-bean">{estimatedDelivery}</p>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-siam/10 p-6 rounded-lg border border-siam/20">
            <h3 className="text-lg font-semibold text-cocoa-bean mb-3 flex items-center">
              <Utensils className="w-5 h-5 mr-2" />
              What's Next?
            </h3>
            <ul className="space-y-2 text-sm text-ferra">
              <li>• You'll receive an email confirmation shortly</li>
              <li>• Our kitchen will start preparing your order immediately</li>
              <li>• You'll get SMS updates on your order status</li>
              <li>• Our delivery driver will contact you when nearby</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="bg-albescent-white p-6 rounded-lg border border-venus/20">
            <h3 className="text-lg font-semibold text-cocoa-bean mb-3">Need Help?</h3>
            <div className="space-y-2 text-sm text-ferra">
              <p>
                📞 Call us: <span className="font-semibold text-cocoa-bean">(201) 256-3630</span>
              </p>
              <p>
                📧 Email: <span className="font-semibold text-cocoa-bean">orders@hrbpizzeria.com</span>
              </p>
              <p>
                📍 Address: <span className="font-semibold text-cocoa-bean">341 Ridge Road, Lyndhurst, NJ 07071</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1 border-siam text-siam hover:bg-siam hover:text-albescent-white bg-transparent"
              onClick={() => window.print()}
            >
              <Download className="w-4 h-4 mr-2" />
              Print Receipt
            </Button>
            <Link href="/" className="flex-1">
              <Button className="w-full bg-siam hover:bg-black-olive text-albescent-white">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
