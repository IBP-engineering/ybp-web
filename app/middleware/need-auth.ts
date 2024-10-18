export default defineNuxtRouteMiddleware(() => {
  const session = useSupabaseSession()
  const isAuthenticated = Boolean(session?.value)

  if (isAuthenticated) {
    return true
  }
  return navigateTo('/login')
})
