import { createId } from '@paralleldrive/cuid2'
import slugify from '@sindresorhus/slugify'

export function toSlug(text: string, withHash = true) {
  if (!text) {
    return ''
  }

  if (withHash) {
    const randomSuffix = createId().slice(0, 5)

    return slugify(text.toString().concat('-', randomSuffix))
  }

  return slugify(text.toString())
}
