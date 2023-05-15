import { PerspectiveCamera } from 'three';

const createCamera = () => {
  // 初始化相机
  const camera = new PerspectiveCamera(40, 2, 0.1, 1000);
  camera.position.set(0, 10, 20);
  camera.lookAt(0, 0, 0);

  return camera;
};

export default {
  createCamera,
};
