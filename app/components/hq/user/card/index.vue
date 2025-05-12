<script setup lang="ts">
import type { Role, User } from '~/types/entities'

defineProps<{ user: User & { roles: Role; stories: { count: number }[] } }>()
</script>

<template>
  <NuxtLink
    :to="`/hq/users/${user.username}`"
    class="hover:border-primary-400 ring-primary-500 flex w-full items-center justify-between border-2 bg-white p-2 transition focus:ring focus:outline-none"
  >
    <div class="flex items-center gap-2">
      <UserPicture :seed="user.username" width="50" height="50" />
      <div>
        <RoleBadge :name="user.roles.name" />
        <br />
        <b class="mr-1">{{ user.display_name }}</b>
        <small class="text-neutral-600">@{{ user.username }}</small>
        <p class="text-neutral-600">
          {{ user.stories[0].count }}
          {{ user.stories[0].count > 1 ? 'stories' : 'story' }}
        </p>
      </div>
    </div>
  </NuxtLink>
</template>
