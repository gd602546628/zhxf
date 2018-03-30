/**
 * Created by gd on 2018/3/6/006.
 *
 * 监测中心
 */

import {UrlPre} from '@/config/config'
import HttpService from '../service/httpService'

class Monitor {
  constructor() {
    this.alarmListUrl = `${UrlPre}monitor/record/getList` // 告警信息、故障信息、操作信息 列表
    this.alarmDetailsUrl = `${UrlPre}monitor/record/getInfoById` // 告警、故障详情
    this.fireUnitDetailsUrl = `${UrlPre}unit/getUnitDetail` //  建筑信息（消防单元）
    this.realInformationUrl = `${UrlPre}monitor/information/list` // 实时信息列表
    this.realDetailsUrl = `${UrlPre}monitor/information/info` // 实时信息详情
    this.statueListUrl = `${UrlPre}monitor/information/statusList` // 状态详情列表
    this.transListUrl = `${UrlPre}monitor/transmit/getList` // 传输装置列表
    this.fireSystemListUrl = `${UrlPre}base/system/public/list` // 消防系统列表
  }

  /**
   * 告警信息、故障信息、操作信息 列表
   * @param params
   * @returns {Promise<*>}
   */
  async alarmList(params = {}) { // 信息列表
    let data = await HttpService.post(this.alarmListUrl, params)
    return data
  }

  /**
   *告警、故障详情
   * @param params
   * @returns {Promise<*>}
   */
  async alarmDetails(params = {}){
    let data = await HttpService.post(this.alarmDetailsUrl, params)
    return data
  }

  /**
   * 建筑信息(消防单元)
   * @param params
   * @returns {Promise<*>}
   */
  async fireUnitDetails(params = {}){
    let data = await HttpService.post(this.fireUnitDetailsUrl, params)
    return data
  }

  /**
   * 实时信息列表
   * @param params
   * @returns {Promise<*>}
   */
  async realInformation(params = {}){
    let data = await HttpService.post(this.realInformationUrl, params)
    return data
  }

  /**
   * 传输装置列表
   * @param params
   * @returns {Promise<*>}
   */
  async getTransmissionList (params = {}){
    let data = await HttpService.post(this.transListUrl,params)
    return data
  }

  /**
   * 消防系统列表
   * @param params
   * @returns {Promise<*>}
   */
  async getSystemList (params = {}){
    let data = await HttpService.post(this.fireSystemListUrl,params)
    return data
  }

  /**
   * 实时信息详情
   * @param params
   * @returns {Promise<*>}
   */
  async getRealDetails (params = {}){
    let data = await HttpService.post(this.realDetailsUrl,params)
    return data
  }

  /**
   * 状态详情列表
   * @param params
   * @returns {Promise<*>}
   */
  async getStatueDetails (params = {}){
    let data = await HttpService.post(this.statueListUrl,params)
    return data
  }
}

export default new Monitor()
