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

export const findExistedValue = (watchedValues, key) => {
  // console.log(watc)
  for (const watchedKey in watchedValues) {
    if (watchedValues[watchedKey] && watchedKey === key) return true;
  }
  return false;
};

export const generateTrimmedList = (list, maxLength, emptyValue) => {
  const trimmedList = list.reduce((acc, cur) => {
    if (cur) acc.push(cur);
    return acc;
  }, []);

  while (trimmedList.length < maxLength) {
    trimmedList.push(emptyValue);
  }
  return trimmedList;
};

export const generateReorderList = (initialValues, editedBlockList) => {
  const defaultList = [];
  const selectedList = [];
  // eslint-disable-next-line guard-for-in
  for (const key in editedBlockList) {
    const foundedItem = initialValues.find((value) => value.actKey === key);
    if (editedBlockList[key]) {
      if (foundedItem) {
        defaultList[foundedItem.position] = foundedItem.actKey;
      } else {
        selectedList.push(key);
      }
    }
  }
  return [...defaultList, ...selectedList];
  // return { defaultList, selectedList };
};
