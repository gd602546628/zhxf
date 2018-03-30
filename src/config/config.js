/**
 * Created by gd on 2017/12/29/029.
 */
const isTest = true // false关闭权限验证,适用本地调试样式
const build = 1 // 0生产  1测试  2王伟本地 3陈永刚 4刘宝 5李自涛
const urlMap = {
  0: 'http://47.104.136.67/pg/',
  1: 'http://172.31.60.191/fire/',
  2: 'http://172.31.61.85:8181/fire/',
  3: 'http://172.31.61.35:8181/fire/',
  4: 'http://172.31.61.56:8181/fire/',
  5: 'http://172.31.61.25:8181/fire/',
  6: 'http://172.31.60.66:8181/fire/'
}
const fileMap = {
  0: 'http://172.31.60.191/ftp/',
  1: 'http://172.31.60.191/ftp/',
  2: 'http://172.31.60.191/ftp/',
  3: 'http://172.31.60.191/ftp/',
  4: 'http://172.31.60.191/ftp/',
  5: 'http://172.31.60.191/ftp/',
}
const UrlPre = urlMap[build]
const FilePre = fileMap[build]
const UploadUrl = { // 上传地址
  multipartUploadFile: `${UrlPre}public/multipartUploadSource`,// 文件上传
}
const Code = {
  SUCCESS: '000000',
  NO_AUTHORITY: '000003' // 无访问权限
}

export {UploadUrl, Code, UrlPre, FilePre, isTest}



