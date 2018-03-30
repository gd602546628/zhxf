/**
 * Created by gd on 2018/3/6/006.
 *
 * 系统设置
 */


import {UrlPre} from '../config/config'
import HttpService from '../service/httpService'
class Setting {
  constructor() {
    this.deleteRoleUrl = `${UrlPre}setting/role/deleteRole`
    this.addOrUpdateRoleUrl = `${UrlPre}setting/role/addOrUpdateRole`
    this.getAllRoleUrl = `${UrlPre}setting/role/getAllRole`
    this.getUrlsUrl = `${UrlPre}setting/role/getUrls`
    this.getRoleUrl = `${UrlPre}setting/role/getRole`
    this.updateStatusUrl = `${UrlPre}setting/user/updateStatus`
    this.deleteUserUrl = `${UrlPre}setting/user/deleteById`
    this.addUserUrl = `${UrlPre}setting/user/add`
    this.getAccountUrl = `${UrlPre}setting/user/getList`
    this.updatePasswordUrl = `${UrlPre}setting/user/updatePassword`
    this.getCodeUrl = `${UrlPre}setting/user/getCode`
    this.updatePasswordByCodeUrl = `${UrlPre}setting/user/updatePasswordByCode`
  }

  async deleteRole(params = {}) {
    let data = await HttpService.post(this.deleteRoleUrl, params)
    return data
  }

  async addOrUpdateRole(params = {}) {
    let data = await HttpService.post(this.addOrUpdateRoleUrl, params)
    return data
  }

  async getAllRole(params = {}) {
    let data = await HttpService.post(this.getAllRoleUrl, params)
    return data
  }

  async getUrls(params = {}) {
    let data = await HttpService.post(this.getUrlsUrl, params)
    return data
  }

  async getRole(params = {}) {
    let data = await HttpService.post(this.getRoleUrl, params)
    return data
  }

  async updateStatus(params = {}) {
    let data = await HttpService.post(this.updateStatusUrl, params)
    return data
  }

  async deleteUser(params = {}) {
    let data = await HttpService.post(this.deleteUserUrl, params)
    return data
  }

  async addUser(params = {}) {
    let data = await HttpService.post(this.addUserUrl, params)
    return data
  }

  async getAccount(params = {}) {
    let data = await HttpService.post(this.getAccountUrl, params)
    return data
  }

  async updatePassword(params = {}) {
    let data = await HttpService.post(this.updatePasswordUrl, params)
    return data
  }

  async getCode(params = {}) {
    let data = await HttpService.post(this.getCodeUrl, params)
    return data
  }

  async updatePasswordByCode(params = {}) {
    let data = await HttpService.post(this.updatePasswordByCodeUrl, params)
    return data
  }
}

export default new Setting()
