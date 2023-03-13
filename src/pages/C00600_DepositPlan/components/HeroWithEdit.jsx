import React, { useRef, useState } from 'react';

import Themes from 'themes/theme';
import FEIBRoundButton from 'components/elements/FEIBRoundButton';
import { AccountIcon10, EditIcon } from 'assets/images/icons';

import BG1 from 'assets/images/deposit-plan/hero-1@2x.jpg';
import BG2 from 'assets/images/deposit-plan/hero-2@2x.jpg';
import BG3 from 'assets/images/deposit-plan/hero-3@2x.jpg';
import BG4 from 'assets/images/deposit-plan/hero-4@2x.jpg';
import BG5 from 'assets/images/deposit-plan/hero-5@2x.jpg';
import BG6 from 'assets/images/deposit-plan/hero-6@2x.jpg';

import { showCustomDrawer } from 'utilities/MessageModal';
import Dialog from 'components/Dialog';
import { CropContainer } from 'components/CropContainer';
import { FEIBErrorMessage } from 'components/elements';
import HeroWithEditWrapper from './HeroWithEdit.style';

const HeroWithEdit = ({
  planId, imageId, onChange,
}) => {
  const imageInput = useRef();
  const [viewModel, setViewModel] = useState({
    imageSrc: null, // 尚未裁剪的照片 (url 格式)
    preview: null, // 經過裁剪的照片 (base64 格式)
    uploadErrMsg: '', // 上傳圖片的異常訊息
  });
  const imgSrc = () => {
    switch (imageId) {
      case 0:
        return viewModel.preview
        || sessionStorage.getItem('C00600-hero')
        || `${process.env.REACT_APP_DEPOSIT_PLAN_IMG_URL}/${planId}.jpg`;
      case 2:
        return BG2;
      case 3:
        return BG3;
      case 4:
        return BG4;
      case 5:
        return BG5;
      case 6:
        return BG6;
      case 1:
      default:
        return BG1;
    }
  };

  const onImgChangeHandler = (event) => {
    const photo = event.target.files[0];

    if (photo.size / (1024 * 1204) > 8) {
      setViewModel((vm) => ({...vm, uploadErrMsg: '檔案大小不得大於 8 MB'}));
    } else {
      const url = URL.createObjectURL(photo);
      setViewModel((vm) => ({...vm, imageSrc: url, uploadErrMsg: ''}));
    }
  };

  const handleOnClick = (func) => {
    if (func.id === 0) imageInput.current.click();
    else onChange(func.id);
  };
  const onSelectClick = () => {
    const list = [
      { title: '購物', id: 1 },
      { title: '3C', id: 2 },
      { title: '結婚', id: 3 },
      { title: '房子', id: 4 },
      { title: '車子', id: 5 },
      { title: '旅遊', id: 6 },
      { title: '上傳其他圖片', id: 0 },
    ];
    const options = (
      <ul>
        {list.map((func) => (
          <li key={func.title}>
            <button type="button" onClick={() => handleOnClick(func)}>
              {func.title}
            </button>
          </li>
        ))}
      </ul>
    );
    showCustomDrawer({ title: '', content: options, shouldAutoClose: true });
  };

  const onUploadHandler = async (data) => {
    onChange(0);
    sessionStorage.setItem('C00600-hero', data);
    setViewModel((vm) => ({...vm, imageSrc: null, preview: data}));
  };

  return (
    <HeroWithEditWrapper>
      <input
        hidden
        aria-label="選擇圖片"
        ref={imageInput}
        type="file"
        accept="image/*"
        onClick={(e) => {
          e.target.value = '';
          setViewModel((vm) => ({...vm, imageSrc: null}));
        }}
        onChange={onImgChangeHandler}
      />
      { typeof imageId !== 'number' ? (
        <button type="button" className="mt-16" onClick={onSelectClick}>
          <AccountIcon10 color={Themes.colors.text.light} size="54" />
          <div className="text-select">選擇圖片</div>
          {!!viewModel.uploadErrMsg && <FEIBErrorMessage>{viewModel.uploadErrMsg}</FEIBErrorMessage>}
        </button>
      ) : (
        <div className="toolkits">
          <div className="group">
            <FEIBRoundButton aria-label="選擇圖片" onClick={onSelectClick}>
              <EditIcon />
            </FEIBRoundButton>
          </div>
          <img src={imgSrc()} alt="" />
        </div>
      )}

      <Dialog
        title="裁剪上傳的圖片"
        isOpen={!!viewModel.imageSrc}
        onClose={() => setViewModel((vm) => ({...vm, imageSrc: null}))}
        content={<CropContainer url={viewModel.imageSrc} cropShape="rect" onUploadHandler={onUploadHandler} aspect={3 / 2} />}
        showCloseButton
      />
    </HeroWithEditWrapper>
  );
};
export default HeroWithEdit;
