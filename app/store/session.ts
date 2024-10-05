import type { User } from '~/types/entities'

export const currentUser = ref<Partial<User>>(null)
