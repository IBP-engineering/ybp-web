import { serverSupabaseClient } from '#supabase/server'
import { TZDate } from '@date-fns/tz'
import {
  differenceInCalendarDays,
  endOfDay,
  formatISO,
  getUnixTime,
  parseISO,
  startOfDay,
} from 'date-fns'
import { Database } from '~/types/database.types'
import { cleanDate } from '~~/server/utils/date'

interface Data {
  username: string
  displayName: string
  point: number
  streakDay: number
}

export default defineCachedEventHandler(
  async (
    event,
  ): Promise<{
    error: unknown
    data: Data[]
  }> => {
    try {
      const supabase = await serverSupabaseClient<Database>(event)
      const { startDate: _startDate, endDate: _endDate } = getQuery(event)
      const tzStartDate = new TZDate(
        new Date(cleanDate(_startDate)),
        'Asia/Jakarta',
      )
      const tzEndDate = new TZDate(
        new Date(cleanDate(_endDate)),
        'Asia/Jakarta',
      )
      const startDate = formatISO(startOfDay(tzStartDate))
      const endDate = formatISO(endOfDay(tzEndDate))

      const { error, data } = await supabase
        .from('reading_habits')
        .select(
          `
        id,
        page_count,
        created_at,
        created_by(display_name,username,id),
        genre(multiple)`,
        )
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

      if (data.length === 0) {
        return {
          data: [],
          error: null,
        }
      }

      const groupedByUser = Object.groupBy(data, item => item.created_by.id)

      const result: Data[] = []
      for (const group of Object.values(groupedByUser)) {
        let totalPoint = 0
        const dates = []

        for (const habit of group) {
          totalPoint += habit.page_count * habit.genre.multiple
          dates.push(habit.created_at)
        }

        const streakDay = calculateStreak(dates)
        result.push({
          displayName: group[0].created_by.display_name,
          username: group[0].created_by.username,
          point: totalPoint,
          streakDay: streakDay.currentStreak,
        })
      }

      const sortedHabits = result.toSorted((a, b) => {
        // First, compare streak days (descending order)
        if (b.streakDay !== a.streakDay) {
          return b.streakDay - a.streakDay
        }

        // If streak days are equal, compare points (descending order)
        return b.point - a.point
      })

      return {
        data: sortedHabits,
        error: null,
      }
    } catch (error) {
      console.error(error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Terjadi kesalahan',
        statusText: 'Mohon coba lagi beberapa saat lagi',
      })
    }
  },
  { maxAge: 60 * 60, name: 'getReadingHabitsLeaderboard' },
)

function calculateStreak(dates: string[]) {
  const sortedDates = dates
    .map(date => new TZDate(parseISO(date), 'Asia/Jakarta'))
    .sort((a, b) => getUnixTime(a) - getUnixTime(b))

  let currentStreak = 0
  let maxStreak = 0
  let lastDate: Date = null

  for (const currentDate of sortedDates) {
    if (!lastDate) {
      currentStreak = 1
      lastDate = currentDate
      continue
    }

    const dayDifference = differenceInCalendarDays(currentDate, lastDate)

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
