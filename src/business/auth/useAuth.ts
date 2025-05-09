import { instance } from '@/api/instance';
import { Token, UserLogin } from '@/api/login';
import { HttpResponse } from 'luch-request';

let callbackList = Array<[() => void, (reason?: any) => void]>();
let loading = false;

export const useAuth = () => {
  const authStorage = {
    set auth(value: string) {
      uni.setStorage({
        key: 'auth',
        data: value,
      });
    },
    set refresh(value: string) {
      uni.setStorage({
        key: 'refresh',
        data: value,
      });
    },
    set userId(value: number) {
      uni.setStorage({
        key: 'userId',
        data: value,
      });
    },
    set needUpdateProfile(value: boolean) {
      uni.setStorage({
        key: 'needUpdateProfile',
        data: value,
      });
    },
    get auth(): string {
      return uni.getStorageSync('auth');
    },
    get refresh(): string {
      return uni.getStorageSync('refresh');
    },
    get userId(): number {
      return uni.getStorageSync('userId');
    },
    get needUpdateProfile(): boolean {
      return uni.getStorageSync('needUpdateProfile');
    },
  };

  const doLogin = async () => {
    return new Promise<void>(async (resolve, reject) => {
      callbackList.push([resolve, reject]);
      await login();
    });
  };

  const refreshLogin = async () => {
    try {
      await instance.post<Token>('/login/refresh', { refresh: authStorage.refresh });
    } catch (e) {
      console.error(e);
    }
  };

  const login = async () => {
    const loginFinally = () => {
      callbackList = [];
      loading = false;
    };
    const resolveAll = () => {
      callbackList.forEach(([resolve]) => {
        resolve();
      });
      loginFinally();
    };

    const rejectAll = () => {
      callbackList.forEach(([, reject]) => {
        reject();
      });
      loginFinally();
    };

    if (loading) {
      return;
    }
    loading = true;

    uni.clearStorageSync();
    let codeRes: UniApp.LoginRes;
    uni.showLoading({ title: '登录中' });
    try {
      codeRes = await new Promise((resolve, reject) => {
        uni.login({
          success: (result) => {
            resolve(result);
          },
          fail: (result) => {
            reject(result);
          },
        });
      });
    } catch (e) {
      console.error(e);
      uni.showToast({
        title: '登录失败',
        icon: 'error',
      });
      rejectAll();
      return;
    } finally {
      uni.hideLoading();
    }

    let loginRes: HttpResponse<UserLogin>;
    uni.showLoading({ title: '登录中' });
    try {
      loginRes = await instance.post<UserLogin>('/login/wechat', { code: codeRes.code });
    } catch (e) {
      console.error(e);
      uni.showToast({
        title: '登录失败',
        icon: 'error',
      });
      rejectAll();
      return;
    } finally {
      uni.hideLoading();
    }

    authStorage.auth = loginRes.data.token.auth;
    authStorage.refresh = loginRes.data.token.refresh;
    authStorage.userId = loginRes.data.userId;
    authStorage.needUpdateProfile = loginRes.data.needUpdateProfile;
    if (loginRes.data.needUpdateProfile) {
      const pages = getCurrentPages();
      console.log();
      if (pages[pages.length - 1].route !== 'pages/components/userProfile/userProfile') {
        uni.redirectTo({ url: '/pages/components/userProfile/userProfile' });
      }
    }

    resolveAll();
  };

  return {
    doLogin,
    authStorage,
  };
};
