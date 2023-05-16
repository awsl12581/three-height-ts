/**
 * 定义points中的二维向量，一般为{x,y}
 */
interface CoordinateValue2d {
  x: number,
  y: number,
}

interface VoronoiCells {
  /**
   * 入度边`p`，存储入度边集合
   * 从计算程度上来看，通过`edgesAroundPoint`函数，其入度边在映射中只属于一个集合
   *
   * 只要传入一个集合中的任意一条入度边，其返回集合都是一致的
   */
  v: Array<Array<number>>,
  /**
   * 对每一个入度边`p`，计算其相邻的对边集合
   */
  c: Array<Array<number>>,
  /**
   * 标定其是否为边界
   */
  b: Array<number>,
}

interface VoronoiVertices {
  /**
   * 三角形`t` 【心】的坐标
   */
  p: Array<CoordinateValue2d>;
  /**
   * 三角形`t` 周围三角形的id集合
   * 周围：三条边的对（临）边所在的三角形id
   */
  v: Array<Array<number>>;
  /**
   * 三角形`t`三个点的索引id(其在Points中的位置)
   *
   */
  c: Array<Array<number>>;
}

export {
  CoordinateValue2d,
  VoronoiCells,
  VoronoiVertices,
};
