<script setup lang="ts">
const notificationType = ref<'all' | 'unread'>('all')
</script>

<template>
  <UModal
    title="Notifikasi"
    description="Tetap update dengan pemberitahuan terbaru"
    class="max-w-xl sm:max-h-[50dvh]"
    :ui="{ body: 'sm:p-0' }"
  >
    <template #body>
      <div class="bg-neutral-50 flex py-2 px-4 items-center justify-between">
        <div class="flex gap-2">
          <UButton
            size="sm"
            variant="ghost"
            :color="notificationType === 'all' ? 'primary' : 'neutral'"
            @click="notificationType = 'all'"
            >Semua</UButton
          >
          <UButton
            size="sm"
            variant="ghost"
            :color="notificationType === 'unread' ? 'primary' : 'neutral'"
            @click="notificationType = 'unread'"
            >Belum terbaca (12)</UButton
          >
        </div>

        <UButton
          size="sm"
          icon="lucide:check-check"
          variant="ghost"
          color="primary"
          >Tandai semua sudah dibaca</UButton
        >
      </div>

      <div class="pt-4 space-y-4">
        <div class="flex flex-col">
          <small class="text-neutral-600 px-6 mb-1 font-medium">Hari ini</small>
          <div
            v-for="i in [12, 3, 4, 5, 55]"
            :key="i"
            class="hover:bg-neutral-50 transition px-6"
            :class="{ 'bg-primary-50': false }"
          >
            <div
              class="grid items-center grid-cols-[50px_minmax(0,1fr)] py-3 border-b"
            >
              <UAvatar alt="Albed" size="lg" />
              <div>
                <p class="truncate">
                  <b>John Doe tidur</b>
                  <span> sendiri di dalam topi sambil berselimut jerami </span>
                </p>
                <small class="text-neutral-500">1h yang lalu</small>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col">
          <small class="text-neutral-600 px-6 mb-1 font-medium">Kemarin</small>
          <div
            v-for="i in [12, 3, 4, 5, 55]"
            :key="i"
            class="hover:bg-neutral-50 transition px-6"
            :class="{ 'bg-primary-50': false }"
          >
            <div
              class="grid items-center grid-cols-[50px_minmax(0,1fr)] py-3 border-b"
            >
              <UAvatar alt="Albed" size="lg" />
              <div>
                <p class="truncate">
                  <b>John Doe tidur</b>
                  <span> sendiri di dalam topi sambil berselimut jerami </span>
                </p>
                <small class="text-neutral-500">1h yang lalu</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>
