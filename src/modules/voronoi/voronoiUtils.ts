import { CoordinateValue2d } from '@/modules/voronoi/voronoiInterface';
import Delaunator from 'delaunator';

/**
 * 同一个三角形，计算下一个半边索引
 * @param e
 */
const nextHalfedge = (e: number) => (e % 3 === 2 ? e - 2 : e + 1);

/**
 * 同一个三角形，计算上一个半边
 * @param e
 */
const prevHalfedge = (e: number) => (e % 3 === 0 ? e + 2 : e - 1);

/**
 * 给定三角形的三个索引点
 * @param t 给定的三角形id
 */
const edgesOfTriangle = (t: number) => [3 * t, 3 * t + 1, 3 * t + 2];

/**
 * 给定一个半边id，其所属的三角形
 * @param e
 */
const triangleOfEdge = (e: number) => Math.floor(e / 3);

const edgesAroundPoint = (halfedges: Int32Array, start: number) => {
  const result = [];
  let incoming = start;
  do {
    result.push(incoming);
    const outgoing = nextHalfedge(incoming);
    incoming = halfedges[outgoing];
  } while (incoming !== -1 && incoming !== start && result.length < 20);
  return result;
};

/**
 * 根据需求计算随机点
 * @param count 级数，计算时数量为 count*count
 * @param seed 偏移值种子
 * @return {x:number,y:number}[{x,y}]
 *
 */
const createPoints = (count: number, seed: number) => {
  /**
   * [{1,1},{2,2}]
   */
  const points = [];
  for (let x = 0; x < count; x += 1) {
    for (let y = 0; y < count; y += 1) {
      points.push({
        x: 2 * x + seed * (Math.random() - Math.random()),
        y: y + seed * (Math.random() - Math.random()),
      });
    }
  }
  return points;
};

/**
 * 质心计算,中线的交点
 * @param points
 * @param delaunay
 */
const calculateCentroids = (
  points: Array<CoordinateValue2d>,
  delaunay: Delaunator<CoordinateValue2d>,
): Array<CoordinateValue2d> => {
  const numTriangles = delaunay.halfedges.length / 3;
  const centroids: Array<CoordinateValue2d> = [];
  for (let t = 0; t < numTriangles; t += 1) {
    let sumOfX = 0;
    let sumOfY = 0;
    for (let i = 0; i < 3; i += 1) {
      const s = 3 * t + i;
      const p = points[delaunay.triangles[s]];
      sumOfX += p.x;
      sumOfY += p.y;
    }
    centroids[t] = {
      x: sumOfX / 3,
      y: sumOfY / 3,
    };
  }
  return centroids;
};

/**
 *
 * @param a 三角形点A
 * @param b 点B
 * @param c 点C
 * @returns 外心坐标
 */
const circumcenter = (a: CoordinateValue2d, b: CoordinateValue2d, c: CoordinateValue2d) => {
  const re: CoordinateValue2d = {
    x: (a.x + b.x + c.x) / 3,
    y: (a.y + b.y + c.y) / 3,
  };
  return re;

  // const ad = a.x * a.x + a.y * a.y;
  // const bd = b.x * b.x + b.y * b.y;
  // const cd = c.x * c.x + c.y * c.y;
  // const D = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
  // return [
  //   // eslint-disable-next-line no-mixed-operators
  //   Math.floor(1 / D * (ad * (b.y - c.y) + bd * (c.y - a.y) + cd * (a.y - b.y))),
  //   // eslint-disable-next-line no-mixed-operators
  //   Math.floor(1 / D * (ad * (c.x - b.x) + bd * (a.x - c.x) + cd * (b.x - a.x))),
  // ];
};

export {
  nextHalfedge,
  prevHalfedge,
  edgesOfTriangle,
  triangleOfEdge,
  edgesAroundPoint,
  createPoints,
  calculateCentroids,
  circumcenter,
};
