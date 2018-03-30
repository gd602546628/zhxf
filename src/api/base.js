/**
 * Created by gd on 2018/3/22/022.
 */

import {UrlPre} from '../config/config'
import HttpService from '../service/httpService'
class Base {
  constructor() {
    /*******网格  start*******/
    this.getGridListUrl = `${UrlPre}base/grid/public/getGridList`
    this.addOrUpdateGridUrl = `${UrlPre}base/grid/addOrUpdateGrid`
    this.delGridUrl = `${UrlPre}base/grid/delGrid`
    this.getGridDetailUrl = `${UrlPre}base/grid/getGridDetail`
    /*******网格  end*******/
    /*******设备和系统  start*******/
    this.getSystemListUrl = `${UrlPre}base/system/public/list`
    this.getEquipmentListUrl = `${UrlPre}base/equipment/public/listBySyetemId`
    this.getEquipmentInfoUrl = `${UrlPre}base/equipment/getInfo`
    this.editEquipmentUrl = `${UrlPre}base/equipment/edit`
    /*******设备和系统  end*******/

    /**********单位 start *************/
    this.getPageOrganizationListUrl = `${UrlPre}base/organization/public/getPageOrganizationList`
    this.delOrganizationUrl = `${UrlPre}base/organization/delOrganization`
    this.addOrUpdateOrganizationUrl = `${UrlPre}base/organization/addOrUpdateOrganization`
    this.getDetailOrganizationUrl = `${UrlPre}base/organization/public/getDetailOrganization`
    /**********单位 end *************/

    /*************传输设备 start****************/
    this.getPageTransmitDeviceListUrl = `${UrlPre}base/transmit/public/getPageTransmitDeviceList`
    this.delTransmitDeviceUrl = `${UrlPre}base/transmit/delTransmitDevice`
    this.addOrUpdateTransmitDeviceUrl = `${UrlPre}base/transmit/addOrUpdateTransmitDevice`
    this.getDetailTransmitDeviceUrl = `${UrlPre}base/transmit/public/getDetailTransmitDevice`
    /*************传输设备 end****************/

    this.getTransmitDeviceListUrl = `${UrlPre}base/transmit/public/getTransmitDeviceList`
    this.getOrganizationListUrl = `${UrlPre}base/organization/public/getOrganizationList`
    this.getGridListToUnitUrl = `${UrlPre}base/fire/grid/public/getGridListToUnit`
  }

  async getGridList(params = {}) {
    let data = HttpService.post(this.getGridListUrl, params)
    return data
  }

  async addOrUpdateGrid(params = {}) {
    let data = HttpService.post(this.addOrUpdateGridUrl, params)
    return data
  }

  async delGrid(params = {}) {
    let data = HttpService.post(this.delGridUrl, params)
    return data
  }

  async getGridDetail(params = {}) {
    let data = HttpService.post(this.getGridDetailUrl, params)
    return data
  }

  async getSystemList(params = {}) {
    let data = HttpService.post(this.getSystemListUrl, params)
    return data
  }

  async getEquipmentList(params = {}) {
    let data = HttpService.post(this.getEquipmentListUrl, params)
    return data
  }

  async getEquipmentInfo(params = {}) {
    let data = HttpService.post(this.getEquipmentInfoUrl, params)
    return data
  }

  async editEquipment(params = {}) {
    let data = HttpService.post(this.editEquipmentUrl, params)
    return data
  }

  async getPageOrganizationList(params = {}) {
    let data = HttpService.post(this.getPageOrganizationListUrl, params)
    return data
  }

  async delOrganization(params = {}) {
    let data = HttpService.post(this.delOrganizationUrl, params)
    return data
  }

  async addOrUpdateOrganization(params = {}) {
    let data = HttpService.post(this.addOrUpdateOrganizationUrl, params)
    return data
  }

  async getDetailOrganization(params = {}) {
    let data = HttpService.post(this.getDetailOrganizationUrl, params)
    return data
  }

  async getPageTransmitDeviceList(params = {}) {
    let data = HttpService.post(this.getPageTransmitDeviceListUrl, params)
    return data
  }

  async delTransmitDevice(params = {}) {
    let data = HttpService.post(this.delTransmitDeviceUrl, params)
    return data
  }

  async addOrUpdateTransmitDevice(params = {}) {
    let data = HttpService.post(this.addOrUpdateTransmitDeviceUrl, params)
    return data
  }

  async getDetailTransmitDevice(params = {}) {
    let data = HttpService.post(this.getDetailTransmitDeviceUrl, params)
    return data
  }

  async getTransmitDeviceList(params = {}) {
    let data = HttpService.post(this.getTransmitDeviceListUrl, params)
    return data
  }

  async getOrganizationList(params = {}) {
    let data = HttpService.post(this.getOrganizationListUrl, params)
    return data
  }

  async getGridListToUnit(params = {}) {
    let data = HttpService.post(this.getGridListToUnitUrl, params)
    return data
  }
}

export default new Base()
