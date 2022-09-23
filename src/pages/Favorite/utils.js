export const calcSelectedLength = (list) => {
  let count = 0;
  for (const key in list) {
    if (list[key]) count++;
  }
  return count;
};

export const extractGroupItems = (groups) => {
  const initialValues = groups.reduce((acc, group) => {
    group.items.forEach((item) => {
      const isFavorite = !!parseInt(item.isFavorite, 10);
      acc[item.actKey] = isFavorite;
    });
    return acc;
  }, {});
  return initialValues;
};

// 將資料轉成 [{actKey:'C00100',position:0}...] 的格式
export const extractGroupItemsNew = (groups) => groups.reduce((acc, group) => {
  group.items.forEach((item) => {
    const isFavorite = !!parseInt(item.isFavorite, 10);
    if (isFavorite) {
      acc.push({actKey: item.actKey, position: item.position ? parseInt(item.position, 10) : null});
    } else {
      acc.push(false);
    }
  });
  return acc;
}, []);

export const filterAddItem = (initiralValues, editedBlockList) => {
  for (const key in editedBlockList) {
    if (editedBlockList[key] !== initiralValues[key]) return key;
  }
  return undefined;
};

export const findExistedValue = (watchedValues, key) => !!watchedValues.find((value) => {
  if (!value) return false;
  return value.actKey === key;
});

// export const transferObj2Arr = (obj) => {
//   const transferedArray = Object.keys(obj).reduce((acc, cur) => {
//     if (obj[cur]) acc.push(cur);
//     return acc;
//   }, []);
//   return transferedArray;
// };
