export const createImage = (url) => new Promise((resolve, reject) => {
  const image = new Image();
  image.addEventListener('load', () => resolve(image));
  image.addEventListener('error', (error) => reject(error));
  image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
  image.src = url;
});

/**
 * code source  https://codesandbox.io/s/q8q1mnr01w
 * 若要擴充功能，可詳細參考 https://www.npmjs.com/package/react-easy-crop 的文件
 */
export default async function getCroppedImg(
  imageSrc,
  pixelCrop,
) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  // set canvas size to match the bounding box
  canvas.width = image.width;
  canvas.height = image.height;

  // draw image
  ctx.drawImage(image, 0, 0);

  // croppedAreaPixels values are bounding box relative
  // extract the cropped image using these values
  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
  );

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated rotate image at the top left corner
  ctx.putImageData(data, 0, 0);

  // 壓縮 base64 格式照片
  let quality = 0.6; // 若不給的話 chrome 瀏覽器 default 是 0.92
  let base64 = canvas.toDataURL('image/jpeg', quality);

  // 因為要確保圖片壓縮到想要的容量,若壓到 200 kb 以下或是已經收斂的情況 (quality ~ 0)，則停止迴圈並回傳 base64
  while (base64.length / 1024 > 200 && quality >= 0.05) {
    quality -= 0.05;
    base64 = canvas.toDataURL('image/jpeg', quality);
    // console.log(`${base64.length / 1024}kb, quality: ${quality}`);
  }
  return base64;
}
