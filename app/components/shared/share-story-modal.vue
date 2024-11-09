<script setup lang="ts">
const isOpen = defineModel<boolean>('open')
</script>

<template>
  <UModal v-model="isOpen">
    <div class="p-4">
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolorem velit
        debitis ratione iste modi cupiditate saepe praesentium, inventore
        explicabo fugiat reiciendis placeat quod. Maxime, quas quod asperiores
        eos iure corrupti?
      </p>
    </div>
  </UModal>
</template>
