<template>
  <Suspense>
    <template #default>
      <HomeView />
    </template>
    <template #fallback>
      <div>
        全速加载...
      </div>
    </template>
  </Suspense>
</template>

<script setup>
import HomeView from '@/views/HomeView.vue';

</script>

<style scoped>

</style>
