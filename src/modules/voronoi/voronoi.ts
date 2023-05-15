import Delaunator from 'delaunator';
import { Vector3 } from 'three';
import {
  calculateCentroids, circumcenter,
  createPoints,
  edgesAroundPoint, edgesOfTriangle,
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

  numRegions: number;

  numTriangles: number;

  numEdges: number;

  halfEdges: Int32Array;

  triangles: Uint32Array;

  centers: Array<CoordinateValue2d>;

  cells!: VoronoiCells;

  vertices!: VoronoiVertices;

  /**
   * 通过库计算所需数据，创建voronoi类
   * @param count
   * @param seed
   */
  constructor(count: number, seed: number) {
    this.points = createPoints(count, seed);
    const delaunay = Delaunator.from(this.points, (loc) => loc.x, (loc) => loc.y);
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
    for (let e = 0; e < this.triangles.length; e += 1) {
      const p = this.triangles[nextHalfedge(e)];
      if (p < this.points.length && !this.cells.c[p]) {
        const edges = edgesAroundPoint(this.halfEdges, e);
        // cell: adjacent vertex
        this.cells.v[p] = edges.map((edgeIndex) => triangleOfEdge(edgeIndex));
        this.cells.c[p] = edges.map((edgeIndex) => this.triangles[edgeIndex])
          .filter((c: number) => c < this.points.length); // cell: adjacent valid cells
        this.cells.b[p] = edges.length > this.cells.c[p].length ? 1 : 0; // cell: is border
      }

      const t = triangleOfEdge(e);
      if (!this.vertices.p[t]) {
        this.vertices.p[t] = this.triangleCenter(t); // vertex: coordinates
        this.vertices.v[t] = this.trianglesAdjacentToTriangle(t); // vertex: adjacent vertices
        this.vertices.c[t] = this.pointsOfTriangle(t); // vertex: adjacent cells
      }
    }
  }

  triangleCenter(t: number) {
    const vertices = this.pointsOfTriangle(t)
      .map((p: number) => this.points[p]);
    return circumcenter(vertices[0], vertices[1], vertices[2]);
  }

  pointsOfTriangle(t: number) {
    return edgesOfTriangle(t)
      .map((edge) => this.triangles[edge]);
  }

  trianglesAdjacentToTriangle(t: number) {
    const triangles = [];
    for (let i = 0; i < edgesOfTriangle(t).length; i += 1) {
      const edge = edgesOfTriangle(t)[i];
      const opposite = this.halfEdges[edge];
      triangles.push(triangleOfEdge(opposite));
    }
    return triangles;
  }
}

export default {
  VoronoiMap,
};
