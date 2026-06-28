import pg from 'pg'

const pool = new pg.Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
})

class PostgresQueryBuilder {
  constructor(schema, table) {
    this.schema = schema
    this.table = table
    this._select = '*'
    this._filters = []
    this._order = null
    this._limit = null
    this._count = false
  }

  select(cols, options = {}) {
    this._select = cols
    if (options.count === 'exact') this._count = true
    return this
  }

  eq(field, value) {
    this._filters.push({ field, value, op: '=' })
    return this
  }

  ilike(field, value) {
    this._filters.push({ field, value, op: 'ILIKE' })
    return this
  }

  order(field, options = {}) {
    this._order = { field, asc: options.ascending !== false }
    return this
  }

  limit(n) {
    this._limit = n
    return this
  }

  single() {
    return this
  }

  async execute() {
    let sql = `SELECT ${this._select} FROM ${this.schema}.${this.table}`
    let params = []
    let paramCount = 1

    if (this._filters.length) {
      const where = this._filters.map(f => {
        params.push(f.value)
        return `${f.field} ${f.op} $${paramCount++}`
      }).join(' AND ')
      sql += ` WHERE ${where}`
    }

    if (this._order) {
      sql += ` ORDER BY ${this._order.field} ${this._order.asc ? 'ASC' : 'DESC'}`
    }

    if (this._limit) {
      sql += ` LIMIT ${this._limit}`
    }

    const result = await pool.query(sql, params)

    if (this._count) {
      return { count: result.rows.length, error: null }
    }

    return { data: result.rows, error: null }
  }
}

function query(schema, table) {
  return new PostgresQueryBuilder(schema, table)
}

export const postgresAdapter = {
  async existeRegistro(schema, table, field, value, operator = 'eq') {
    let q = query(schema, table)
      .select(field, { count: 'exact', head: true })
      .limit(1)
    
    q = q[operator](field, value)
    const { count, error } = await q.execute()
    if (error) throw error
    return count > 0
  },

  async getRoutes() {
    const { data, error } = await query('tracking', 'routes')
      .select('id, name, distance_m, date, created_at')
      .order('created_at', { ascending: false })
      .execute()
    
    if (error) throw error
    return data
  },

  async getActivityTypes() {
    const { data, error } = await query('tracking', 'activity_types')
      .select('*')
      .order('name')
      .execute()
    
    if (error) throw error
    return data
  }
}