export const directTo = (history, path, params) => {
  if (params) {
    history.push(`/${path}?${params}`);
  } else {
    history.push(`/${path}`);
  }
};

export const close = (history) => {
  history.goBack();
};

export const goHome = (history) => {
  history.push('/');
};
