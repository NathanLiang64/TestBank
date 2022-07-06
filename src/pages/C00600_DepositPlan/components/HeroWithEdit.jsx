import React, { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Themes from 'themes/theme';
import { setDrawer, setDrawerVisible } from 'stores/reducers/ModalReducer';
import FEIBRoundButton from 'components/elements/FEIBRoundButton';
import { AccountIcon10, EditIcon } from 'assets/images/icons';

import BG1 from 'assets/images/deposit-plan/hero-1@2x.jpg';
import BG2 from 'assets/images/deposit-plan/hero-2@2x.jpg';
import BG3 from 'assets/images/deposit-plan/hero-3@2x.jpg';
import BG4 from 'assets/images/deposit-plan/hero-4@2x.jpg';
import BG5 from 'assets/images/deposit-plan/hero-5@2x.jpg';
import BG6 from 'assets/images/deposit-plan/hero-6@2x.jpg';

import HeroWithEditWrapper from './HeroWithEdit.style';

const HeroWithEdit = ({
  planId, imageId, onChange,
}) => {
  const imageInput = useRef();
  const [imageSrc, setImageSrc] = useState();
  const [newImageId, setNewImageId] = useState();
  const [isDirty, setIsDirty] = useState(false);
  const dispatch = useDispatch();

  const imgSrc = () => {
    switch (newImageId) {
      case 0:
        if (imageSrc) return imageSrc;
        return `${process.env.REACT_APP_URL}/images/dp/plans.${planId}.jpg`;
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

  useEffect(() => {
    if (imageId) setNewImageId(imageId);
  }, [imageId]);

  useEffect(() => {
    if (isDirty) onChange(newImageId);
  }, [newImageId]);

  const handleOnImageChange = (event) => {
    const images = event.target.files;
    if (images.length > 0) {
      setImageSrc(URL.createObjectURL(images[0]));
      setIsDirty(true);
      setNewImageId(0);

      const reader = new FileReader();
      reader.addEventListener('load', (e) => {
        sessionStorage.setItem('C00600-hero', e.target.result.split(';base64,')[1]);
      }, false);
      reader.readAsDataURL(images[0]);
    }
  };

  const handleOnClick = (func) => {
    if (func.id === 0) {
      imageInput.current.click();
    } else {
      setIsDirty(true);
      setNewImageId(func.id);
    }
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
    dispatch(setDrawer({ title: '', content: options, shouldAutoClose: true }));
    dispatch(setDrawerVisible(true));
  };

  return (
    <HeroWithEditWrapper>
      <input hidden aria-label="選擇圖片" ref={imageInput} type="file" accept="image/*" onChange={handleOnImageChange} />
      { typeof newImageId === 'undefined' && (
        <button type="button" className="mt-16" onClick={onSelectClick}>
          <AccountIcon10 color={Themes.colors.text.light} size="54" />
          <div className="text-select">選擇圖片</div>
        </button>
      )}
      { typeof newImageId !== 'undefined' && (
      <div className="toolkits">
        <div className="group">
          <FEIBRoundButton aria-label="選擇圖片" onClick={onSelectClick}>
            <EditIcon />
          </FEIBRoundButton>
        </div>
        <img src={imgSrc()} alt="" />
      </div>
      )}
    </HeroWithEditWrapper>
  );
};
export default HeroWithEdit;
