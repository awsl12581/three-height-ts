<template>
<MobilePanel>
  <div>
    <el-color-picker v-model="color" show-alpha />
    <el-time-select
      v-model="value"
      start="08:30"
      step="00:15"
      end="18:30"
      placeholder="Select time"
    />
  </div>
</MobilePanel>
</template>

<script setup lang="ts">
import MobilePanel from '@/components/MobilePanel.vue';
import { ref } from 'vue';

const value = ref('');
const color = ref('rgba(19, 206, 102, 0.8)');
</script>

<style scoped>

</style>
