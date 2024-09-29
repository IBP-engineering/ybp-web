export interface User {
  id: string
  display_name: string
  username: string
  password: string
  bio: string
  email: string
  is_active: Date
  created_at: Date
}

export interface Tag {
  id: string
  title: string
  description: string
  slug: string
}
