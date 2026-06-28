import { supabaseAdapter } from './adapters/supabaseAdapter.js'
import { postgresAdapter } from './adapters/postgresAdapter.js'

const DB_PROVIDER = process.env.DB_PROVIDER || 'postgres'

export const adapter = DB_PROVIDER === 'supabase'
  ? supabaseAdapter
  : postgresAdapter