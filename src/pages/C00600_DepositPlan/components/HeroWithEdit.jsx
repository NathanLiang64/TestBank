import { useState } from 'react';
import Themes from 'themes/theme';
import { showDrawer } from 'utilities/MessageModal';
import FEIBRoundButton from 'components/elements/FEIBRoundButton';
import { AccountIcon10, EditIcon } from 'assets/images/icons';

import BG1 from 'assets/images/deposit-plan/hero-1@2x.jpg';
import BG2 from 'assets/images/deposit-plan/hero-2@2x.jpg';
import BG3 from 'assets/images/deposit-plan/hero-3@2x.jpg';
import BG4 from 'assets/images/deposit-plan/hero-4@2x.jpg';
import BG5 from 'assets/images/deposit-plan/hero-5@2x.jpg';
import BG6 from 'assets/images/deposit-plan/hero-6@2x.jpg';

import HeroWithEditWrapper from './HeroWithEdit.style';

const HeroWithEdit = () => {
  const [imageId, setImageId] = useState();

  const imgSrc = () => {
    switch (imageId) {
      case 0:
        return `${process.env.REACT_APP_URL}/images/dp/plans.ah-----.jpg`;
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
            <button type="button" onClick={() => setImageId(func.id)}>
              {func.title}
            </button>
          </li>
        ))}
      </ul>
    );
    showDrawer('', options);
    return imageId;
  };

  return (
    <HeroWithEditWrapper>
      { typeof imageId === 'undefined' && (
        <button type="button" className="mt-16" onClick={onSelectClick}>
          <AccountIcon10 color={Themes.colors.text.light} size="54" />
          <div className="text-select">選擇圖片</div>
        </button>
      )}
      { typeof imageId !== 'undefined' && (
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
