import { instance } from './instance';

/**
 * 用户登录返回VO
 */
export interface UserLoginVO {
  /**
   * 是否需要录入信息
   */
  needUpdateProfile: boolean;
  token: TokenVO;
  userId: number;
}

/**
 * TokenVO，token
 */
export interface TokenVO {
  /**
   * 认证Token
   */
  auth: string;
  /**
   * 刷新Token
   */
  refresh: string;
}

const login = async () => {
  uni.clearStorageSync();
  return new Promise((resolve, reject) => {
    uni.login({
      success: (res) => {
        uni.showLoading({ title: '登录中' });
        instance
          .post<UserLoginVO>('/login/wechat', { code: res.code })
          .then((res) => {
            uni.hideLoading();
            if (res) {
              uni.setStorageSync('auth', res.data.token.auth);
              uni.setStorageSync('refresh', res.data.token.refresh);
              uni.setStorageSync('userId', res.data.userId);
              if (res.data.needUpdateProfile) {
                uni.navigateTo({ url: '/pages/components/userProfile/userProfile' });
              }
            }
            resolve(res);
          })
          .catch((err) => {
            uni.showToast({
              title: '登录失败',
              icon: 'error',
            });
            reject();
          });
      },
      fail: () => {
        uni.showToast({
          title: '登录失败',
          icon: 'error',
        });
        reject();
      },
    });
  });
};

const refresh = async () => {
  const refresh = uni.getStorageSync('refresh');
  instance.post<TokenVO>('/login/refresh', { refresh }).then((res) => {
    if (res) {
      uni.setStorage({
        key: 'auth',
        data: res.data.auth,
      });
      uni.setStorage({
        key: 'refresh',
        data: res.data.refresh,
      });
    }
  });
};
export default { login, refresh };
