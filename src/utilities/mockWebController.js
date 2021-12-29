export const directTo = (history, path, params) => {
  if (params) {
    history.push(`${process.env.REACT_APP_ROUTER_BASE}/${path}`, params);
    // history.push(`/${path}?${params}`);
  } else {
    history.push(`${process.env.REACT_APP_ROUTER_BASE}/${path}`);
  }
};

export const close = (history) => {
  history.goBack();
};

export const goHome = (history) => {
  history.push(`${process.env.REACT_APP_ROUTER_BASE}/`);
};
