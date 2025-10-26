export default defineNuxtRouteMiddleware(async () => {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()
  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('id', user.value.sub)
    .neq('role_id', 1) // 1 is member role id

  if (data?.length === 1) {
    return true
  }

  return false
})
