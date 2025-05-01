<script setup lang="ts">
import format from 'date-fns/format'
import id from 'date-fns/locale/id'
import type { User } from '~/types/entities'

defineProps<{
  author: Partial<User>
}>()
</script>

<template>
  <div
    class="border border-neutral-300 bg-neutral-50 shadow rounded-lg p-4 hidden lg:block"
  >
    <NuxtLink
      :to="`/${author.username}`"
      class="group mb-4 flex items-center gap-4 rounded"
      title="To author page"
    >
      <UserPicture :seed="author.username" width="40" height="40" />
      <b class="group-hover:text-primary-600">{{ author.display_name }}</b>
    </NuxtLink>

    <p class="text-neutral-600">
      {{ author.bio }}
    </p>
    <ul class="mt-4 space-y-4 text-sm">
      <li v-if="author.location">
        <b class="text-xs">DOMISILI</b>
        <p class="text-neutral-600">{{ author.location }}</p>
      </li>
      <li>
        <b class="text-xs">BERGABUNG</b>
        <p class="text-neutral-600">
          {{ format(new Date(author.created_at), 'PPP', { locale: id }) }}
        </p>
      </li>
    </ul>
  </div>
</template>
