import { instance } from './instance';

/**
 * 用户登录返回VO
 */
export interface UserLogin {
  /**
   * 是否需要录入信息
   */
  needUpdateProfile: boolean;
  token: Token;
  userId: number;
}

/**
 * token
 */
export interface Token {
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
      provider: "weixin",
      onlyAuthorize: true,
      success: (res) => {
        uni.showLoading({ title: '登录中' });
        instance
          .post<UserLogin>('/api/login/users', { code: res.code })
          .then((res) => {
            uni.hideLoading();
            if (res) {
              uni.setStorageSync('auth', res.data.token.auth);
              uni.setStorageSync('refresh', res.data.token.refresh);
              uni.setStorageSync('userId', res.data.userId);
              if (res.data.needUpdateProfile) {
                uni.showToast({
                  title: '注册成功，即将跳转到个人信息填写页面',
                  icon: 'none',
                  duration: 1000
                });
                uni.navigateTo({ url: '../pages/components/userProfile/userProfile' });
              }
            }
            resolve(res);
          })
          .catch((err) => {
            uni.showToast({
              title: '登录失败',
              icon: 'error',
              duration: 500
            });
            reject();
          });
      },
      fail: () => {
        uni.showToast({
          title: '登录失败',
          icon: 'error',
          duration: 500
        });
        reject();
      },
    });
  });
};

/**
 * 使用现有的refresh字段从后台获取新的auth和refresh字段
 */
const refresh = async () => {
  const refresh = uni.getStorageSync('refresh');
  instance.post<Token>('/api/refresh', { refresh: refresh }).then((res) => {
    if (res) {
      uni.setStorage({//改成同步接口？
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
