/**
 * Created by gd on 2017/12/29/029.
 */

class Util {
  constructor() {
    this.PI = Math.PI
    this.rules = {
      verification: [/^\s*[\s\S]{6}\s*$/, '请输入6位验证码'],
      length6: [/^\s*[\s\S]{1,6}\s*$/, '请填写1-6个字'],
      length16: [/^\s*[\s\S]{1,16}\s*$/, '请填写1-16个字'],
      length30: [/^\s*[\s\S]{1,30}\s*$/, '请填写1-30个字'],
      length140: [/^\s*[\s\S]{1,140}\s*$/, '请填写1-140个字'],
      notEmpty: [/[^^\s*$]/, '不能为空'],
      digits: [/^\d+$/, '请填写数字'],
      letters: [/^[a-z]+$/i, '请填写字母'],
      date: [/^\d{4}-\d{2}-\d{2}$/, '请填写有效的日期，格式:yyyy-mm-dd'],
      time: [/^([01]\d|2[0-3])(:[0-5]\d){1,2}$/, '请填写有效的时间，00:00到23:59之间'],
      email: [/^[\w\+\-]+(\.[\w\+\-]+)*@[a-z\d\-]+(\.[a-z\d\-]+)*\.([a-z]{2,4})$/i, '请填写有效的邮箱'],
      url: [/^(https?|s?ftp):\/\/\S+$/i, '请填写有效的网址'],
      qq: [/^[1-9]\d{4,}$/, '请填写有效的QQ号'],
      IDcard: [/^\d{6}(19|2\d)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)?$/, '请填写正确的身份证号码'],
      tel: [/^(?:(?:0\d{2,3}[\- ]?[1-9]\d{6,7})|(?:[48]00[\- ]?[1-9]\d{6}))$/, '请填写有效的电话号码'],
      mobile: [/^1[3-9]\d{9}$/, '请填写有效的手机号'],
      zipcode: [/^\d{6}$/, '请检查邮政编码格式'],
      chinese: [/^[\u0391-\uFFE5]+$/, '请填写中文字符'],
      username: [/^\w{1,12}$/, '请填写3-12位数字、字母、下划线'],
      password: [/^[\S]{6,16}$/, '请填写6-16位字符，不能包含空格'],
      telOrMobile: [/(^(0[0-9]{2,3}(-)?)?[0-9]{7,8}$)|(^((\+?86)|(\(\+86\)))?(1[3|4|5|7|8]\d{9})$)/, '请输入正确的电话号码']
    }
  }

  urlEncode(url, params) {
    var result = url + '?'
    for (var key in params) {
      result += key + '=' + params[key] + '&'
    }
    return encodeURI(result.substring(0, result.length - 1))
  }

  getLongitude(longitude) {
    if (longitude > this.PI) {
      return ((longitude - 2 * this.PI) / this.PI) * 180
    } else {
      return ((longitude) / this.PI) * 180
    }
  }

  getLatitude(latitude) {
    if (latitude < 0) {
      return window.Math.abs(latitude / this.PI) * 180
    } else {
      return -((latitude / this.PI) * 180)
    }
  }

  getRandomString(number = 16) {
    return Math.random().toString(number).substr(2)
  }

  dateFormat(time, fmt) {
    let datArr = ['日', '一', '二', '三', '四', '五', '六']
    let o = {
      "M+": time.getMonth() + 1,                 //月份
      "d+": time.getDate(),                    //日
      "h+": time.getHours(),                   //小时
      "m+": time.getMinutes(),                 //分
      "s+": time.getSeconds(),                 //秒
      "q+": Math.floor((time.getMonth() + 3) / 3), //季度
      "S": time.getMilliseconds(),             //毫秒
      'w': datArr[time.getDay()]
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }

  getRandomColor() {
    let hex = Math.floor(Math.random() * 16777216).toString(16)
    while (hex.length < 6) {
      hex = '0' + hex
    }
    return '#' + hex
  }
}
export default new Util()
