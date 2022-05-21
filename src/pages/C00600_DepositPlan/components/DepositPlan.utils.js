import fail from 'assets/animations/fail-small.json';
import saving25 from 'assets/animations/saving25.json';
import saving50 from 'assets/animations/saving50.json';
import saving75 from 'assets/animations/saving75.json';
import saving99 from 'assets/animations/saving99.json';
import successFlower from 'assets/animations/successFlower-small.json';
import Theme from 'themes/theme';

const getStage = (isPlanFailed, progressPercentage) => {
  if (isPlanFailed) {
    return {
      animation: fail,
      infoAreaStyles: {
        color: Theme.colors.state.error,
        bgColor: Theme.colors.card.yellow,
      },
      text: '計畫失敗',
    };
  }

  if (progressPercentage >= 100) {
    return {
      animation: successFlower,
      infoAreaStyles: {
        color: Theme.colors.primary.dark,
        bgColor: Theme.colors.card.green,
      },
      text: '計畫完成',
    };
  }

  switch (Math.ceil(progressPercentage / 25)) {
    case 0:
    case 1:
      return {
        animation: saving25,
        infoAreaStyles: {
          color: Theme.colors.text.lightGray,
          bgColor: Theme.colors.card.purple,
        },
        text: '累積才能成長',
      };
    case 2:
      return {
        animation: saving50,
        infoAreaStyles: {
          color: Theme.colors.text.lightGray,
          bgColor: Theme.colors.card.pink,
        },
        text: '開始就不要停止了!',
      };
    case 3:
      return {
        animation: saving75,
        infoAreaStyles: {
          color: Theme.colors.text.lightGray,
          bgColor: Theme.colors.card.blue,
        },
        text: '堅持很難，但你可以的!',
      };
    case 4:
    default:
      return {
        animation: saving99,
        infoAreaStyles: {
          color: Theme.colors.text.lightGray,
          bgColor: Theme.colors.card.lightpurple,
        },
        text: '美好的錢途，就在不遠處',
      };
  }
};

export { getStage };
