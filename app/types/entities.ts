import type { Database } from './database.types'

export type User = Database['public']['Tables']['users']['Row']
export type Tag = Database['public']['Tables']['tags']['Row']
export type Story = Database['public']['Tables']['stories']['Row']
export type StoryStatus = Database['public']['Enums']['Story status']
export type StoryStatusHistory =
  Database['public']['Tables']['story_status_histories']['Row']
export type ReadingHabit = Database['public']['Tables']['reading_habits']['Row']
export type BookGenre = Database['public']['Tables']['book_genres']['Row']
