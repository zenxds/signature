import { observable, action } from "mobx"
import request from 'util/request'

let user = {}

try {
  user = JSON.parse(window.user)
} catch(e) {
  console.log(e)
}

class AppStore {
  @observable showCropModal = false

  @observable name = ''
  @observable job = ''
  @observable phone = user.phoneNumber || ''
  @observable email = user.email || ''
  @observable address = ''
  // 原始上传的二维码
  @observable qrcode = ''
  // 裁剪后的二维码
  @observable cropped = ''
  @observable company = '公司名称'
  @observable website = '公司网址'
}

export default new AppStore()
