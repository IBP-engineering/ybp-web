export default defineNuxtRouteMiddleware(async () => {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()
  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('id', user.value.id)
    .eq('role_id', 3)

  if (data?.length === 1) {
    return true
  }

  return false
})
