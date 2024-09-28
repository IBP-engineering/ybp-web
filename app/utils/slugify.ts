import slugify from '@sindresorhus/slugify'
import { createId } from '@paralleldrive/cuid2'

export function toSlug(text: string) {
  if (!text) {
    throw Error('Failed to converting string to slug')
  }

  const randomSuffix = createId().slice(0, 5)

  return slugify(text.toString().concat('-', randomSuffix))
}
