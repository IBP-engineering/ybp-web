export default defineNuxtRouteMiddleware(() => {
  const session = useSupabaseSession()
  const isAuthenticated = Boolean(session?.value?.user)

  if (isAuthenticated) {
    return true
  }
  return navigateTo('/login')
})
