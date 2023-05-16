<template>
  <div id="main">
    <BasePanel></BasePanel>
    <ThreeScene></ThreeScene>
  </div>
</template>

<script setup lang="ts">
import ThreeScene from '@/views/ThreeScene.vue';
import BasePanel from '@/components/BasePanel.vue';
</script>

<style>
#main {
  position: relative;
}
</style>
