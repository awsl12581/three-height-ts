import {
  BufferAttribute,
  BufferGeometry,
  Line,
  Mesh,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';
import Resizer from '@/modules/world/resizer/resizer';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';
import helper from '@/modules/world/helper/helper';
import cameraModule from '@/modules/world/camera/camera';
import rendererModule from '@/modules/world/renderer/renderer';
import sceneModule from '@/modules/world/scene/scene';
import voronoi from '@/modules/voronoi/voronoi';
import { triangleOfEdge } from '@/modules/voronoi/voronoiUtils';
import { Water } from 'three/examples/jsm/objects/Water';

class World {
  private camera: PerspectiveCamera;

  private renderer: WebGLRenderer;

  private scene: Scene;

  private readonly canvas: HTMLElement;

  constructor(canvas: HTMLElement) {
    this.camera = cameraModule.createCamera();
    this.renderer = rendererModule.createRenderer(canvas);
    this.scene = sceneModule.createScene();
    this.canvas = canvas;
    console.log();
    const resizer = new Resizer.Resizer(canvas, this.camera, this.renderer);
  }

  render() {
    this.getRenderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render);
  }

  /**
   * 通用设置
   */
  init() {
    // 相机基础参数设置
    this.camera.position.set(0, 10, 20);
    this.camera.lookAt(new Vector3(0, 0, 0));
    // 初始化相机控制器
    const controls = new OrbitControls(this.camera, this.canvas);
    controls.update();
    // 灯光
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    this.scene.add(light);
    // 坐标辅助
    const axesHelper = helper.createAxesHelper();
    this.scene.add(axesHelper);
    // 网格辅助
    this.scene.add(helper.createGridHelper());
    // mesh实体
    // {
    //   // 定义折线的点
    //   const points = [
    //     new THREE.Vector3(0, 0, 0),
    //     new THREE.Vector3(10, 10, 0),
    //     new THREE.Vector3(20, -10, 0),
    //     new THREE.Vector3(30, 10, 0),
    //     new THREE.Vector3(20, 0, 0),
    //   ];
    //
    //   // 创建 Catmull-Rom spline 曲线
    //   const curve = new THREE.CatmullRomCurve3(points, true);
    //
    //   // 创建网格并将其添加到场景中
    //   const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    //   const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(50));
    //   const line = new THREE.Line(geometry, material);
    //   this.scene.add(line);
    // }
    // {
    //   const boxGeometry = new BoxGeometry(2, 2, 2);
    //   const material = new MeshStandardMaterial({ color: 'purple' });
    //   material.roughness = 0.5;
    //   const cube = new Mesh(boxGeometry, material);
    //   this.scene.add(cube);
    //   cube.rotation.set(-0.5, -0.1, 0.8);
    // }
    {
      const bufferGeometry = new BufferGeometry();
      const count = 25;
      const seed = 5;

      const voronoiMap = new voronoi.VoronoiMap(count, seed);
      console.log(voronoiMap);
      const positions = voronoiMap.transfer3d();

      bufferGeometry.setAttribute('position', new BufferAttribute(positions, 3));
      const pointMaterial = new PointsMaterial({
        size: 0.5,
        sizeAttenuation: true,
        // color: 'red',
      });
      const paticles = new Points(bufferGeometry, pointMaterial);
      this.scene.add(paticles);

      const { points, centers, halfEdges, numEdges, vertices, cells } = voronoiMap;
      // for (let e = 0; e < cells.c.length; e += 1) {
      //   const pointLine = [];
      //   for (let y = 0; y < cells.c[e].length; y += 1) {
      //     pointLine.push(new THREE.Vector3(points[cells.c[e][y]].x, points[cells.c[e][y]].y, 1));
      //   }
      //   const geometry = new THREE.BufferGeometry().setFromPoints(pointLine);
      //   const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
      //   const line = new Line(geometry, lineMaterial);
      //   this.scene.add(line);
      // }
      const getTextCanvas1 = (e: number) => {
        const width = 512;
        const height = 256;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#C3C3C3';
          ctx.fillRect(0, 0, width, height);
          ctx.font = `${32}px " bold`;
          ctx.fillStyle = '#2891FF';

          ctx.fillText(`${e}`, 10, 30);
        }
        return canvas;
      };
      for (let e = 0; e < cells.v.length; e += 1) {
        // 定义多边形形状顶点
        const shape = new THREE.Shape();
        shape.moveTo(vertices.p[cells.v[e][0]].x, vertices.p[cells.v[e][0]].y);
        for (let y = 1; y < cells.v[e].length; y += 1) {
          shape.lineTo(vertices.p[cells.v[e][y]].x, vertices.p[cells.v[e][y]].y);
        }
        shape.lineTo(vertices.p[cells.v[e][0]].x, vertices.p[cells.v[e][0]].y);
        // const geometry = new THREE.ShapeGeometry(shape);
        const geometry = new THREE.ExtrudeGeometry(shape, {
          steps: 2,
          depth: Math.random() * 10,
        });
        const material = new THREE.MeshPhongMaterial({
          color: 0x00ff00,
          side: THREE.DoubleSide,
          map: new THREE.CanvasTexture(getTextCanvas1(e)),
        });
        // const mesh = new THREE.Mesh(geometry, material);
        const line = new Mesh(geometry, material);
        this.scene.add(line);
      }
      // Water

      const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

      const water = new Water(waterGeometry, {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load(
          '/waternormals.jpg',
          (texture: THREE.Texture) => {
            // eslint-disable-next-line no-param-reassign
            texture.wrapS = THREE.RepeatWrapping;
            // eslint-disable-next-line no-param-reassign
            texture.wrapT = THREE.RepeatWrapping;
          }
        ),
        sunDirection: new THREE.Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: this.scene.fog !== undefined,
      });

      water.rotation.x = -Math.PI / 2;

      this.scene.add(water);
      // for (let e = 0; e < numEdges; e += 1) {
      //   if (e < halfEdges[e]) {
      //     const p = centers[triangleOfEdge(e)];
      //     const q = centers[triangleOfEdge(halfEdges[e])];
      //     const pointLine = [];
      //     pointLine.push(new THREE.Vector3(p.x, p.y, 3));
      //     pointLine.push(new THREE.Vector3(q.x, q.y, 3));
      //     const geometry = new THREE.BufferGeometry().setFromPoints(pointLine);
      //     const lineMaterial = new THREE.LineBasicMaterial({ color: 'white' });
      //     const line = new Line(geometry, lineMaterial);
      //     this.scene.add(line);
      //   }
      // }
    }
  }

  get getCamera(): PerspectiveCamera {
    return this.camera;
  }

  get getRenderer(): WebGLRenderer {
    return this.renderer;
  }

  get getScene(): Scene {
    return this.scene;
  }
}

export default {
  World,
};
