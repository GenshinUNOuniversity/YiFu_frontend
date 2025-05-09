/*
 * @Author: Little_WeakDuck
 * @Date: 2023-04-22 13:33:14
 * @LastEditors: Little Weak_Duck
 * @LastEditTime: 2023-11-08 15:08:49
 * @FilePath: /src/api/instance.ts
 * @Description:
 */
// import api from '@/api';
// import weappJwtDecode from '@/utils/jwt';

import Request, { HttpResponse } from 'luch-request';
// import { useAuth } from '@/business/auth/useAuth';

// const { doLogin, authStorage } = useAuth();
export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T | null;
}

/**
 * 自强数据后台地址
 */
export const instance = new Request({
  baseURL: 'https://test-api.ddc.ziqiang.nowcent.cn',
});

/*instance.interceptors.request.use(async (config) => {
  let auth = uni.getStorageSync('auth');
  if (!auth || config.url === '/login/refresh' || config.url === '/login/wechat') return config;
  const { exp } = weappJwtDecode(auth);
  if (Date.now() >= exp * 1000) {
    // access 过期刷新
    const refresh = uni.getStorageSync('refresh');
    if (!refresh) {
      throw new Error('Refresh is expired');
    }
    try {
      await api.refresh();
      auth = uni.getStorageSync('auth');
    } catch (err) {
      throw err;
    }
  }
  if (auth) {
    config.header = {
      ...config.header,
      Authorization: auth,
    };
  }
  return config;
});*/

// TODO: 添加拦截器
/*instance.interceptors.response.use(
  (response) => {
    console.log('response Success', response.config.url, ':', response.data);
    return response.data;
  },
  async (error) => {
    console.log('response Error', error.config.url, ':', error.data);

    const showError = () => {
      if (
        !/^\/user\/\d+\/manager$/.test(error.config.url!) &&
        error.data.message !== '未找到该用户' &&
        !/\/scooter\/audit\/user-info\?code=(.*)/.test(error.config.url!)
      ) {
        uni.showToast({
          title: error.data?.message ?? error.errMsg,
          icon: 'error',
        });
      }
    };

    return new Promise<HttpResponse>(async (resolve, reject) => {
      const data = error.data;
      if (data) {
        const regex = /^401\d\d$/;
        const needLogin = regex.test(data.code);
        if (needLogin && error.config.url !== '/login/wechat') {
          try {
            await doLogin();
            error.config.header = error.config.header ?? {};
            error.config.header['Authorization'] = authStorage.auth;
            const res = await instance.request(error.config);
            resolve(res);
          } catch {
            showError();
            return reject(error);
          }
        } else {
          showError();
          return reject(error);
        }
      }
    });
  },
);*/
