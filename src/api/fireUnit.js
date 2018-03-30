/**
 * Created by gd on 2018/3/6/006.
 *
 * 消防单元
 */

import {UrlPre} from '../config/config'
import HttpService from '../service/httpService'
class FireUnit {
  constructor() {
    this.getUnitListUrl = `${UrlPre}unit/public/getUnitList`
    this.getGridListToUnitUrl = `${UrlPre}base/grid/public/getGridListToUnit`
    this.addOrUpdateUnitUrl = `${UrlPre}/unit/addOrUpdateUnit`
    this.getFloorListUrl = `${UrlPre}unit/floor/public/getFloorList`
    this.getUnitDetailUrl = `${UrlPre}unit/getUnitDetail`
    this.addFloorsUrl = `${UrlPre}unit/floor/addFloors`
    this.delFloorUrl = `${UrlPre}unit/floor/delFloor`
    this.getFloorEquipmentStallListUrl = `${UrlPre}unit/install/public/getFloorEquipmentStallList`
    this.addInstallEquipmentUrl = `${UrlPre}unit/install/addInstallEquipment`
    this.getIntallEquipmentCountsUrl = `${UrlPre}unit/install/public/getIntallEquipmentCounts`
    this.getUnitListByAreaUrl = `${UrlPre}unit/public/getUnitListByArea`
    this.getEnumListUrl = `${UrlPre}unit/enum/public/getEnumList`
    this.getHomeListUrl = `${UrlPre}unit//home/public/getHomeList`
    this.getUnitListByGridIdUrl = `${UrlPre}unit/public/getUnitListByGridId`
    this.getUnitListByOrganizationIdUrl = `${UrlPre}unit/public/getUnitListByOrganizationId`
    this.getBasicInfoUrl = `${UrlPre}unit/home/public/getBasicInfo`
    this.defaultUnitUrl = `${UrlPre}unit/public/default/unitList`
  }

  async getUnitList(params = {}) {
    let data = await HttpService.post(this.getUnitListUrl, params)
    return data
  }

  async getGridListToUnit(params = {}) {
    let data = await HttpService.post(this.getGridListToUnitUrl, params)
    return data
  }

  async addOrUpdateUnit(params = {}) {
    let data = await HttpService.post(this.addOrUpdateUnitUrl, params)
    return data
  }

  async getFloorList(params = {}) {
    let data = await HttpService.post(this.getFloorListUrl, params)
    return data
  }

  async getUnitDetail(params = {}) {
    let data = await HttpService.post(this.getUnitDetailUrl, params)
    return data
  }

  async addFloors(params = {}) {
    let data = await HttpService.post(this.addFloorsUrl, params)
    return data
  }

  async delFloor(params = {}) {
    let data = await HttpService.post(this.delFloorUrl, params)
    return data
  }

  async getFloorEquipmentStallList(params = {}) {
    let data = await HttpService.post(this.getFloorEquipmentStallListUrl, params)
    return data
  }

  async addInstallEquipment(params = {}) {
    let data = await HttpService.post(this.addInstallEquipmentUrl, params)
    return data
  }

  async getIntallEquipmentCounts(params = {}) {
    let data = await HttpService.post(this.getIntallEquipmentCountsUrl, params)
    return data
  }

  async getUnitListByArea(params = {}) {
    let data = await HttpService.post(this.getUnitListByAreaUrl, params)
    return data
  }

  async getEnumList(params = {}) {
    let data = await HttpService.post(this.getEnumListUrl, params)
    return data
  }

  async getHomeList(params = {}) {
    let data = await HttpService.post(this.getHomeListUrl, params)
    return data
  }

  async getUnitListByGridId(params = {}) {
    let data = await HttpService.post(this.getUnitListByGridIdUrl, params)
    return data
  }

  async getUnitListByOrganizationId(params = {}) {
    let data = await HttpService.post(this.getUnitListByOrganizationIdUrl, params)
    return data
  }

  async getBasicInfo(params = {}) {
    let data = await HttpService.post(this.getBasicInfoUrl, params)
    return data
  }

  async defaultUnit(params = {}) {
    let data = await HttpService.post(this.defaultUnitUrl, params)
    return data
  }
}

export default new FireUnit()
