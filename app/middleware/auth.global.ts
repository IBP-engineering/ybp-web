export default defineNuxtRouteMiddleware(async to => {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()
  const isUserAuthenticated = Boolean(user.value)

  // prevent authenticated user from accessing the page
  const authRoutes = ['/login', '/register']
  const toHqsPage = to.path.split('/')[1] === 'hq'

  if (authRoutes.includes(to.path) && isUserAuthenticated) {
    const { data } = await supabase
      .from('users')
      .select('role_id')
      .eq('id', user.value.id)
      .single()
    const isMember = data?.role_id === 1

    if (isMember) {
      return navigateTo('/dashboard')
    }

    return navigateTo('/hq')
  } else if (toHqsPage && !isUserAuthenticated) {
    return navigateTo('/login')
  } else if (toHqsPage && isUserAuthenticated) {
    const { data } = await supabase
      .from('users')
      .select('role_id')
      .eq('id', user.value.id)
      .single()
    const isMember = data?.role_id === 1

    if (isMember) {
      return false
    }
  }

  return true
})
