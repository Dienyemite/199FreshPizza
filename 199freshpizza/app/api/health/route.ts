import { NextResponse } from "next/server"
import { getSystemHealth } from "@/lib/monitoring"

export async function GET() {
  try {
    const health = await getSystemHealth()

    const isHealthy = health.database && health.stripe && health.memory.percentage < 90

    return NextResponse.json(
      {
        status: isHealthy ? "healthy" : "unhealthy",
        ...health,
      },
      { status: isHealthy ? 200 : 503 },
    )
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        status: "error",
        error: "Health check failed",
      },
      { status: 500 },
    )
  }
}
