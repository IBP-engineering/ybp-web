<script setup lang="ts">
const data = [
  {
    isLove: true,
    loveCount: 9,
    commentCount: 2,
    comment: {
      username: 'albed',
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam fugit, inventore distinctio deleniti deserunt quidem quasi tempore nisi laborum magnam minima commodi, ipsam consequuntur iusto. Tenetur aliquam odio error earum?',
    },
    childComments: [
      {
        isLove: true,
        loveCount: 1,
        comment: {
          username: 'apakahreal',
          text: 'Lorem ipsum',
        },
      },
      {
        isLove: false,
        loveCount: 0,
        comment: {
          username: 'ownernya',
          text: 'Lorem ipsum dolor sit',
        },
      },
    ],
  },
  {
    isLove: false,
    loveCount: 2,
    commentCount: 0,
    comment: {
      username: 'juragansawo99',
      text: 'Lorem ipsum dolor sit amet',
    },
    childComments: [],
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
      :comment="item.comment"
      :child-comments="item.childComments"
    />
  </div>
</template>
