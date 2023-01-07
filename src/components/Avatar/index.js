/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { EditIcon, PersonalIcon } from 'assets/images/icons';
import { toHalfWidth } from 'utilities/Generator';
import { FEIBErrorMessage } from 'components/elements';
import { CropContainer } from 'components/CropContainer';
import Dialog from 'components/Dialog';
import AvatarWrapper from './avatar.style';

/**
 * Avatar 組件封裝用戶頭像
 * @param {{
 *   memberId: String,
 *   name: String,
 *   small: Boolean,
 *   editable: Boolean,
 *   onNewPhotoLoaded: Function
 *   defaultImage: *
 * }}
 * - memberId: 會員UUID。
 * - name: 若無圖片時，可傳入用戶名稱，預設取首字為底。
 * - small: 表示顯示小圖。此模示不會出現變更圖示的按鈕。
 * - editable: 當此變數非 null 時，表示強制控制變更按鈕出現與否。
 * - onNewPhotoLoaded: 當使用者更換圖片時觸發的事件。當 small 為 true 時，不會出現變更圖示的按鈕。
 * - defaultImage: 預設大頭貼
 */
const Avatar = ({
  memberId, name, small, editable, onNewPhotoLoaded, defaultImage,
}) => {
  const [src, setSrc] = useState(); // 會員頭像的圖片路徑。
  const [preview, setPreview] = useState(null); // 經過裁剪的照片 (base64 格式)
  const [uploadSrc, setUploadSrc] = useState(null); // 尚未裁剪的照片 (url 格式)
  const [showDefault, setShowDefault] = useState(false);
  const [uploadErrMsg, setUploadErrMsg] = useState('');
  const renderPhoto = () => (
    <img
      src={preview || src}
      alt={name || 'avatar'}
      onError={() => (defaultImage ? setPreview(defaultImage) : setShowDefault(true))}
    />
  );

  const renderDefaultBackground = () => (
    <div className="default">
      { name ? <span>{toHalfWidth(name.substring(0, 1))}</span> : <PersonalIcon /> }
    </div>
  );

  const onUploadHandler = async (data) => {
    setPreview(data);
    setShowDefault(false);
    if (onNewPhotoLoaded) {
      await onNewPhotoLoaded(data);
      setUploadSrc(null);
      if (memberId) sessionStorage.setItem(`Avator_${memberId}`, data);
    }
  };

  const onImgChangeHandler = async (event) => {
    const photo = event.target.files[0];
    if (photo.type !== 'image/jpeg') {
      setUploadErrMsg('上傳之影像規格限定 JPG 或 JPEG 格式');
      return;
    }

    if (photo.size / (1024 * 1204) > 8) {
      setUploadErrMsg('檔案大小不得大於 8 MB');
      return;
    }

    const url = URL.createObjectURL(photo);
    setUploadSrc(url);
    // NOTE 目前後端有進行品質壓縮處理，前端目前沒做

    setUploadErrMsg('');
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
    if (memberId) {
      const imgData = sessionStorage.getItem(`Avator_${memberId}`);
      if (imgData) setPreview(imgData);
      if (memberId) {
        const defaultSrc = `${process.env.REACT_APP_AVATAR_URL}/${memberId}.jpg`;
        setSrc(defaultSrc);
      }
    }
    setShowDefault(!memberId);
  }, [memberId]);

  return (
    <AvatarWrapper $small={small}>
      <div className="photo">
        {(preview || src) && !showDefault
          ? renderPhoto()
          : renderDefaultBackground()}
        {editable !== false && !small && renderEditButton()}
      </div>
      {!!uploadErrMsg && <FEIBErrorMessage>{uploadErrMsg}</FEIBErrorMessage>}
      {/* 這邊沒有使用 showPrompt 方式顯示 Dialog，因爲會與已經存在的 Modal 衝突 (ex: D00500/D00600 頁面) */}
      <Dialog
        title="裁剪上傳的圖片"
        isOpen={!!uploadSrc}
        onClose={() => setUploadSrc(null)}
        content={
          <CropContainer url={uploadSrc} onUploadHandler={onUploadHandler} aspect={1 / 1} />
        }
        showCloseButton
      />
    </AvatarWrapper>
  );
};

export default Avatar;
