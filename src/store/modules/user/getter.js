/**
 * Created by gd on 2017/12/29/029.
 */

import {UploadUrl} from '@/config/config'
export default {
  sysAuthUrls: state => state.sysAuthUrls,
  sysUserBg: state => state.sysUserBg,
  isLogin: state => state.sysAuthUrls && state.sysUserBg && state.JSESSIONID,
  parent_user:state => state.parent_user,
  JSESSIONID: state => state.JSESSIONID,
  q_cityInfo: state => state.q_cityInfo,
  defaultAreaSelect: state => state.defaultAreaSelect ||[state.q_cityInfo[0].id,
    state.q_cityInfo[0].nextArea[0].id,
    state.q_cityInfo[0].nextArea[0].nextArea[0].id
  ],
  upload_file:state => UploadUrl.multipartUploadFile + ';JSESSIONID=' + state.JSESSIONID,
}


