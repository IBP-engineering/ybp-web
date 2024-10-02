<script setup lang="ts">
defineProps<{
  content: string
}>()
</script>

<template>
  <div class="prose prose-neutral max-w-screen-md" v-html="content"></div>
</template>

<style lang="scss">
.prose {
  width: 100%;

  ul,
  ol {
    padding: 0 1rem;
    margin: 1.25rem 0.5rem 1.25rem 0.4rem;

    li p {
      margin-top: 0.25em;
      margin-bottom: 0.25em;
    }

    li {
      ol,
      ul {
        margin-top: 0.3rem;
      }
    }
  }

  ol {
    list-style-type: decimal;
  }

  ul {
    list-style-type: disc;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
    margin-top: 2.5rem;
    text-wrap: pretty;
  }

  h1,
  h2 {
    margin-top: 3.5rem;
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 1.875rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  h3 {
    font-size: 1.25rem;
  }

  h4,
  h5,
  h6 {
    font-size: 1rem;
  }

  /* Code and preformatted text styles */
  code {
    background-color: #faf5ff;
    border-radius: 0.4rem;
    border: 1px solid #d8b4fe;
    color: #581c87;
    font-size: 0.85rem;
    padding: 0.25em 0.3em;
    font-family: 'Courier New', Courier, monospace;
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
