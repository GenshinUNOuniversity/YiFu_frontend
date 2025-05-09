// import { BannerItemVO } from './../../api/banner';
import { StationBriefVO } from './../../api/station';
import api from '@/api';
// import { NewsBriefVO } from '@/api/news';
// import { getDistance, distanceFormatter } from '@/utils/location';
import { ref } from 'vue';

/**
 * ChargeHistoryItemVO，充电历史记录单条
 */
export interface ChargeHistoryItemVO {
  /**
   * 开始充电时间
   */
  begin: Date;
  /**
   * 充电历史id
   */
  chargeHistoryId: number;
  /**
   * 准确/用户预计的结束充电，将动态调整
   */
  end?: Date;
  /**
   * 结束充电拍照图片地址
   */
  endPhotoUrl?: string;
  /**
   * 结束充电流程的用户id
   */
  endUserId?: number;
  /**
   * 期待的充电时间
   */
  expectHour: number;
  /**
   * 移车备注，比如移车位置信息
   */
  moveDesc?: string;
  /**
   * 移车图片地址
   */
  movePhotoUrl?: string;
  /**
   * 电动车编号
   */
  scooterCode: string;
  /**
   * 状态
   */
  status: Status;
  /**
   * 充电站点名称
   */
  stationName: string;
  /**
   * 充电站点id
   */
  stationId: number;
  /**
   * 充电桩名称
   */
  pileName: string;
}

/**
 * 状态
 */
export enum Status {
  EndedByOther = 'EndedByOther',
  EndedBySelf = 'EndedBySelf',
  EndedPeacefully = 'EndedPeacefully',
  ForcedEnd = 'ForcedEnd',
  None = 'None',
  Using = 'Using',
}

// export const useCharge = () => {
//   const inProgressHistory = ref<ChargeHistoryItemVO>();

//   const updateInProgressHistory = () => {
//     api.getInProgressHistory().then((data) => {
//       if (data.data.length === 0 || data.data[0].status !== Status.Using) {
//         inProgressHistory.value = undefined;
//         return;
//       }
//       inProgressHistory.value = {
//         ...data.data[0],
//         begin: new Date(data.data[0].begin),
//         end: data.data[0].end ? new Date(data.data[0].end) : undefined,
//       };
//       console.log('🚀 ~ file: useCharge.ts:88 ~ awaitapi.getInProgressHistory ~ inProgressHistory:', inProgressHistory);
//     });
//   };

  // const newsList = ref<NewsBriefVO[]>([]);
  // const newsListPageNum = ref(1);
  // const newsListPageSize = ref(5);
  // const newsListHasMore = ref(true);
  // const bannerList = ref<(BannerItemVO & { fail: boolean })[]>([
  //   { imagePath: '/static/view.png', bannerId: 0, order: 1, fail: false },
  // ]);
  const stationList = ref<StationBriefVO[]>([]);

  /*const getNews = async () => {
    api
      .getAllNewsBrief({
        pageNum: newsListPageNum.value,
        pageSize: newsListPageSize.value,
      })
      .then((res) => {
        if (newsListPageNum.value === 1) {
          newsList.value = res.data.data.map((news) => {
            return { ...news, createTime: new Date(news.createTime) };
          });
        } else {
          newsList.value = newsList.value.concat(
            res.data.data.map((news) => {
              return { ...news, createTime: new Date(news.createTime) };
            }),
          );
        }
        if (newsListPageNum.value * newsListPageSize.value >= res.data.total) {
          newsListHasMore.value = false;
        } else {
          newsListPageNum.value += 1;
        }
      })
      .catch((err) => {
        console.log('error:', err);
      });
  };

  const getBanner = async () => {
    api
      .getBanner()
      .then((res) => {
        if (res.data.length > 0) {
          bannerList.value = res.data
            .map((banner) => {
              return {
                fail: false,
                ...banner,
              };
            })
            .sort((a, b) => {
              return a.order - b.order;
            });
        } else {
          bannerList.value = [{ imagePath: '/static/view.png', bannerId: 0, order: 1, fail: false }];
        }
      })
      .catch(() => {
        bannerList.value = [{ imagePath: '/static/view.png', bannerId: 0, order: 1, fail: false }];
      });
  };*/

  // const getStationList = async () => {
  //   api
  //     .getAllStationInfo()
  //     .then((res) => {
  //       stationList.value = res.data.stations;
  //       findNearestStation();
  //       return Promise.resolve();
  //     })
  //     .catch((err) => {
  //       return Promise.reject(err);
  //     });
  // };

  // const nearestStationInfo = ref<StationBriefVO>();
  // const distanceToNearestStation = ref('');
  // const userLongitude = ref(0);
  // const userLatitude = ref(0);

  // const findNearestStation = async () => {
  //   const oneStationMinDis = ref(Infinity);
  //   const oneStationLocationLat = ref(0);
  //   const oneStationLocationLng = ref(0);
  //   const minDis = ref(Infinity);
  //   const minStationLocationLat = ref(0);
  //   const minStationLocationLng = ref(0);
  //   uni.getLocation({
  //     type: 'gcj02',
  //     success: (res) => {
  //       userLongitude.value = res.longitude;
  //       userLatitude.value = res.latitude;
  //       stationList.value.forEach((station) => {
  //         oneStationMinDis.value = Infinity;
  //         station.location.forEach((location) => {
  //           const distance =
  //             (userLongitude.value - location.longitude) * (userLongitude.value - location.longitude) +
  //             (userLatitude.value - location.latitude) * (userLatitude.value - location.latitude);
  //           if (distance < oneStationMinDis.value) {
  //             oneStationMinDis.value = distance;
  //             oneStationLocationLat.value = location.latitude;
  //             oneStationLocationLng.value = location.longitude;
  //           }
  //         });
  //         if (minDis.value > oneStationMinDis.value) {
  //           minDis.value = oneStationMinDis.value;
  //           nearestStationInfo.value = station;
  //           minStationLocationLat.value = oneStationLocationLat.value;
  //           minStationLocationLng.value = oneStationLocationLng.value;
  //         }
  //       });
  //       distanceToNearestStation.value = distanceFormatter(
  //         getDistance(
  //           userLatitude.value,
  //           userLongitude.value,
  //           minStationLocationLat.value,
  //           minStationLocationLng.value,
  //         ),
  //       );
  //       console.log(distanceToNearestStation.value);
  //       uni.hideLoading();
  //     },
  //     fail: (err) => {
  //       console.log(err);
  //       uni.hideLoading();
  //       uni.showModal({
  //         title: '获取定位失败',
  //         content: err.errMsg,
  //       });
  //     },
  //   });
  // };

  // return {
    // inProgressHistory,
    // updateInProgressHistory,
    // getNews,
    // newsList,
    // getBanner,
    // bannerList,
    // getStationList,
    // stationList,
    // findNearestStation,
    // nearestStationInfo,
    // getDistance,
    // distanceToNearestStation,
    // newsListPageNum,
    // newsListPageSize,
    // newsListHasMore,
  // };
// };
