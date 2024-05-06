import type { PageVO, SikaLedger, StatusBaseQuery } from "@/type/ServerType";
import request from "@/utils/request";

export const getLedgerAPI = (statusQuery: StatusBaseQuery) => {
  return request<PageVO<SikaLedger>>({
    url: 'ledger',
    method: 'GET',
    notAuth: false,
    data: statusQuery
  })
}