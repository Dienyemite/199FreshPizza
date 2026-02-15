export interface SystemHealth {
  database: boolean
  stripe: boolean
  memory: {
    used: number
    total: number
    percentage: number
  }
  uptime: number
  timestamp: Date
}

export interface OrderMetrics {
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  ordersToday: number
  revenueToday: number
  popularItems: Array<{
    name: string
    count: number
    revenue: number
  }>
}

// Server-side database operations with error handling
async function queryDatabase(text: string, params?: any[]) {
  if (typeof window !== "undefined") {
    throw new Error("Database operations are not allowed on the client side")
  }

  try {
    // Dynamic import to avoid client-side issues
    const { query } = await import("./database")
    return await query(text, params)
  } catch (error) {
    console.error("Database query failed:", error)
    throw error
  }
}

// System health check (server-side only)
export async function getSystemHealth(): Promise<SystemHealth> {
  if (typeof window !== "undefined") {
    throw new Error("System health check is not allowed on the client side")
  }

  // Default memory usage for environments where process is not available
  let memoryUsage = {
    heapUsed: 0,
    heapTotal: 100 * 1024 * 1024, // 100MB default
  }

  let uptime = 0

  try {
    if (typeof process !== "undefined") {
      memoryUsage = process.memoryUsage()
      uptime = process.uptime()
    }
  } catch (error) {
    console.warn("Process information not available")
  }

  // Check database health
  let databaseHealth = false
  try {
    await queryDatabase("SELECT 1")
    databaseHealth = true
  } catch (error) {
    console.error("Database health check failed:", error)
    databaseHealth = false
  }

  // Check Stripe connectivity (simplified)
  let stripeHealth = false
  try {
    // This would be a simple Stripe API call in real implementation
    stripeHealth = !!process.env.STRIPE_SECRET_KEY
  } catch (error) {
    console.error("Stripe health check failed:", error)
    stripeHealth = false
  }

  return {
    database: databaseHealth,
    stripe: stripeHealth,
    memory: {
      used: memoryUsage.heapUsed,
      total: memoryUsage.heapTotal,
      percentage: (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100,
    },
    uptime,
    timestamp: new Date(),
  }
}

// Get order metrics for dashboard (server-side only)
export async function getOrderMetrics(): Promise<OrderMetrics> {
  if (typeof window !== "undefined") {
    throw new Error("Order metrics are not allowed on the client side")
  }

  try {
    // Get total orders and revenue
    const totalResult = await queryDatabase(`
      SELECT 
        COUNT(*) as total_orders,
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COALESCE(AVG(total_amount), 0) as average_order_value
      FROM orders 
      WHERE status != 'cancelled'
    `)

    // Get today's orders and revenue
    const todayResult = await queryDatabase(`
      SELECT 
        COUNT(*) as orders_today,
        COALESCE(SUM(total_amount), 0) as revenue_today
      FROM orders 
      WHERE DATE(created_at) = CURRENT_DATE 
      AND status != 'cancelled'
    `)

    // Get popular items
    const popularItemsResult = await queryDatabase(`
      SELECT 
        mi.name,
        COUNT(oi.id) as count,
        SUM(oi.total_price) as revenue
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status != 'cancelled'
      AND o.created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY mi.id, mi.name
      ORDER BY count DESC
      LIMIT 10
    `)

    return {
      totalOrders: Number.parseInt(totalResult.rows[0].total_orders),
      totalRevenue: Number.parseFloat(totalResult.rows[0].total_revenue),
      averageOrderValue: Number.parseFloat(totalResult.rows[0].average_order_value),
      ordersToday: Number.parseInt(todayResult.rows[0].orders_today),
      revenueToday: Number.parseFloat(todayResult.rows[0].revenue_today),
      popularItems: popularItemsResult.rows.map((row) => ({
        name: row.name,
        count: Number.parseInt(row.count),
        revenue: Number.parseFloat(row.revenue),
      })),
    }
  } catch (error) {
    console.error("Error getting order metrics:", error)

    // Return default metrics if database is not available
    return {
      totalOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      ordersToday: 0,
      revenueToday: 0,
      popularItems: [],
    }
  }
}

// Log performance metrics
export function logPerformanceMetric(operation: string, duration: number, metadata?: Record<string, any>) {
  const metric = {
    timestamp: new Date().toISOString(),
    operation,
    duration,
    metadata,
  }

  // Log to console (in production, send to monitoring service)
  console.log("[PERFORMANCE]", metric)

  // Alert on slow operations
  if (duration > 5000) {
    // 5 seconds
    console.warn("[SLOW OPERATION]", metric)
  }
}

// Error tracking
export function trackError(error: Error, context?: Record<string, any>) {
  const errorData = {
    timestamp: new Date().toISOString(),
    message: error.message,
    stack: error.stack,
    context,
  }

  // Log error (in production, send to error tracking service like Sentry)
  console.error("[ERROR TRACKING]", errorData)
}
