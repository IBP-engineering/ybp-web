<script setup lang="ts">
withDefaults(
  defineProps<{
    isLove?: boolean
    loveCount?: number
    commentCount?: number
    comment: { text: string; username: string }
    childComments: {
      isLove?: boolean
      loveCount?: number
      comment?: { text: string; username: string }
    }[]
  }>(),
  { commentCount: 0, isLove: false, loveCount: 0 },
)

const openChild = ref(false)
</script>

<template>
  <div class="relative min-h-full flex flex-col">
    <div class="flex gap-2 -ml-1">
      <UserPicture class="border-4 border-white w-10 h-10" seed="halodek" />
      <b>{{ comment.username }}</b>
      <span>1j</span>
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

    <div v-if="!openChild && commentCount > 0" class="mt-6 flex items-center">
      <UAvatarGroup :max="2" size="3xs">
        <UAvatar
          src="https://github.com/benjamincanac.png"
          alt="Benjamin Canac"
        />
        <UAvatar src="https://github.com/romhml.png" alt="Romain Hamel" />
        <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
      </UAvatarGroup>

      <button class="text-neutral-500 ml-2 text-sm" @click="openChild = true">
        Tampilkan balasan
      </button>
    </div>

    <div v-if="commentCount > 0 && openChild" class="flex flex-col gap-4 mt-4">
      <StoryCommentItem
        v-for="item in childComments"
        :key="item.loveCount"
        :comment="item.comment"
        :is-love="item.isLove"
        :love-count="item.loveCount"
        :child-comments="[]"
      />
    </div>
  </div>
</template>
