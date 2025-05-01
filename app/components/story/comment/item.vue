<script setup lang="ts">
withDefaults(
  defineProps<{
    isLove?: boolean
    loveCount?: number
    commentCount?: number
    role?: 'op' | 'mod' | 'member'
    comment: { text: string; username: string }
    childComments: {
      isLove?: boolean
      loveCount?: number
      role?: 'op' | 'mod'
      comment?: { text: string; username: string }
    }[]
  }>(),
  { commentCount: 0, isLove: false, loveCount: 0, role: 'member' },
)

const openChild = ref(false)
</script>

<template>
  <div class="relative min-h-full flex flex-col">
    <div class="flex gap-2 -ml-1">
      <UserPicture class="border-4 border-white w-10 h-10" seed="halodek" />

      <div class="flex gap-2 items-start">
        <b class="flex items-center gap-2"
          >{{ comment.username }}
          <UBadge
            v-if="role !== 'member'"
            :color="role === 'mod' ? 'warning' : 'neutral'"
            class="px-1 py-[0.2px]"
            :title="role === 'op' ? 'Original poster' : 'Moderator'"
            >{{ role.toUpperCase() }}</UBadge
          >
        </b>
        <span>1j</span>
      </div>
    </div>

    <p class="pl-11 -mt-3 text-neutral-600 text-balance">
      {{ comment.text }}
    </p>

    <div class="mt-2 pl-11 flex gap-2">
      <UButton
        v-if="isLove"
        color="error"
        variant="soft"
        icon="ph:heart-fill"
        >{{ loveCount }}</UButton
      >
      <UButton v-else color="neutral" variant="ghost" icon="ph:heart">{{
        loveCount
      }}</UButton>
      <UButton color="neutral" variant="ghost" icon="ph:chat-centered">{{
        commentCount
      }}</UButton>
    </div>

    <span
      v-if="commentCount > 0"
      aria-hidden="true"
      class="absolute left-4 top-10 bg-neutral-300 w-[.8px] h-[calc(100%-62px)]"
      :class="{ 'h-[calc(100%-100px)]': openChild }"
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
      <StoryCommentItem
        v-for="item in childComments"
        :key="item.loveCount"
        :comment="item.comment"
        :is-love="item.isLove"
        :love-count="item.loveCount"
        :role="item.role"
        :child-comments="[]"
      />
    </div>
  </div>
</template>
