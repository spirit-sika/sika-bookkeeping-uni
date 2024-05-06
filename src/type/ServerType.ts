export interface BaseResponse<T> {
  code: number
  message: string
  data: T
}

export enum DeviceType {
  PC,
  APP,
  MINI_PROGRAM,
  WEB
}

export interface LoginDTO {
  phone:string
  password:string
  codeKey:string
  code:string
  deviceType: DeviceType
  rememberMe: boolean
}

export interface CaptchaVO {
  codeKey: string
  base64:string
}

export interface LoginVO {
  nickname:string
  sex: number
  avatar: string
  token: string
}

export interface PageVO<T> {
  /**
   * 页码
   */
  pageNum: number
  /**
   * 每页条数
   */
  pageSize: number
  /**
   * 总条数
   */
  totalCount: number
  /**
   * 总页数
   */
  totalPages: number;
  /**
   * 结果数据集
   */
  list: Array<T>;
}


export interface SikaLedger {
  /**
   * 账本id
   */
  ledgerId: number

  /**
   * 账本名称
   */
  ledgerName: string

  /**
   * 账本状态, 0启用, 1冻结(删除)
   */
  ledgerStatus: number

  /**
   * 账本创建人
   */
  createBy: string
  /**
   * 账本创建时间
   */
  createTime: Date;
  /**
   * 账本更新人
   */
  updateBy: string;
  /**
   * 账本更新时间
   */
  updateTime: Date;
}

export interface BaseQuery {
  /**
   * 页数
   */
  pageNum: number;
  /**
   * 每页条数
   */
  pageSize: number;
  /**
   * 按照哪个字段查询
   */
  orderBy?: string;
  /**
   * 是否降序排列, 默认升序
   */
  isDesc?: boolean;
}

export interface StatusBaseQuery extends BaseQuery {
  status: 0 | 1
}
