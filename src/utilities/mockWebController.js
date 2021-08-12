export const directTo = (functionCodeName, params) => {
  if (params) {
    window.location.href = `${window.location.origin}/${functionCodeName}?${params}`;
  } else {
    window.location.pathname = `/${functionCodeName}`;
  }
};

export const close = () => {
  window.history.go(-1);
};

export const goHome = () => {
  window.location.pathname = '/';
};
