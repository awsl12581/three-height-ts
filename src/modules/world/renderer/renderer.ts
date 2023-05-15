import * as THREE from 'three';

const createRenderer = (canvas: HTMLElement) => {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  // 物理光计算
  // renderer.physicallyCorrectLights = true;
  renderer.useLegacyLights = true;
  return renderer;
};

export default {
  createRenderer,
};
