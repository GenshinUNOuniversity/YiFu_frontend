<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app';
import api from '@/api';
// 获取用户定位授权
<<<<<<< HEAD
// const getLocationAu = () => {
//   return new Promise<void>((resolve, reject) => {
//     uni.authorize({
//       scope: 'scope.userLocation',
//       success: (res) => {
//         console.log(res);

//         resolve();
//       },
//       fail: (err) => {
//         // eslint-disable-next-line prefer-promise-reject-errors
//         console.log(err);
//         reject(err);
//       },
//     });
//   });
// };
=======
const getLocationAu = () => {
  return new Promise<void>((resolve, reject) => {
    uni.authorize({
      scope: 'scope.userLocation',
      success: (res) => {
        console.log(res);

        resolve();
      },
      fail: (err) => {
        // eslint-disable-next-line prefer-promise-reject-errors
        console.log(err);
        reject(err);
      },
    });
  });
};
>>>>>>> d3d392a1dd49ba9a57a30c022a1a247238fe91ba

// TODO: 带参数跳转
onLaunch(async (options) => {
  // fixme: 注释掉api.login()，否则会导致报错
<<<<<<< HEAD
  // if (false) {
  //   // api.login();
  //   // uni.reLaunch()
  // }
  // getLocationAu();

  // if (options?.query) {
  //   const query = options.query;
  //   const type = query['type'];

  //   switch (type) {
  //     case 'charging': {
  //       const { stationId, pileId } = query;
  //       uni.navigateTo({
  //         url: `/pages/charging/prepareCharge/index?stationId=${stationId}&pileId=${pileId}`,
  //       });
  //       break;
  //     }
  //   }
  // }
=======
  if (false) {
    api.login();
    // uni.reLaunch()
  }
  getLocationAu();

  if (options?.query) {
    const query = options.query;
    const type = query['type'];

    switch (type) {
      case 'charging': {
        const { stationId, pileId } = query;
        uni.navigateTo({
          url: `/pages/charging/prepareCharge/index?stationId=${stationId}&pileId=${pileId}`,
        });
        break;
      }
    }
  }
>>>>>>> d3d392a1dd49ba9a57a30c022a1a247238fe91ba
});
</script>

<style>
@import 'common/font.css';
page {
  background: #f1f1f1;
}
</style>
