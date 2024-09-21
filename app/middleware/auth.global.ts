export default defineNuxtRouteMiddleware(async to => {
  const user = useSupabaseUser()
  const isUserAuthenticated = Boolean(user.value)

  // prevent authenticated user from accessing the page
  const authRoutes = ['/login', '/register']
  const toHqsPage = to.path.split('/')[1] === 'hq'

  if (authRoutes.includes(to.path) && isUserAuthenticated) {
    return navigateTo('/hq')
  } else if (toHqsPage && !isUserAuthenticated) {
    return navigateTo('/login')
  }

  return true
})
