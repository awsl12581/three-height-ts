<!-- eslint-disable max-len -->
<template>
  <div>
    <canvas id="c2d" class="c2d" style="z-index:-1;"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import world from '@/modules/world/world';

onMounted(() => {
  // 获取canvas html-element
  const canvas = document.getElementById('c2d') as HTMLElement;
  canvas.setAttribute('width', `${window.innerWidth}`);
  canvas.setAttribute('height', `${window.innerHeight}`);
  // 世界创造
  const createdWorld = new world.World(canvas);
  // 初始化设置
  createdWorld.init();

  function render() {
    createdWorld.getRenderer.render(createdWorld.getScene, createdWorld.getCamera);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
});
</script>
