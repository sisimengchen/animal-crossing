/*获取当前页url*/
export function getCurrentPageUrl() {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const url = `/${currentPage.route}`;
  return url;
}

/*获取当前页带参数的url*/
export function getCurrentPageUrlWithArgs(key, val) {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const url = currentPage.route;
  const options = currentPage.options;
  let urlWithArgs = `/${url}?`;
  for (let key in options) {
    if (key == '__key_') continue;
    const value = options[key];
    urlWithArgs += `${key}=${value}&`;
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1);
  return urlWithArgs;
}
