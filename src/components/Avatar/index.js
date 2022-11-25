import { useEffect, useState } from 'react';
import { EditIcon, PersonalIcon } from 'assets/images/icons';
import { toHalfWidth } from 'utilities/Generator';
import AvatarWrapper from './avatar.style';

/**
 * Avatar 組件封裝用戶頭像
 * @param {{
 *   memberId: String,
 *   name: String,
 *   small: Boolean,
 *   editable: Boolean,
 *   onNewPhotoLoaded: Function
 * }}
 * - memberId: 會員UUID。
 * - name: 若無圖片時，可傳入用戶名稱，預設取首字為底。
 * - small: 表示顯示小圖。此模示不會出現變更圖示的按鈕。
 * - editable: 當此變數非 null 時，表示強制控制變更按鈕出現與否。
 * - onNewPhotoLoaded: 當使用者更換圖片時觸發的事件。當 small 為 true 時，不會出現變更圖示的按鈕。
 */
const Avatar = ({
  memberId, name, small, editable, onNewPhotoLoaded,
}) => {
  const [src, setSrc] = useState(); // 會員頭像的圖片路徑。
  const [preview, setPreview] = useState(null); // 上傳的照片轉成 base64 格式
  const [showDefault, setShowDefault] = useState(false);

  const renderPhoto = () => <img onError={() => setShowDefault(true)} src={preview || src} alt={name || 'avatar'} />;

  const renderDefaultBackground = () => (
    <div className="default">
      { name ? <span>{toHalfWidth(name.substring(0, 1))}</span> : <PersonalIcon /> }
    </div>
  );

  const onImgChangeHandler = async (event) => {
    const photo = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(photo);
    reader.onloadend = (e) => {
      // TODO 一律轉為 jpg 格式。
      const imgData = e.currentTarget.result;

      setPreview(imgData);
      setShowDefault(false);

      // 將使用者指定的新圖片回傳給使用此元件的程式。
      if (onNewPhotoLoaded) onNewPhotoLoaded(imgData);

      sessionStorage.setItem(`Avator_${memberId}`, imgData);
    };
  };

  const renderEditButton = () => (
    <label className="editButton" htmlFor="imageInput">
      <EditIcon />
      <input
        id="imageInput"
        type="file"
        accept="image/*"
        onChange={onImgChangeHandler}
      />
    </label>
  );

  useEffect(() => {
    // 從本地 Cache 取出圖像。
    const imgData = sessionStorage.getItem(`Avator_${memberId}`);
    if (imgData) setPreview(imgData);

    if (memberId) {
      const defaultSrc = `${process.env.REACT_APP_AVATAR_URL}/${memberId}.jpg`;
      setSrc(defaultSrc);
    } else setShowDefault(true);
  }, []);

  return (
    <AvatarWrapper $small={small}>
      <div className="photo">
        { ((preview || src) && !showDefault) ? renderPhoto() : renderDefaultBackground() }
      </div>
      { (editable === null || editable) && !small && renderEditButton() }
    </AvatarWrapper>
  );
};

export default Avatar;
