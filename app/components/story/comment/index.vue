<script setup lang="ts">
const data = [
  {
    isLove: true,
    loveCount: 9,
    commentCount: 2,
    role: 'mod',
    comment: {
      username: 'albed',
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam fugit, inventore distinctio deleniti deserunt quidem quasi tempore nisi laborum magnam minima commodi, ipsam consequuntur iusto. Tenetur aliquam odio error earum?',
      createdAt: new Date().setHours(5, 0, 0),
    },
    childComments: [
      {
        isLove: true,
        loveCount: 1,
        role: 'op',
        comment: {
          username: 'apakahreal',
          text: 'Lorem ipsum',
          createdAt: new Date().setHours(6, 0, 0),
        },
      },
      {
        isLove: false,
        loveCount: 0,
        role: 'member',
        comment: {
          username: 'ownernya',
          text: 'Lorem ipsum dolor sit',
          createdAt: new Date().setHours(6, 10, 0),
        },
      },
    ],
  },
  {
    isLove: false,
    loveCount: 2,
    commentCount: 0,
    role: 'member',
    comment: {
      username: 'juragansawo99',
      text: 'Lorem ipsum dolor sit amet',
      createdAt: new Date().setHours(5, 0, 0),
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
      :role="item.role"
      :child-comments="item.childComments"
    />
  </div>
</template>
