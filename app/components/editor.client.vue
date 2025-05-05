<script setup lang="ts">
import ListItem from '@tiptap/extension-list-item'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import StarterKit from '@tiptap/starter-kit'
import { type Content, Editor, EditorContent } from '@tiptap/vue-3'

const editorModel = defineModel<Content>('editor')

const editor = ref<Editor | null>(null)

watch(
  () => editor.value?.getHTML(),
  value => {
    const isSame = value === editor.value.getHTML()

    if (isSame) {
      return
    }

    editor.value.commands.setContent(value, false)
  },
)

onMounted(() => {
  editor.value = new Editor({
    content: editorModel.value,
    editorProps: {
      attributes: {
        spellcheck: 'false',
      },
    },
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      // @ts-expect-error
      TextStyle.configure({ types: [ListItem.name] }),
    ],
    onUpdate: () => {
      editorModel.value = editor.value?.getHTML()
    },
  })
})

onUnmounted(() => {
  editor.value?.destroy()
})
</script>

<template>
  <div>
    <div
      v-if="editor"
      class="mb-2 flex w-fit flex-wrap items-center gap-2 rounded-lg border border-neutral-300 bg-neutral-50 px-2 py-1"
    >
      <UTooltip text="Heading 2" :popper="{ arrow: true, placement: 'bottom' }">
        <UButton
          :variant="
            editor.isActive('heading', { level: 2 }) ? 'solid' : 'ghost'
          "
          color="neutral"
          size="xs"
          icon="i-ph:text-h-two"
          :disabled="
            !editor.can().chain().focus().toggleHeading({ level: 2 }).run()
          "
          square
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        />
      </UTooltip>
      <UTooltip text="Heading 3" :popper="{ arrow: true, placement: 'bottom' }">
        <UButton
          :variant="
            editor.isActive('heading', { level: 3 }) ? 'solid' : 'ghost'
          "
          color="neutral"
          size="xs"
          icon="i-ph:text-h-three"
          :disabled="
            !editor.can().chain().focus().toggleHeading({ level: 3 }).run()
          "
          square
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        />
      </UTooltip>
      <UTooltip text="Bold" :popper="{ arrow: true, placement: 'bottom' }">
        <UButton
          :variant="editor.isActive('bold') ? 'solid' : 'ghost'"
          color="neutral"
          size="xs"
          icon="i-ph:text-bolder"
          :disabled="!editor.can().chain().focus().toggleBold().run()"
          square
          @click="editor.chain().focus().toggleBold().run()"
        />
      </UTooltip>
      <UTooltip text="Italic" :popper="{ arrow: true, placement: 'bottom' }">
        <UButton
          :variant="editor.isActive('italic') ? 'solid' : 'ghost'"
          color="neutral"
          size="xs"
          icon="i-ph:text-italic"
          :disabled="!editor.can().chain().focus().toggleItalic().run()"
          square
          @click="editor.chain().focus().toggleItalic().run()"
        />
      </UTooltip>
      <UTooltip
        text="Strike through"
        :popper="{ arrow: true, placement: 'bottom' }"
      >
        <UButton
          :variant="editor.isActive('strike') ? 'solid' : 'ghost'"
          color="neutral"
          size="xs"
          icon="i-ph:text-strikethrough"
          :disabled="!editor.can().chain().focus().toggleStrike().run()"
          square
          @click="editor.chain().focus().toggleStrike().run()"
        />
      </UTooltip>
      <UTooltip text="Code" :popper="{ arrow: true, placement: 'bottom' }">
        <UButton
          :variant="editor.isActive('code') ? 'solid' : 'ghost'"
          color="neutral"
          size="xs"
          icon="i-ph:code"
          :disabled="!editor.can().chain().focus().toggleCode().run()"
          square
          @click="editor.chain().focus().toggleCode().run()"
        />
      </UTooltip>
      <UTooltip
        text="Block quote"
        :popper="{ arrow: true, placement: 'bottom' }"
      >
        <UButton
          :variant="editor.isActive('blockquote') ? 'solid' : 'ghost'"
          color="neutral"
          size="xs"
          icon="i-ph:quotes"
          :disabled="!editor.can().chain().focus().toggleBlockquote().run()"
          square
          @click="editor.chain().focus().toggleBlockquote().run()"
        />
      </UTooltip>
      <UTooltip
        text="Bullet list"
        :popper="{ arrow: true, placement: 'bottom' }"
      >
        <UButton
          :variant="editor.isActive('bulletList') ? 'solid' : 'ghost'"
          color="neutral"
          size="xs"
          icon="i-ph:list-bullets"
          :disabled="!editor.can().chain().focus().toggleBulletList().run()"
          square
          @click="editor.chain().focus().toggleBulletList().run()"
        />
      </UTooltip>
      <UTooltip
        text="Ordered list"
        :popper="{ arrow: true, placement: 'bottom' }"
      >
        <UButton
          :variant="editor.isActive('orderedList') ? 'solid' : 'ghost'"
          color="neutral"
          size="xs"
          icon="i-ph:list-numbers"
          :disabled="!editor.can().chain().focus().toggleOrderedList().run()"
          square
          @click="editor.chain().focus().toggleOrderedList().run()"
        />
      </UTooltip>
      <UTooltip text="Text left" :popper="{ arrow: true, placement: 'bottom' }">
        <UButton
          :variant="editor.isActive({ textAlign: 'left' }) ? 'solid' : 'ghost'"
          color="neutral"
          size="xs"
          icon="ph:text-align-left"
          :disabled="!editor.can().chain().focus().setTextAlign('left').run()"
          square
          @click="editor.chain().focus().setTextAlign('left').run()"
        />
      </UTooltip>
      <UTooltip
        text="Text center"
        :popper="{ arrow: true, placement: 'bottom' }"
      >
        <UButton
          :variant="
            editor.isActive({ textAlign: 'center' }) ? 'solid' : 'ghost'
          "
          color="neutral"
          size="xs"
          icon="ph:text-align-center"
          :disabled="!editor.can().chain().focus().setTextAlign('center').run()"
          square
          @click="editor.chain().focus().setTextAlign('center').run()"
        />
      </UTooltip>
      <UTooltip
        text="Text right"
        :popper="{ arrow: true, placement: 'bottom' }"
      >
        <UButton
          :variant="editor.isActive({ textAlign: 'right' }) ? 'solid' : 'ghost'"
          color="neutral"
          size="xs"
          icon="ph:text-align-right"
          :disabled="!editor.can().chain().focus().setTextAlign('right').run()"
          square
          @click="editor.chain().focus().setTextAlign('right').run()"
        />
      </UTooltip>
      <UTooltip
        text="Text justify"
        :popper="{ arrow: true, placement: 'bottom' }"
      >
        <UButton
          :variant="
            editor.isActive({ textAlign: 'justify' }) ? 'solid' : 'ghost'
          "
          color="neutral"
          size="xs"
          icon="ph:text-align-justify"
          :disabled="
            !editor.can().chain().focus().setTextAlign('justify').run()
          "
          square
          @click="editor.chain().focus().setTextAlign('justify').run()"
        />
      </UTooltip>
    </div>

    <div
      class="rounded-lg border border-neutral-300 bg-neutral-50 p-4 transition hover:border-neutral-400"
    >
      <EditorContent v-model="editorModel" :editor="editor" />
    </div>
  </div>
</template>

<style lang="scss">
.tiptap {
  outline: none;

  :first-child {
    margin-top: 0;
  }

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
