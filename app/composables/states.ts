import type { User } from '~/types/entities'

export const useCurrentUser = () => {
  return useState<Partial<User>>('current-user', () => null)
}
