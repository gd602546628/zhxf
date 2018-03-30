/**
 * Created by gd on 2018/3/6/006.
 *
 * 巡检管理
 */


import {UrlPre} from '../config/config'
import HttpService from '../service/httpService'
class Check {
  constructor() {
    this.inspectionDensity = `${UrlPre}check/density`   //巡检密度
    this.inspectionListUrl = `${UrlPre}check/record/list`   //巡检记录列表
    this.inspectionDetailUrl = `${UrlPre}check/record/detail`   //巡检记录详情
    this.inspectionOverdueUrl = `${UrlPre}check/overdue/list`   //超期未检列表
    this.inspectionMissUrl = `${UrlPre}check/miss/list`   //巡检遗漏列表
    this.fireSystemListUrl = `${UrlPre}check/standard/fireSystemList`   //所有消防系统列表
    this.fireEquListUrl = `${UrlPre}check/standard/fireEquList`   //消防设备列表
    this.standardUrl = `${UrlPre}check/standard/index`   //获取巡检标准
    this.recordStatistics = `${UrlPre}check/record/statistics`   //巡检记录图标统计
    this.missStatistics = `${UrlPre}check/miss/statistics`   //巡检遗漏图标统计
  }

  async getInspectionDensity(params = {}) {
    let data = await HttpService.post(this.inspectionDensity, params)
    return data
  }
  async getInspectionList(params = {}) {
    let data = await HttpService.post(this.inspectionListUrl, params)
    return data
  }
  async getInspectionDetail(params = {}) {
    let data = await HttpService.post(this.inspectionDetailUrl, params)
    return data
  }
  async getInspectionOverdue(params = {}) {
    let data = await HttpService.post(this.inspectionOverdueUrl, params)
    return data
  }
  async getInspectionMiss(params = {}) {
    let data = await HttpService.post(this.inspectionMissUrl, params)
    return data
  }
  async getFireSystemList(params = {}) {
    let data = await HttpService.post(this.fireSystemListUrl, params)
    return data
  }
  async getFireEquList(params = {}) {
    let data = await HttpService.post(this.fireEquListUrl, params)
    return data
  }
  async getStandardList(params = {}) {
    let data = await HttpService.post(this.standardUrl, params)
    return data
  }
  async getRecordStatistics(params = {}) {
    let data = await HttpService.post(this.recordStatistics, params)
    return data
  }
  async getMissStatistics(params = {}) {
    let data = await HttpService.post(this.missStatistics, params)
    return data
  }

}

export default new Check()
