<script setup lang="ts">
import { EditorContent, Editor } from '@tiptap/vue-3'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import TextAlign from '@tiptap/extension-text-align'
import StarterKit from '@tiptap/starter-kit'

const editorModel = defineModel('editor')

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
      // @ts-ignore
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
      class="mb-2 flex w-fit flex-wrap items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-2 py-1"
    >
      <UTooltip text="Heading 2" :popper="{ arrow: true, placement: 'bottom' }">
        <UButton
          :variant="
            editor.isActive('heading', { level: 2 }) ? 'solid' : 'ghost'
          "
          color="black"
          size="xs"
          icon="i-ph:text-h-two"
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :disabled="
            !editor.can().chain().focus().toggleHeading({ level: 2 }).run()
          "
          square
        />
      </UTooltip>
      <UTooltip text="Heading 3" :popper="{ arrow: true, placement: 'bottom' }">
        <UButton
          :variant="
            editor.isActive('heading', { level: 3 }) ? 'solid' : 'ghost'
          "
          color="black"
          size="xs"
          icon="i-ph:text-h-three"
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          :disabled="
            !editor.can().chain().focus().toggleHeading({ level: 3 }).run()
          "
          square
        />
      </UTooltip>
      <UTooltip text="Bold" :popper="{ arrow: true, placement: 'bottom' }">
        <UButton
          :variant="editor.isActive('bold') ? 'solid' : 'ghost'"
          color="black"
          size="xs"
          icon="i-ph:text-bolder"
          @click="editor.chain().focus().toggleBold().run()"
          :disabled="!editor.can().chain().focus().toggleBold().run()"
          square
        />
      </UTooltip>
      <UTooltip text="Italic" :popper="{ arrow: true, placement: 'bottom' }">
        <UButton
          :variant="editor.isActive('italic') ? 'solid' : 'ghost'"
          color="black"
          size="xs"
          icon="i-ph:text-italic"
          @click="editor.chain().focus().toggleItalic().run()"
          :disabled="!editor.can().chain().focus().toggleItalic().run()"
          square
        />
      </UTooltip>
      <UTooltip
        text="Strike through"
        :popper="{ arrow: true, placement: 'bottom' }"
      >
        <UButton
          :variant="editor.isActive('strike') ? 'solid' : 'ghost'"
          color="black"
          size="xs"
          icon="i-ph:text-strikethrough"
          @click="editor.chain().focus().toggleStrike().run()"
          :disabled="!editor.can().chain().focus().toggleStrike().run()"
          square
        />
      </UTooltip>
      <UTooltip text="Code" :popper="{ arrow: true, placement: 'bottom' }">
        <UButton
          :variant="editor.isActive('code') ? 'solid' : 'ghost'"
          color="black"
          size="xs"
          icon="i-ph:code"
          @click="editor.chain().focus().toggleCode().run()"
          :disabled="!editor.can().chain().focus().toggleCode().run()"
          square
        />
      </UTooltip>
      <UTooltip
        text="Block quote"
        :popper="{ arrow: true, placement: 'bottom' }"
      >
        <UButton
          :variant="editor.isActive('blockquote') ? 'solid' : 'ghost'"
          color="black"
          size="xs"
          icon="i-ph:quotes"
          @click="editor.chain().focus().toggleBlockquote().run()"
          :disabled="!editor.can().chain().focus().toggleBlockquote().run()"
          square
        />
      </UTooltip>
      <UTooltip
        text="Bullet list"
        :popper="{ arrow: true, placement: 'bottom' }"
      >
        <UButton
          :variant="editor.isActive('bulletList') ? 'solid' : 'ghost'"
          color="black"
          size="xs"
          icon="i-ph:list-bullets"
          @click="editor.chain().focus().toggleBulletList().run()"
          :disabled="!editor.can().chain().focus().toggleBulletList().run()"
          square
        />
      </UTooltip>
      <UTooltip
        text="Ordered list"
        :popper="{ arrow: true, placement: 'bottom' }"
      >
        <UButton
          :variant="editor.isActive('orderedList') ? 'solid' : 'ghost'"
          color="black"
          size="xs"
          icon="i-ph:list-numbers"
          @click="editor.chain().focus().toggleOrderedList().run()"
          :disabled="!editor.can().chain().focus().toggleOrderedList().run()"
          square
        />
      </UTooltip>
      <UTooltip text="Text left" :popper="{ arrow: true, placement: 'bottom' }">
        <UButton
          :variant="editor.isActive({ textAlign: 'left' }) ? 'solid' : 'ghost'"
          color="black"
          size="xs"
          icon="ph:text-align-left"
          @click="editor.chain().focus().setTextAlign('left').run()"
          :disabled="!editor.can().chain().focus().setTextAlign('left').run()"
          square
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
          color="black"
          size="xs"
          icon="ph:text-align-center"
          @click="editor.chain().focus().setTextAlign('center').run()"
          :disabled="!editor.can().chain().focus().setTextAlign('center').run()"
          square
        />
      </UTooltip>
      <UTooltip
        text="Text right"
        :popper="{ arrow: true, placement: 'bottom' }"
      >
        <UButton
          :variant="editor.isActive({ textAlign: 'right' }) ? 'solid' : 'ghost'"
          color="black"
          size="xs"
          icon="ph:text-align-right"
          @click="editor.chain().focus().setTextAlign('right').run()"
          :disabled="!editor.can().chain().focus().setTextAlign('right').run()"
          square
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
          color="black"
          size="xs"
          icon="ph:text-align-justify"
          @click="editor.chain().focus().setTextAlign('justify').run()"
          :disabled="
            !editor.can().chain().focus().setTextAlign('justify').run()
          "
          square
        />
      </UTooltip>
    </div>

    <div
      class="rounded-lg border border-gray-300 bg-gray-50 p-4 transition hover:border-gray-400"
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
