<template>
  <div id="process-panel" @mousedown="mousedown" v-show="isVisit">
    <el-row class="row-bg" justify="space-between">
      <el-col :span="6">
        <div class="msg">{{ title }}</div>
      </el-col>
      <el-col :span="6">
        <el-icon @click="panelClose">
          <Close/>
        </el-icon>
      </el-col>
    </el-row>
    <el-divider class="divider"/>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import panelDrag from '@/utils/panelDrag';
import { Close } from '@element-plus/icons-vue';
import { ref } from 'vue';

const title = ref('1234');

const mousedown = (e: any) => {
  const panelElement = document.getElementById('process-panel');
  panelDrag.mousedown(e, panelElement);
};

const isVisit = ref(true);
const panelClose = () => {
  isVisit.value = false;
};

</script>

<style scoped>
#process-panel {
  position: absolute;
  z-index: 99;
  background-color: aliceblue;
  border: 1px solid white;
  border-radius: 5px;
  padding: 5px;
  margin: 5px;
}

.msg {
  right: 0;
}

.row-bg {
  margin-bottom: 5px;
}

.divider {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
