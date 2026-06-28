import { createClient } from '@supabase/supabase-js'

let supabase = null

function getClient() {
  if (!supabase) {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    )
  }
  return supabase
}

export const supabaseAdapter = {
  query(schema, table) {
    return getClient().schema(schema).from(table)
  }
}