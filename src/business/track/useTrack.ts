import api from '@/api';
enum PageId {
  My = 'my',
  Query = 'query',
  Charge = 'charge',
}

enum EventId {
  CLIK = 'CLIK',
  IMPL = 'IMPL',
}

interface SystemInfo {
  brand: string;
  model: string;
  platform: string;
}

let systemInfo: SystemInfo | undefined;

export const useTrack = () => {
  const init = async () => {
    return new Promise((resolve) => {
      uni.getSystemInfo({
        success: (result) => {
          systemInfo = {
            brand: result.brand ?? '未知',
            model: result.model ?? '未知',
            platform: result.platform?.toLowerCase() ?? '未知',
          };
          resolve(systemInfo);
        },
      });
    });
  };

  const doTrack = async ({
    pgid,
    eid = '',
    eventId,
    ext = {},
  }: {
    pgid: PageId;
    eid: string;
    eventId: EventId;
    ext?: { [key: string]: { [key: string]: never } };
  }) => {
    if (!systemInfo) {
      await init();
    }

    const userId: number = +uni.getStorageSync('userId');

    const res = await api.doTrack({
      brand: systemInfo!.brand,
      elementId: eid,
      eventId: eventId,
      ext: ext,
      model: systemInfo!.model,
      pageId: pgid,
      platform: systemInfo!.platform,
      trackTime: new Date().valueOf(),
      userId: userId != 0 ? userId : undefined,
    });

    // TODO: 检测异常情况
    console.log(res);
  };

  return {
    doTrack,
    PageId,
    EventId,
  };
};
