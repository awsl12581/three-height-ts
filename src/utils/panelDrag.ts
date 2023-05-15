/**
 *
 * @param event
 * @param panelElement
 */
const mousedown = (event: any, panelElement: HTMLElement | null) => {
  const p = panelElement as HTMLElement;
  // 鼠标按下时面板左上角的位置
  const pl = p.offsetLeft;
  const pt = p.offsetTop;
  document.onmousemove = (e1) => {
    document.documentElement.style.cursor = 'move';// 鼠标变成十字架
    // 鼠标移动的距离
    const l = event.clientX - e1.clientX;
    const t = event.clientY - e1.clientY;
    // 防止鼠标点击与拖拽冲突
    const d = Math.sqrt(l * l + t * t);
    if (d > 7) {
      p.style.left = `${pl - l}px`;
      p.style.top = `${pt - t}px`;
    } else {
      p.style.left = String(p.offsetLeft);
      p.style.top = String(p.offsetTop);
    }
  };
  document.onmouseup = () => {
    document.onmousemove = null;
    document.onmouseup = null;
    document.documentElement.style.cursor = '';// 恢复鼠标样式
  };
};

export default {
  mousedown,
};
