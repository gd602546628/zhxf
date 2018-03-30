/**
 * Created by gd on 2018/3/6/006.
 */
import {UrlPre} from '../config/config'
import HttpService from '../service/httpService'
class Publics {
  constructor() {
    this.loginUrl = `${UrlPre}public/login`
    this.getValidateCodeUrl = `${UrlPre}public/getValidateCode`
    this.getAllAreaUrl = `${UrlPre}public/areaCode/getAllArea`
    this.getEnumListUrl = `${UrlPre}unit/enum/public/getEnumList`
    this.getUnitListUrl = `${UrlPre}unit/public/getUnitListByArea`
    this.getFloorListUrl = `${UrlPre}unit/floor/public/getFloorLevelList`
  }

  async login(params = {}, sessionId) {
    let data = await HttpService.formPost(this.loginUrl, params, sessionId)
    return data
  }

  async getValidateCode(params = {}) {
    let data = await HttpService.formPost(this.getValidateCodeUrl, params)
    return data
  }

  async getAllArea(params = {}) {
    let data = await HttpService.formPost(this.getAllAreaUrl, params)
    return data
  }

  async getEnumList(params = {}) {
    let data = await HttpService.post(this.getEnumListUrl, params)
    return data
  }
  async getUnitList(params = {}) {
    let data = await HttpService.post(this.getUnitListUrl, params)
    return data
  }
  async getFloorList(params = {}) {
    let data = await HttpService.post(this.getFloorListUrl, params)
    return data
  }
}

export default new Publics()
