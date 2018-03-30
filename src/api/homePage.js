/**
 * Created by gd on 2018/3/6/006.
 *
 * 首页
 */

import {UrlPre} from '../config/config'
import HttpService from '../service/httpService'
class HomePage {
  constructor() {
    this.getHomeListUrl = `${UrlPre}unit/home/public/getHomeList`
    this.getUnitListUrl = `${UrlPre}unit/public/getUnitListByArea`
  }

  async test() {
    let data = await HttpService.post('http://172.31.60.66:8080/test/gd', {name: 'gd', age: '18'})
    console.log(data)
  }

  async getHomeList(params = {}) {
    let data = await HttpService.post(this.getHomeListUrl, params)
    return data
  }

  async getUnitList(params = {}) {
    let data = await HttpService.post(this.getUnitListUrl, params)
    return data
  }
}
export default new HomePage()
