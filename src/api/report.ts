import { ChargeHistoryItemVO } from './chargehistory';
import { instance } from './instance';

/**
 * PageVOReportItemVO，分页
 */
export interface PageVOReportItemVO {
  /**
   * 当页数据
   */
  data: ReportItemVO[];
  /**
   * 当前页
   */
  pageNum: number;
  /**
   * 元素总计
   */
  total: number;
}

/**
 * ReportItemVO，举报VO
 */
export interface ReportItemVO {
  id?: number;
  /**
   * 内容
   */
  content: string;
  /**
   * 创建时间
   */
  createTime: Date;
  /**
   * 图片Url
   */
  photoUrlList: string[];
  relatedChargeHistory?: ChargeHistoryItemVO;
  relatedPile?: ReportRelatedPileVO;
  /**
   * 解决方式
   */
  solvedReply?: string;
  /**
   * 解决时间
   */
  solvedTime?: Date;
  /**
   * 标题
   */
  title: string;
  status: reportStatus;
}

export enum reportStatus {
  None = 'None',
  Created = 'Created',
  Committed = 'Committed',
  Rejected = 'Rejected',
  Solved = 'Solved',
}

/**
 * ReportRelatedPileVO，举报展示的充电桩基本信息
 */
export interface ReportRelatedPileVO {
  /**
   * 充电桩名称
   */
  pileName: string;
  /**
   * 充电站名称
   */
  stationName: string;
  /**
   * 充电桩id
   */
  pileId: string;
  /**
   * 充电站id
   */
  stationId: string;
}

/**
 * 添加举报Dto
 */
export interface ReportContentDto {
  /**
   * 内容
   */
  content: string;
  /**
   * 关联的充电记录id
   */
  relatedChargeHistoryId?: number;
  /**
   * 关联的充电桩id
   */
  relatedPileId?: number;
  /**
   * 关联的被举报者id
   */
  relatedUserId?: number;
  /**
   * 标题
   */
  title: string;
}

const getPersonalReportList = async ({ pageNum, pageSize }: { pageNum: number; pageSize: number }) => {
  return instance.get<PageVOReportItemVO>('/report', {
    params: {
      pageNum,
      pageSize,
    },
  });
};

const getStationReportList = async ({
  stationId,
  pageNum,
  pageSize,
}: {
  stationId: number;
  pageNum: number;
  pageSize: number;
}) => {
  return instance.get<PageVOReportItemVO>(`/report/station/${stationId}`, { params: { pageNum, pageSize } });
};

/**
 * CreateReportDto，创建举报Dto
 */
export interface CreateReportDto {
  /**
   * 关联的充电记录id
   */
  relatedChargeHistoryId?: number;
  /**
   * 关联的充电桩id
   */
  relatedPileId?: number;
  /**
   * 关联的被举报者id
   */
  relatedUserId?: number;
  /**
   * 站点id
   */
  stationId: number;
}

/**
 * CreateReportSuccessVO，创建举报成功VO
 */
export interface CreateReportSuccessVO {
  /**
   * 举报id
   */
  reportId: number;
}

const createReport = async (data: CreateReportDto) => {
  return instance.post<CreateReportSuccessVO>('/report', data);
};

const commitReport = async (reportId: number) => {
  return instance.post<Record<string, never>>(`/report/${reportId}/commit`);
};

/**
 * CreateReportContentDto，添加举报内容dto
 */
export interface CreateReportContentDto {
  /**
   * 内容
   */
  content: string;
  /**
   * 标题
   */
  title: string;
}

/**
 * DirectUploadInfo，上传信息
 */
export interface DirectUploadInfo {
  accessId: string;
  path: string;
  policy: string;
  signature: string;
  url: string;
}

const addReportContent = async (reportContent: CreateReportContentDto, reportId: number) => {
  return instance.put<Record<string, never>>(`/report/${reportId}/content`, reportContent);
};

const addReportPhoto = async (reportId: number, imageName: string) => {
  instance.post<DirectUploadInfo>(`/report/${reportId}/image`, { imageName }).then((res) => {
    uni.uploadFile({
      url: res.data.url,
      filePath: imageName,
      name: 'file',
      formData: {
        OSSAccessKeyId: res.data.accessId,
        policy: res.data.policy,
        success_action_status: '200',
        signature: res.data.signature,
        key: res.data.path,
      },
      success(result) {
        if (result.statusCode === 200) {
          return Promise.resolve(result);
        } else {
          return Promise.reject(result);
        }
      },
      fail(error) {
        return Promise.reject(error);
      },
    });
  });
};

const deleteReportPhoto = async (reportId: number, imageName: string) => {
  return instance.delete<Record<string, never>>(`/report/${reportId}/image/${imageName}`);
};

// 管理员更改举报状态

const changeReportStatus = async (reportId: number, status: 2 | 1, message: string) => {
  return instance.post<Record<string, never>>(`/report/${reportId}/reply`, { status, message });
};

export default {
  getPersonalReportList,
  getStationReportList,
  createReport,
  commitReport,
  addReportContent,
  addReportPhoto,
  changeReportStatus,
  deleteReportPhoto,
};
