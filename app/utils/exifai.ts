async function processImageRotation(file: File): Promise<ProcessedImage> {
  // 读取方向信息（1-8）
  const orientation = (await exifr.parse(file, { orientation: true }) || 1) as number;

  // 创建并加载图片
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });

  // 根据方向确定画布尺寸
  const [canvasWidth, canvasHeight] = (orientation >= 5 && orientation <= 8)
    ? [img.naturalHeight, img.naturalWidth] // 宽高交换
    : [img.naturalWidth, img.naturalHeight];

  // 创建画布
  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // 将画布添加到 HTML 中以便调试
  document.body.appendChild(canvas); // 将 canvas 插入到 body 中
  canvas.style.border = '1px solid red'; // 添加边框以便更容易看到

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');

  // 应用方向变换
  ctx.save();
  applyCanvasTransform(ctx, orientation, img.naturalWidth, img.naturalHeight);

  // 绘制原始图片
  ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
  ctx.restore();

  // 转换为Blob
  return new Promise<ProcessedImage>((resolve) => {
    canvas.toBlob((blob) => {
      URL.revokeObjectURL(img.src);
      if (!blob) throw new Error('Canvas toBlob failed');

      resolve({
        blob,
        width: canvas.width,
        height: canvas.height
      });
    }, 'image/jpeg', 0.8);
  });
}

function applyCanvasTransform(
  ctx: CanvasRenderingContext2D,
  orientation: number,
  width: number,
  height: number
): void {
  switch(orientation) {
    case 2: // 水平翻转
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      break;
    case 3: // 旋转180度
      ctx.translate(width, height);
      ctx.rotate(Math.PI);
      break;
    case 4: // 垂直翻转
      ctx.translate(0, height);
      ctx.scale(1, -1);
      break;
    case 5: // 顺时针90度 + 水平翻转
      ctx.translate(height, 0);
      ctx.rotate(Math.PI / 2);
      ctx.scale(-1, 1);
      break;
    case 6: // 顺时针90度
      ctx.translate(height, 0);
      ctx.rotate(Math.PI / 2);
      break;
    case 7: // 顺时针90度 + 垂直翻转
      ctx.translate(height, width);
      ctx.rotate(Math.PI / 2);
      ctx.scale(1, -1);
      break;
    case 8: // 逆时针90度
      ctx.translate(0, width);
      ctx.rotate(-Math.PI / 2);
      break;
    default: // 1或其他
      break;
  }
}
