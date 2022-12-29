import { FEIBButton } from 'components/elements';
import React, { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from './utils';
// import './styles.css';

export const CropContainer = ({ url, onUploadHandler }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const onCropComplete = useCallback((_croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(url, croppedAreaPixels);
      console.log('donee', { croppedImage });
      //   setCroppedImage(croppedImage)
      onUploadHandler(croppedImage);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels]);

  return (
    <div style={{ height: '50vh' }}>
      <Cropper
        image={url}
        crop={crop}
        zoom={zoom}
        aspect={1 / 1}
        onCropChange={setCrop}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
      />

      <FEIBButton onClick={showCroppedImage}>確認</FEIBButton>

      {/* <div className="controls">
        <input
          type="range"
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e) => {
            setZoom(e.target.value);
          }}
          className="zoom-range"
        />
      </div> */}
    </div>
  );
};
