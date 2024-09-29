import type { Database } from './database.types'

export type User = Database['public']['Tables']['users']['Row']
export type Tag = Database['public']['Tables']['tags']['Row']
