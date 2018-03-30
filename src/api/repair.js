/**
 * Created by gd on 2018/3/6/006.
 *
 * 维保管理
 */

import {UrlPre} from '../config/config'
import HttpService from '../service/httpService'
class Repair {
  constructor() {
    this.repairListUrl = `${UrlPre}repair/report/list` //报修工单列表
    this.repairDetailsUrl = `${UrlPre}repair/report/detail` // 报修工单详情
    this.repairStatisticsUrl = `${UrlPre}repair/report/statistics` // 维修统计
  }

  /**
   * 保修工单列表
   * @param params
   * @returns {Promise<*>}
   */
  async repairList(params= {}){
    let data = HttpService.post(this.repairListUrl,params)
    return data
  }

  /**
   *
   * @param params
   * @returns {Promise<*>}
   */
  async repairDetails(params= {}){
    let data = HttpService.post(this.repairDetailsUrl,params)
    return data
  }

  async repairStatistics(params= {}){
    let data = HttpService.post(this.repairStatisticsUrl,params)
    return data
  }

}

export default new Repair()
