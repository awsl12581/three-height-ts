import { Color, Scene } from 'three';

function createScene() {
  const scene = new Scene();

  scene.background = new Color('grey');

  return scene;
}

export default { createScene };
