import type { InjectionKey } from 'vue'

export const onSuccessLogin = Symbol() as InjectionKey<() => void>
