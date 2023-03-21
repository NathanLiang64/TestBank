import W01 from '../Assets/message_cards/w01.gif';
import W02 from '../Assets/message_cards/w02.gif';
import W03 from '../Assets/message_cards/w03.gif';
import W04 from '../Assets/message_cards/w04.gif';
import W05 from '../Assets/message_cards/w05.gif';
import Owner from '../Assets/member/icon_headshot.png';
import Partner from '../Assets/member/icon_headshot_partner.png';

/**
 * 依照編號回傳要錢卡圖片
 * @param {{
 * imageId: number
 * }} imageId 圖片編號，數字1 ~ 5
 * @returns {{<img>}}
 */
export const cardImage = (imageId) => {
  // console.log('cardImage', {imageId});
  let imgSrc;

  switch (imageId) {
    case 1:
      imgSrc = W01;
      break;
    case 2:
      imgSrc = W02;
      break;
    case 3:
      imgSrc = W03;
      break;
    case 4:
      imgSrc = W04;
      break;
    case 5:
      imgSrc = W05;
      break;
    default:
      break;
  }
  return <img src={imgSrc} alt="要錢卡" />;
};

export const memberImage = ({isOwner, ...props}) => {
  if (isOwner) {
    return <img src={Owner} alt="" {...props} />;
  }
  return <img src={Partner} alt="" {...props} />;
};
