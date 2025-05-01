<script setup lang="ts">
const data = [
  {
    isLove: true,
    loveCount: 9,
    commentCount: 2,
  },
  {
    isLove: false,
    loveCount: 2,
    commentCount: 0,
  },
]
</script>

<template>
  <div class="flex flex-col gap-12 py-4 w-full md:w-3/4">
    <StoryCommentItem
      v-for="item in data"
      :key="item.loveCount"
      :is-love="item.isLove"
      :love-count="item.loveCount"
      :comment-count="item.commentCount"
    />
  </div>
</template>
