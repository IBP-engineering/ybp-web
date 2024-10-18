import type { Story, User } from '~/types/entities'

type StoryWithTags = (Story & {
  tags: { tag: { slug: string } }[]
  author: User
})[]

export function mapStoryTag(stories: Partial<StoryWithTags>) {
  const supabase = useSupabaseClient()

  return stories.map(story => {
    const coverWithPath = story.cover_path
      ? supabase.storage.from('story-cover').getPublicUrl(story.cover_path).data
          .publicUrl
      : null

    return {
      ...story,
      cover_path: coverWithPath,
      tags: story.tags.map(t => ({ slug: t.tag.slug })),
    }
  })
}
