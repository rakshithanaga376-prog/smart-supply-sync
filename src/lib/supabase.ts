import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Attempt to read Supabase credentials (Lovable does not support .env files, but
// the Supabase integration may inject these at build time). If they are missing,
// we fall back to a safe stub so the app doesn't crash.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

function createStubClient(): SupabaseClient {
  const error = new Error(
    'Supabase is not configured. Connect Supabase via the green button (top right) and try again.'
  )
  const asyncError = async () => ({ data: null as any, error })
  const subscription = { unsubscribe: () => {} }

  // Lightweight stub implementing only the minimal surface we use
  // Cast to SupabaseClient to satisfy types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stub: any = {
    auth: {
      signInWithPassword: asyncError,
      signOut: asyncError,
      getSession: asyncError,
      updateUser: asyncError,
      onAuthStateChange: () => ({ data: { subscription } }),
    },
    from: () => ({
      insert: asyncError,
      update: asyncError,
      select: asyncError,
      delete: asyncError,
      upsert: asyncError,
      eq: asyncError,
    }),
    storage: {
      from: () => ({ upload: asyncError, download: asyncError, remove: asyncError }),
    },
  }

  return stub as SupabaseClient
}

let supabase: SupabaseClient

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  console.error(
    'Missing Supabase configuration. Please connect the Supabase integration or add your public anon key and URL.'
  )
  supabase = createStubClient()
}

export { supabase }