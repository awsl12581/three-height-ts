import v1 from '@/modules/voronoi/voronoi';
import { createNoise2D } from 'simplex-noise';

const WAVELENGTH = 0.5;
// 地形生成器
const assignElevation = (map: any) => {
  const noise2D = createNoise2D();
  const { points, numRegions } = map;
  const elevation = [];
  for (let r = 0; r < numRegions; r += 1) {
    const nx = points[r].x / 25 - 1 / 2;
    const ny = points[r].y / 25 - 1 / 2;
    // start with noise:
    elevation[r] = (1 + noise2D(nx / WAVELENGTH, ny / WAVELENGTH)) / 2;
    // modify noise to make islands:
    const d = 2 * Math.max(Math.abs(nx), Math.abs(ny)); // should be 0-1
    elevation[r] = (1 + elevation[r] - d) / 2;
  }
  return elevation;
};
