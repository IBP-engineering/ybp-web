import { serverSupabaseClient } from '#supabase/server'
import argon2 from '@node-rs/argon2'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const supabase = await serverSupabaseClient<Database>(event)

  // why? just in case we migrate from supabase.
  // fyi, we cannot (yet) control how password is stored in supabase neither hashed.
  const passwordHash = await argon2.hash(body.password)

  const { data: registeredUser, error: errorSignup } =
    await supabase.auth.signUp({ password: body.password, email: body.email })

  if (errorSignup) {
    return { data: null, error: errorSignup }
  }

  const { error: errorInsert } = await supabase.from('users').insert({
    id: registeredUser.user.id,
    username: body.username,
    display_name: body.displayName,
    email: body.email,
    role_id: 1,
    password: passwordHash,
  })

  if (errorInsert) {
    return { data: null, error: errorInsert }
  }

  return { data: body, error: null }
})
