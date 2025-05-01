<script setup lang="ts">
withDefaults(
  defineProps<{
    isLove?: boolean
    loveCount?: number
    commentCount?: number
  }>(),
  { commentCount: 0, isLove: false, loveCount: 0 },
)
</script>

<template>
  <div>
    <div class="flex gap-2">
      <UserPicture class="w-9 h-9" seed="halodek" />
      <b>kalwabed</b>
      <span>1j</span>
    </div>

    <p class="pl-11 -mt-3 text-neutral-600 text-balance">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam fugit,
      inventore distinctio deleniti deserunt quidem quasi tempore nisi laborum
      magnam minima commodi, ipsam consequuntur iusto. Tenetur aliquam odio
      error earum?
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
  </div>
</template>
