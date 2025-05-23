import type { InjectionKey } from 'vue'

export const notificationKey = Symbol() as InjectionKey<{
  openNotification: boolean
  switchOpenNotification: () => void
}>
