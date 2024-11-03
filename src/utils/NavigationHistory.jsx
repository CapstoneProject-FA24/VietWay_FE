export const saveNavigationHistory = (path) => {
  const history = JSON.parse(sessionStorage.getItem('navigationHistory') || '[]');
  history.push(path);
  sessionStorage.setItem('navigationHistory', JSON.stringify(history));
};

export const getPreviousPage = () => {
  const history = JSON.parse(sessionStorage.getItem('navigationHistory') || '[]');
  return history.length > 1 ? history[history.length - 2] : '/';
};

export const getPreviousPageBooking = () => {
  const history = JSON.parse(sessionStorage.getItem('navigationHistory') || '[]');
  if (history.length <= 1) {
    return '/';
  }

  const page = history[history.length - 5];

  if (!page.includes('dat-tour')) {
    return '/tai-khoan';
  }

  return '/';
};

export const clearNavigationHistory = () => {
  sessionStorage.removeItem('navigationHistory');
};

export const saveLastProfileTab = (tabValue) => {
  sessionStorage.setItem('lastProfileTab', tabValue.toString());
};

export const getLastProfileTab = () => {
  return parseInt(sessionStorage.getItem('lastProfileTab') || '0');
};
