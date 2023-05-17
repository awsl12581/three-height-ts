import Delaunator from 'delaunator';
import { Vector3 } from 'three';
import {
  calculateCentroids,
  circumcenter,
  createPoints,
  edgesAroundPoint,
  edgesOfTriangle,
  nextHalfedge,
  triangleOfEdge,
} from '@/modules/voronoi/voronoiUtils';
import {
  CoordinateValue2d,
  VoronoiCells,
  VoronoiVertices,
} from '@/modules/voronoi/voronoiInterface';

/**
 * 本篇所使用的是
 * <a href="https://github.com/mapbox/delaunator">github</a>
 * 提供的三角抛分算法
 */
class VoronoiMap {
  /**
   * 随机计算点
   */
  points: Array<CoordinateValue2d>;

  /**
   * 随机点的数量
   */
  numRegions: number;

  /**
   * 半边数量/3 = 三角形数量
   */
  numTriangles: number;

  /**
   * 半边数量
   */
  numEdges: number;

  /**
   * 半边数组，索引形式进行存储
   * 对于一个半边e：(A----->B)
   *
   * triangles[e] = indexA 返回半边开始的Point索引 Point(idA)
   *
   * halfedges[e] = indexB 返回相邻三角形中的对边半边
   *                       如果没有相邻三角形则返回-1 Point(idB)
   */
  halfEdges: Int32Array;

  /**
   * 逆时针三个坐标索引组成一个三角形，形成整体数组
   * 三角形 t 的半边是 3*t 、 3*t + 1 和 3*t + 2
   * triangles[e] 返回半边开始的点id，因此三角形的三个点的坐标索引在triangles是紧邻的
   */
  triangles: Uint32Array;

  /**
   * 计算出的基于三角剖分的三角形的外心的平面坐标位置
   */
  centers: Array<CoordinateValue2d>;

  /**
   * 计算出的，关于维诺图胞体的集合
   */
  cells!: VoronoiCells;

  /**
   * 计算出的，关于维诺图边的集合
   */
  vertices!: VoronoiVertices;

  /**
   * 通过库计算所需数据，创建voronoi类
   * @param count
   * @param seed
   */
  constructor(count: number, seed: number) {
    this.points = createPoints(count, seed);
    const delaunay = Delaunator.from(
      this.points,
      (loc) => loc.x,
      (loc) => loc.y
    );
    this.numRegions = this.points.length;
    this.numTriangles = delaunay.halfedges.length / 3;
    this.numEdges = delaunay.halfedges.length;
    this.halfEdges = delaunay.halfedges;
    this.triangles = delaunay.triangles;
    this.centers = calculateCentroids(this.points, delaunay);
    this.cells = {
      v: [],
      c: [],
      b: [],
    };
    this.vertices = {
      p: [],
      v: [],
      c: [],
    };
    this.createVoronoiCells();
  }

  /**
   * 返回three需要的坐标数组
   * @return [x1,y1,0,x2,y2,0,...]
   */
  transfer3d() {
    const positions = new Float32Array(this.points.length * 3);

    for (let i = 0; i < this.points.length; i += 3) {
      positions[i] = this.points[i].x;
      positions[i + 1] = this.points[i].y;
      positions[i + 2] = 0;
    }
    return positions;
  }

  /**
   * 返回threejs需要的vector3数组
   * @return [vector3(x,y,0),...]
   */
  transferVector3() {
    const positions: Array<Vector3> = [];
    for (let i = 0; i < this.points.length; i += 1) {
      const point = this.points[i];
      positions.push(new Vector3(point.x, point.y, 0));
    }
    return positions;
  }

  /**
   * 创建维诺图胞体
   * @private
   */
  private createVoronoiCells() {
    // 针对于triangles每一个点（一定会有重复的索引数）
    // 每一个点表示一个半边的开始点，将其视为income
    // 由于triangles[e] 返回半边开始的点id
    // 对于每一个半边e
    for (let e = 0; e < this.triangles.length; e += 1) {
      // 计算传入半边下一个半边的开始点（也就是本胞体的中心点位置）（临边，就是双向边的另一部分）
      const p = this.triangles[nextHalfedge(e)];
      // 如果这个临边id在点的范围
      if (p < this.points.length && !this.cells.c[p]) {
        // 计算传入临边所指向的点的所有入度边的集合
        const edges = edgesAroundPoint(this.halfEdges, e);
        // 对每一个核心点p，通过指向核心p的入度边，计算p周围的三角形的id
        this.cells.v[p] = edges.map((edgeIndex) => triangleOfEdge(edgeIndex));
        // 对每一个核心点p，计算核心p的出度边，对于每一个出度边进行判断
        this.cells.c[p] = edges
          .map((edgeIndex) => this.triangles[edgeIndex])
          .filter((c: number) => c < this.points.length); // cell: adjacent valid cells
        // 标定其是否为边界
        this.cells.b[p] = edges.length > this.cells.c[p].length ? 1 : 0; // cell: is border
      }

      // 对于每一个半边e，计算其所在的三角形编号
      const t = triangleOfEdge(e);
      if (!this.vertices.p[t]) {
        // 计算器三角形的心Point
        this.vertices.p[t] = this.triangleCenter(t); // vertex: coordinates
        // 计算其周围三角形的id
        this.vertices.v[t] = this.trianglesAdjacentToTriangle(t); // vertex: adjacent vertices
        // 计算三角形三个点的索引
        this.vertices.c[t] = this.pointsOfTriangle(t); // vertex: adjacent cells
      }
    }
  }

  /**
   * 给定一个三角形`t{A--[1]-->B--[2]-->C--[3]-->A}`
   *
   * 返回其外心左边Point
   *
   * @param t 三角形id
   * @returns 对应三角形的外心
   */
  triangleCenter(t: number) {
    // 三条边的坐标集合数组
    const vertices = this.pointsOfTriangle(t).map((p: number) => this.points[p]);

    return circumcenter(vertices[0], vertices[1], vertices[2]);
  }

  /**
   * @param t 三角形id
   * @returns 返回三角形的三个点在points的索引
   */
  pointsOfTriangle(t: number) {
    // map() 方法返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值。
    return edgesOfTriangle(t).map((edge) => this.triangles[edge]);
  }

  /**
   * 给定三角形周围邻近的三角形id数组<=3
   * @param t 给定的三角形id
   * @returns 计算给定三角形周围邻近的三角形（紧邻三条边的三角形）
   */
  trianglesAdjacentToTriangle(t: number) {
    const triangles = [];
    const edges = edgesOfTriangle(t);
    // 针对三角形的每个边
    for (let i = 0; i < edges.length; i += 1) {
      const edge = edges[i];
      // 计算其另一个半边id
      const opposite = this.halfEdges[edge];
      // 计算对应半边所在的三角形
      triangles.push(triangleOfEdge(opposite));
    }
    return triangles;
  }
}

export default {
  VoronoiMap,
};
