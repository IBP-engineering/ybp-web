import { serverSupabaseClient } from '#supabase/server'
import { endOfDay, formatISO, startOfDay } from 'date-fns'
import { TZDate } from '@date-fns/tz'
import type { Database } from '~/types/database.types'
import type { BookGenre, ReadingHabit, User } from '~/types/entities'
import { cleanDate } from '~~/server/utils/date'

export default defineEventHandler(
  async (
    event,
  ): Promise<{
    error: unknown
    data: Partial<
      Omit<ReadingHabit, 'genre' | 'created_by'> & {
        genre: Partial<BookGenre>
        created_by: Partial<User>
      }
    >[]
    pagination: { total: number; page: number }
  }> => {
    try {
      const supabase = await serverSupabaseClient<Database>(event)
      const { date, page = 1, limit = 10 } = getQuery(event)
      const tzDate = new TZDate(new Date(cleanDate(date)), 'Asia/Jakarta')
      const startDate = formatISO(startOfDay(tzDate))
      const endDate = formatISO(endOfDay(tzDate))
      const startIndex = (+page - 1) * +limit

      const { error, data } = await supabase
        .from('reading_habits')
        .select(
          `id,
        title,
        page_count,
        summary,
        created_at,
        created_by(display_name,username),
        genre(label,multiple)`,
        )
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .order('created_at', { ascending: false })
        .range(startIndex, startIndex + +limit - 1)

      const { count } = await supabase
        .from('reading_habits')
        .select('id', { count: 'exact' })
        .gte('created_at', startDate)
        .lte('created_at', endDate)

      if (error) {
        throw createError({
          message: error.message,
          statusCode: 400,
          statusMessage: error.code,
          statusText: error.details,
        })
      }

      return { data, pagination: { total: count, page: +page }, error: null }
    } catch (error) {
      console.error(error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Terjadi kesalahan',
        statusText: 'Mohon coba lagi beberapa saat lagi',
      })
    }
  },
)
