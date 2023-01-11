import { FEIBButton } from 'components/elements';
import Loading from 'components/Loading';
import React, { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import { CropContainerWrapper } from './cropContainer.style';
import getCroppedImg from './utils';

/**
 * code source  https://codesandbox.io/s/q8q1mnr01w
 * 若要擴充功能，可詳細參考 https://www.npmjs.com/package/react-easy-crop 的文件
 */

export const CropContainer = ({ url, onUploadHandler, aspect }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const onCropComplete = useCallback((_croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const onUpload = useCallback(async () => {
    try {
      setIsUploading(true);
      const croppedImage = await getCroppedImg(url, croppedAreaPixels);
      await onUploadHandler(croppedImage);
      setIsUploading(false);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels]);

  return (
    <CropContainerWrapper>
      {!isUploading ? (
        <>
          <div className="container">
            <Cropper
              image={url}
              crop={crop}
              zoom={zoom}
              aspect={aspect} // crop 的長寬比例
              cropShape="round" // 圓形的 crop
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <FEIBButton onClick={onUpload}>確認</FEIBButton>
        </>
      ) : (
        <Loading space="both" isCentered />
      )}
    </CropContainerWrapper>
  );
};
