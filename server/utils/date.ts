export function cleanDate(date: unknown) {
  return date.toString().replaceAll(/"/g, '')
}
