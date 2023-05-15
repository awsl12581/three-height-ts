/**
 * 定义points中的二维向量，一般为{x,y}
 */
interface CoordinateValue2d {
  x: number,
  y: number,
}

interface VoronoiCells {
  v: Array<Array<number>>,
  c: Array<Array<number>>,
  b: Array<number>,
}

interface VoronoiVertices {
  p: Array<CoordinateValue2d>;
  v: Array<Array<number>>;
  c: Array<Array<number>>;
}

export {
  CoordinateValue2d,
  VoronoiCells,
  VoronoiVertices,
};
