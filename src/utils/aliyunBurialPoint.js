//阿里云接口埋点
if (process.env.NODE_ENV !== 'development') {
  !(function (c, b, d, a) {
    c[a] || (c[a] = {});
    c[a].config = {
      pid: process.env.VUE_APP_Aliyun_pid,
      appType: 'web',
      imgUrl: 'https://arms-retcode.aliyuncs.com/r.png?',
      sendResource: true,
      enableLinkTrace: true,
      behavior: true,
      setUsername: function () {
        return window.localStorage.getItem('userNo') ? window.localStorage.getItem('userNo') : '';
      }
    };
    with (b) with (body) with (insertBefore(createElement('script'), firstChild)) setAttribute('crossorigin', '', (src = d));
  })(window, document, 'https://sdk.rum.aliyuncs.com/v1/bl.js', '__bl');
}
