import * as THREE from 'three';

/**
 * 网格结构辅助
 */
const createGridHelper = () => {
  // 200表示网格模型的尺寸大小，25表示纵横细分线条数量
  const gridHelper = new THREE.GridHelper(200, 25);
  // gridHelper和普通的网格模型、线模型一样需要插入到场景中才会被渲染显示出来
  gridHelper.position.set(0, 0, 0);
  return gridHelper;
};

/**
 * 世界坐标系
 */
const createAxesHelper = () => {
  const axesHelper = new THREE.AxesHelper(150);
  return axesHelper;
};

export default {

  createGridHelper,
  createAxesHelper,

};
