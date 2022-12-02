import FavoriteBlockButton from 'components/FavoriteBlockButton';
import { iconGenerator } from 'pages/S00100_Favorite/favoriteGenerator';
import React, { useEffect, useState } from 'react';
import { startFunc } from 'utilities/AppScriptProxy';

const B00600AplFxProxy = ({item}) => {
  const [sse, setSse] = useState();

  useEffect(() => {
    if (item.actKey.startsWith('F')) {
      console.log('getSSE API Request');
      setSse('apiResponse');
    }
  }, []);

  const doStartFunc = (funcCode) => {
    startFunc(funcCode, sse ? 'params' : null);
  };

  return (
    <FavoriteBlockButton
      key={item.actKey}
      icon={iconGenerator(item.actKey)}
      label={item.name}
      onClick={() => doStartFunc(item.actKey)}
      noBorder
    />
  );
};

export default B00600AplFxProxy;
