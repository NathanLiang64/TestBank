import { useEffect, useState } from 'react';
import { EditIcon, PersonalIcon } from 'assets/images/icons';
import { toHalfWidth } from 'utilities/Generator';
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
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showDefault, setShowDefault] = useState(false);

  const renderPhoto = () => <img onError={() => setShowDefault(true)} src={preview || src} alt={name || 'avatar'} />;

  const renderDefaultBackground = () => (
    <div className="default">
      { name ? <span>{toHalfWidth(name.substr(0, 1))}</span> : <PersonalIcon /> }
    </div>
  );

  const renderEditButton = () => (
    <label className="editButton" htmlFor="imageInput">
      <EditIcon />
      <input
        id="imageInput"
        type="file"
        accept="image/*"
        onChange={(event) => setPhoto(event.target.files[0])}
      />
    </label>
  );

  useEffect(() => {
    if (photo) {
      const reader = new FileReader();
      reader.readAsDataURL(photo);
      reader.onloadend = () => setPreview(reader.result);
      if (onPreview) onPreview(photo);
    }
  }, [photo]);

  return (
    <AvatarWrapper $small={small}>
      <div className="photo">
        { ((preview || src) && !showDefault) ? renderPhoto() : renderDefaultBackground() }
      </div>
      { !small && renderEditButton() }
    </AvatarWrapper>
  );
};

export default Avatar;
