import { Component } from 'react'
import { autorun, toJS } from 'mobx'
import { inject, observer } from "mobx-react"

import {
  Row,
  Col,
  Form,
  Upload,
  Input,
  Icon,
  Button
} from 'antd'

const FormItem = Form.Item

import Canvas from './component/canvas'
import CropModal from './component/modal'
import { COMPANY_ADDRESSES } from './constant'
import './less/styles.less'

@inject('appStore', 'actions')
@observer
class App extends Component {

  constructor(props, context) {
    super(props, context)

    this.store = this.props.appStore
    this.actions = this.props.actions
  }

  onChange(field, e) {
    this.actions.merge({
      [field]: typeof e === 'string' ? e : e.target.value
    })
  }

  getUploadProps() {
    return {
      name: 'qrcode',
      accept: 'image/*',
      beforeUpload: file => {
        const reader  = new FileReader()

        reader.addEventListener("load", () => {
          this.onChange('qrcode', reader.result)
          this.actions.merge({
            showCropModal: true
          })
        }, false)

        reader.readAsDataURL(file)
        return false
      },
      onChange(info) {
      }
    }
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 20 }
      }
    }

    return (
      <div className="app-container">
        <div className="form-container">
          <Form>
            <FormItem
              {...formItemLayout}
              label="姓名"
            >
              <Input value={this.store.name} onChange={this.onChange.bind(this, 'name')} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="职位"
            >
              <Input value={this.store.job} onChange={this.onChange.bind(this, 'job')} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="电话"
            >
              <Input value={this.store.phone} onChange={this.onChange.bind(this, 'phone')} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="公司"
            >
              <Input value={this.store.company} onChange={this.onChange.bind(this, 'company')} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="邮箱"
            >
              <Input value={this.store.email} onChange={this.onChange.bind(this, 'email')} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="地址"
              extra={
                <div>
                  {
                    COMPANY_ADDRESSES.map(item => {
                      return (
                        <a
                          key={item.location}
                          className="address-item"
                          onClick={() => {
                            this.onChange('address', item.address)
                          }}>
                            { item.location }
                        </a>
                      )
                    })
                  }
                  { <small>办公室/具体门牌号请自行补充</small> }
                </div>
              }
            >
              <Input value={this.store.address} onChange={this.onChange.bind(this, 'address')} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="网址"
            >
              <Input value={this.store.website} onChange={this.onChange.bind(this, 'website')} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="二维码"
              extra="微信 - 我 - 点击昵称 - 我的二维码 - 保存图片"
            >
              <Upload {...this.getUploadProps()}>
                <Button>
                  <Icon type="upload" />上传二维码
                </Button>
              </Upload>
            </FormItem>
          </Form>
        </div>
        <Canvas data={toJS(this.store)} />
        { this.store.showCropModal ? <CropModal image={this.store.qrcode} actions={this.actions}  /> : null}
      </div>
    )
  }
}

export default App
