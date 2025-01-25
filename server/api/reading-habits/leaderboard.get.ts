import { serverSupabaseClient } from '#supabase/server'
import {
  differenceInDays,
  endOfDay,
  getUnixTime,
  parseISO,
  startOfDay,
} from 'date-fns'
import { Database } from '~/types/database.types'

export default defineEventHandler(
  async (
    event,
  ): Promise<{
    error: unknown
    hitCache: boolean
    data: {
      name: string
      point: number
      streakDay: number
    }[]
  }> => {
    try {
      const supabase = await serverSupabaseClient<Database>(event)
      const { startDate: _startDate, endDate: _endDate } = getQuery(event)
      const startDate = startOfDay(
        new Date(cleanDate(_startDate.toString())),
      ).toISOString()
      const endDate = endOfDay(
        new Date(cleanDate(_endDate.toString())),
      ).toISOString()

      const { error, data } = await supabase
        .from('reading_habits')
        .select(
          `
        id,
        page_count,
        created_at,
        created_by(display_name,id),
        genre(multiple)`,
        )
        .gte('created_at', startDate)
        .lte('created_at', endDate)

      const groupedByUser = Object.groupBy(data, item => item.created_by.id)

      const result: { name: string; point: number; streakDay: number }[] = []
      for (const group of Object.values(groupedByUser)) {
        let totalPoint = 0
        const dates = []

        for (const habit of group) {
          totalPoint += habit.page_count * habit.genre.multiple
          dates.push(habit.created_at)
        }

        const streakDay = calculateStreak(dates)
        result.push({
          name: group[0].created_by.display_name,
          point: totalPoint,
          streakDay: streakDay.maxStreak,
        })
      }

      console.log(result.toSorted((a, b) => b.streakDay - a.streakDay))

      if (error) {
        throw createError({
          message: error.message,
          statusCode: 400,
          statusMessage: error.code,
          statusText: error.details,
        })
      }

      return { data: result, hitCache: false, error: null }
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

function cleanDate(date: string) {
  return date.toString().replaceAll(/"/g, '')
}

function calculateStreak(dates: string[]) {
  const sortedDates = dates
    .map(date => parseISO(date))
    .sort((a, b) => getUnixTime(a) - getUnixTime(b))

  let currentStreak = 0
  let maxStreak = 0
  let lastDate = null

  for (const currentDate of sortedDates) {
    if (!lastDate) {
      currentStreak = 1
      lastDate = currentDate
      continue
    }

    const dayDifference = differenceInDays(currentDate, lastDate)

    if (dayDifference === 1) {
      currentStreak++
      maxStreak = Math.max(currentStreak, maxStreak)
    } else if (dayDifference > 1) {
      currentStreak = 1
    }

    lastDate = currentDate
  }

  return {
    currentStreak,
    maxStreak,
  }
}
