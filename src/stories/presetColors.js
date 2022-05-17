import Theme from 'themes/theme';

const getFormatedColorPresets = (title, colors) => {
  return Object.entries(colors).map((c) => {
    return {
      color: c[1],
      title: `Theme.colors.${title}.${c[0]}`,
    };
  });
};

const getColorPresetGroups = (presets = ['text']) => {
  if (!Array.isArray(presets)) {
    return [];
  }

  return presets.reduce((prev, current) => {
    if (!(current in Theme.colors)) {
      return prev;
    }

    const temp = getFormatedColorPresets(current, Theme.colors[current]);
    return prev.concat(temp);
  }, []);
};

export default getColorPresetGroups;
