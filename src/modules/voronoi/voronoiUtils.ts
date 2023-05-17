import { CoordinateValue2d } from '@/modules/voronoi/voronoiInterface';
import Delaunator from 'delaunator';

/**
 * 同一个三角形，计算下一个半边索引  [A--1-->B--2-->C--3-->A]
 * @param e 给定一条半边，他一定隶属于一个三角形（但不一定有其对边）
 */
const nextHalfedge = (e: number) => (e % 3 === 2 ? e - 2 : e + 1);

/**
 * 同一个三角形，计算上一个半边索引
 * @param e
 */
const prevHalfedge = (e: number) => (e % 3 === 0 ? e + 2 : e - 1);

/**
 * 三角形的边
 * @param t 给定的三角形id
 * @return [] 三角形对应的三条边id
 */
const edgesOfTriangle = (t: number) => {
  const a = 3 * t;
  const b = 3 * t + 1;
  const c = 3 * t + 2;
  return [a, b, c];
};

/**
 * 边对应的三角形
 * @param e 给定一条边id
 * @return t:number 边所在的三角形
 */
const triangleOfEdge = (e: number) => Math.floor(e / 3);

/**
 * 构建多边形所使用
 * @param halfedges 半边数组
 * @param start 一条半边
 * @returns 一个点的所有入度的边
 */
const edgesAroundPoint = (halfedges: Int32Array, start: number) => {
  const result = [];
  let incoming = start;
  do {
    // 对于一个半边，将其存储至结果集
    result.push(incoming);
    // 计算其下一个半边
    const outgoing = nextHalfedge(incoming);
    // 下一个半边的对边
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
 *
 * @param a 三角形点A
 * @param b 点B
 * @param c 点C
 * @returns 外心坐标
 */
const circumcenter = (a: CoordinateValue2d, b: CoordinateValue2d, c: CoordinateValue2d) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const ex = c.x - a.x;
  const ey = c.y - a.y;

  const bl = dx * dx + dy * dy;
  const cl = ex * ex + ey * ey;
  const d = 0.5 / (dx * ey - dy * ex);

  const x = a.x + (ey * bl - dy * cl) * d;
  const y = a.y + (dx * cl - ex * bl) * d;
  const re: CoordinateValue2d = {
    x,
    y,
  };
  return re;
};

/**
 * 外心计算,中线的交点
 * @param points
 * @param delaunay
 */
const calculateCentroids = (
  points: Array<CoordinateValue2d>,
  delaunay: Delaunator<CoordinateValue2d>
): Array<CoordinateValue2d> => {
  const numTriangles = delaunay.halfedges.length / 3;
  const centroids: Array<CoordinateValue2d> = [];
  for (let t = 0; t < numTriangles; t += 1) {
    const centerPoint = circumcenter(
      points[delaunay.triangles[3 * t + 0]],
      points[delaunay.triangles[3 * t + 1]],
      points[delaunay.triangles[3 * t + 2]]
    );
    centroids[t] = centerPoint;
  }
  return centroids;
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
