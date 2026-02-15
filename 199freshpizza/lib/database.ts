let pool: any = null

// Initialize pool only on server and when needed
async function initializePool() {
  if (typeof window !== "undefined") {
    throw new Error("Database operations are not allowed on the client side")
  }

  if (!pool && process.env.DATABASE_URL) {
    try {
      // Only import pg when actually needed and on server
      const { Pool } = require("pg")

      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      })
    } catch (error) {
      console.warn("PostgreSQL not available, database operations will be disabled")
      pool = null
    }
  }

  return pool
}

// Database query wrapper with error handling and logging
export async function query(text: string, params?: any[]) {
  // Ensure this only runs on the server
  if (typeof window !== "undefined") {
    throw new Error("Database operations are not allowed on the client side")
  }

  const dbPool = await initializePool()

  if (!dbPool) {
    throw new Error("Database pool not initialized - PostgreSQL may not be available")
  }

  const start = Date.now()
  let client: any = null

  try {
    client = await dbPool.connect()
    const result = await client.query(text, params)
    const duration = Date.now() - start

    // Log slow queries (over 1 second)
    if (duration > 1000) {
      console.warn(`Slow query detected: ${duration}ms`, { text, params })
    }

    return result
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  } finally {
    if (client) {
      client.release()
    }
  }
}

// Transaction wrapper
export async function transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
  // Ensure this only runs on the server
  if (typeof window !== "undefined") {
    throw new Error("Database transactions are not allowed on the client side")
  }

  const dbPool = await initializePool()

  if (!dbPool) {
    throw new Error("Database pool not initialized - PostgreSQL may not be available")
  }

  const client = await dbPool.connect()

  try {
    await client.query("BEGIN")
    const result = await callback(client)
    await client.query("COMMIT")
    return result
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

// Health check function
export async function healthCheck(): Promise<boolean> {
  if (typeof window !== "undefined") {
    return false
  }

  try {
    const result = await query("SELECT 1 as health_check")
    return result.rows.length > 0
  } catch (error) {
    console.error("Database health check failed:", error)
    return false
  }
}

// Graceful shutdown
export async function closePool(): Promise<void> {
  if (typeof window !== "undefined" || !pool) {
    return
  }
  await pool.end()
}

// Export pool for advanced usage (server-side only)
export { pool }
