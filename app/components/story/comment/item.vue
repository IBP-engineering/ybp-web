<script setup lang="ts">
import { formatDistanceToNowStrict } from 'date-fns'
import id from 'date-fns/locale/id'

withDefaults(
  defineProps<{
    isLove?: boolean
    loveCount?: number
    commentCount?: number
    role?: 'op' | 'mod' | 'member'
    isMainThread?: boolean
    comment: { text: string; username: string; createdAt: number }
    childComments: {
      isLove?: boolean
      loveCount?: number
      isMainThread?: boolean
      role?: 'op' | 'mod'
      comment?: { text: string; username: string; createdAt: number }
    }[]
  }>(),
  {
    commentCount: 0,
    isLove: false,
    loveCount: 0,
    isMainThread: true,
    role: 'member',
  },
)

const openComment = ref(false)
const commentText = ref('')
const openChild = ref(false)
</script>

<template>
  <div class="relative min-h-full flex flex-col">
    <div class="flex gap-2 -ml-1">
      <UserPicture class="border-4 border-white w-10 h-10" seed="halodek" />

      <div class="flex gap-2 items-start">
        <div class="flex items-center gap-2">
          <ULink to="#" class="font-bold hover:underline text-primary-950">{{
            comment.username
          }}</ULink>
          <UTooltip :text="role === 'op' ? 'Original poster' : 'Moderator'">
            <UBadge
              v-if="role !== 'member'"
              :color="role === 'mod' ? 'warning' : 'neutral'"
              class="px-1 py-[0.2px]"
            >
              {{ role.toUpperCase() }}
            </UBadge>
          </UTooltip>
        </div>
        <time
          :datetime="new Date(comment.createdAt).toISOString()"
          :title="new Date(comment.createdAt).toISOString()"
          >{{
            formatDistanceToNowStrict(new Date(comment.createdAt), {
              locale: id,
              roundingMethod: 'round',
            })
          }}</time
        >
      </div>
    </div>

    <p class="pl-11 -mt-3 text-neutral-600 text-balance">
      {{ comment.text }}
    </p>

    <div class="mt-2 pl-11 flex gap-2">
      <UTooltip text="Sukai komentar">
        <UButton
          :color="isLove ? 'error' : 'neutral'"
          :variant="isLove ? 'soft' : 'ghost'"
          :icon="isLove ? 'ph:heart-fill' : 'ph:heart'"
        >
          {{ loveCount }}
        </UButton>
      </UTooltip>

      <UTooltip text="Balas komentar">
        <UButton
          v-if="isMainThread"
          color="neutral"
          variant="ghost"
          icon="ph:chat-centered"
          @click="openComment = !openComment"
        >
          {{ commentCount }}
        </UButton>
      </UTooltip>
    </div>

    <span
      v-if="commentCount > 0"
      aria-hidden="true"
      class="absolute left-4 top-10 bg-neutral-300 w-[.8px] h-[calc(100%-62px)]"
      :class="{
        'h-[calc(100%-120px)]': openChild,
        'h-[calc(100%-140px)]': openComment && openChild,
        'h-[calc(100%-110px)]': openComment && !openChild,
      }"
    ></span>

    <div v-if="!openChild && commentCount > 0" class="mt-4 flex items-center">
      <UAvatarGroup :max="2" size="3xs">
        <UAvatar
          src="https://github.com/benjamincanac.png"
          alt="Benjamin Canac"
        />
        <UAvatar src="https://github.com/romhml.png" alt="Romain Hamel" />
        <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
      </UAvatarGroup>

      <UButton
        variant="ghost"
        size="sm"
        color="neutral"
        class="ml-1"
        @click="openChild = true"
      >
        Tampilkan balasan
      </UButton>
    </div>

    <div v-if="commentCount > 0 && openChild" class="flex flex-col gap-4 mt-4">
      <!-- TODO: consider using slot instead of this method -->
      <StoryCommentItem
        v-for="item in childComments"
        :key="item.loveCount"
        :comment="item.comment"
        :is-love="item.isLove"
        :love-count="item.loveCount"
        :role="item.role"
        :is-main-thread="false"
        :child-comments="[]"
      />
    </div>

    <div
      v-if="isMainThread && openComment"
      class="flex gap-2 pl-11 items-center mt-2"
    >
      <UTextarea
        v-model="commentText"
        placeholder="Balas ke albed"
        class="w-3/4"
        variant="outline"
        autoresize
        autofocus
        :rows="1"
        :maxrows="6"
        :avatar="{
          src: `https://api.dicebear.com/9.x/shapes/svg?seed=haphap`,
        }"
      />

      <UTooltip v-if="commentText.length > 0" text="Kirim komentar">
        <UButton class="rounded-full" variant="soft" icon="lucide:send" />
      </UTooltip>
    </div>
  </div>
</template>
