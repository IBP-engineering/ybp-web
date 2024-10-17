<script setup lang="ts">
const supabase = useSupabaseClient()
const route = useRoute()
const { slug } = route.params
const { data: tag } = await useAsyncData(`tags/${slug}`, async () => {
  const { data } = await supabase
    .from('tags')
    .select('*')
    .eq('slug', slug)
    .single()

  return data
})

if (!tag.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Halaman yang dituju tidak ditemukan',
  })
}
</script>

<template>
  <div class="mx-auto w-full max-w-screen-xl">
    <div class="rounded-lg border border-gray-300 bg-white p-4 md:p-6">
      <h1 class="text-3xl font-semibold leading-loose tracking-wide">
        {{ tag.title }}
      </h1>
      <p class="font-thin">{{ tag.description }}</p>
    </div>

    <div>stories</div>
  </div>
</template>
