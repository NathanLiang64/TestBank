import { useEffect, useRef, useState } from 'react';
import { EditRounded, PersonRounded } from '@material-ui/icons';
import AvatarWrapper from './avatar.style';

/*
* ==================== Avatar 組件說明 ====================
* Avatar 組件封裝用戶頭像
* ==================== Avatar 可傳參數 ====================
* 1. src -> 會員頭像的圖片路徑
* 2. name -> 若無圖片時，可傳入用戶名稱，預設取首字為底
* */

const Avatar = ({
  src, name, small, onPreview,
}) => {
  const photoRef = useRef();
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleClickEditButton = () => {
    photoRef.current.click();
    // window.alert('開原生相簿');
  };

  const renderPhoto = () => <img src={preview || src} alt={name || 'avatar'} />;

  const renderDefaultBackground = () => (
    <div className="default">
      { name ? <span>{name.substr(0, 1)}</span> : <PersonRounded /> }
    </div>
  );

  const renderEditButton = () => (
    <div className="editButton" onClick={handleClickEditButton}>
      <EditRounded />
      <input
        ref={photoRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(event) => setPhoto(event.target.files[0])}
      />
    </div>
  );

  useEffect(() => {
    if (photo) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(photo);
      if (onPreview) onPreview(photo);
    }
  }, [photo]);

  return (
    <AvatarWrapper $small={small}>
      <div className="photo">
        { (preview || src) ? renderPhoto() : renderDefaultBackground() }
      </div>
      { !small && renderEditButton() }
    </AvatarWrapper>
  );
};

export default Avatar;
