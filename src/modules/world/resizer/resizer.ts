import { PerspectiveCamera, WebGLRenderer } from 'three';

const setSize = (canvas: HTMLElement, camera: PerspectiveCamera, renderer: WebGLRenderer) => {
  // eslint-disable-next-line no-param-reassign
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
};

class Resizer {
  constructor(container: HTMLElement, camera: PerspectiveCamera, renderer: WebGLRenderer) {
    setSize(container, camera, renderer);
    /**
     * window 事件
     */
    window.addEventListener('resize', () => {
      console.log('窗口大小发生改变');
      // set the size again if a resize occurs
      setSize(container, camera, renderer);
    });
  }
}

export default { Resizer };
