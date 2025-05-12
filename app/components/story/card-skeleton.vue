<template>
  <div class="rounded border border-neutral-300 p-4">
    <div class="group flex items-center gap-x-2">
      <USkeleton class="w-[40px] h-[40px] rounded-full" />
      <div class="space-y-2">
        <USkeleton class="w-20 h-3" />
        <USkeleton class="w-12 h-2" />
      </div>
    </div>

    <div class="mt-1 ml-12">
      <USkeleton class="w-64 h-8" />

      <div class="mt-2 space-x-1 flex">
        <USkeleton class="h-4 w-16" />
        <USkeleton class="h-4 w-16" />
        <USkeleton class="h-4 w-16" />
      </div>
    </div>
  </div>
</template>
