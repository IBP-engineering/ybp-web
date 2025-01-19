import { serverSupabaseClient } from '#supabase/server'
import { Database } from '~/types/database.types'
import { BookGenre } from '~/types/entities'

export default defineEventHandler(
  async (
    event,
  ): Promise<{
    error: unknown
    totalRecord: number
    mostGenre: string
    totalPoint: number
    pageCountTotal: number
  }> => {
    const supabase = await serverSupabaseClient<Database>(event)
    const userId = getRouterParam(event, 'userId')
    const { count, data, error } = await supabase
      .from('reading_habits')
      .select('page_count,genre(id,label,multiple)', { count: 'exact' })
      .eq('created_by', userId.toString())

    if (error) {
      throw createError({
        statusCode: 400,
        statusMessage: error.message,
        statusText: error.code,
        ...error,
      })
    }

    const stats = data.reduce(
      (acc, curr) => {
        const point = curr.page_count * curr.genre.multiple
        acc.pageCountTotal = acc.pageCountTotal + curr.page_count
        acc.totalPoint = acc.totalPoint + point
        acc.totalRecord = count

        return acc
      },
      {
        totalRecord: 10,
        pageCountTotal: 0,
        totalPoint: 12,
      },
    )

    const genres = data.map(data => data.genre)
    const mostGenre = getMostFrequentGenre(genres)

    return {
      error: null,
      mostGenre: mostGenre.label,
      ...stats,
    }
  },
)

function getMostFrequentGenre(data: Partial<BookGenre>[]) {
  // Use Reduce to aggregate counts and find the most frequent genre in one step
  const mostFrequent = data.reduce(
    (current, item) => {
      const genreId = item.id
      current.counts[genreId] = (current.counts[genreId] || 0) + 1 // Increment count for this genre ID
      if (current.counts[genreId] > current.maxCount) {
        current.maxCount = current.counts[genreId]
        current.mostFrequentId = genreId
      }
      return current
    },
    { counts: {}, maxCount: 0, mostFrequentId: null },
  )

  // Find the label for the most frequent genre (if any)
  let mostFrequentLabel = null
  if (mostFrequent.mostFrequentId) {
    for (const item of data) {
      if (item.id === mostFrequent.mostFrequentId) {
        mostFrequentLabel = item.label
        break // Found the label, no need to continue searching
      }
    }
  }

  return mostFrequent.mostFrequentId
    ? {
        id: mostFrequent.mostFrequentId,
        label: mostFrequentLabel,
        count: mostFrequent.maxCount,
      }
    : null
}
