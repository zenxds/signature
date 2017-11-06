import React, { Component } from 'react'
import {
  Modal
} from 'antd'
import Cropper from 'cropperjs'

class CropModal extends Component {
  constructor(props, context) {
    super(props, context)
  }

  initCrop(img) {
    if (this.cropper) {
      return
    }

    this.cropper = new Cropper(img, {
      aspectRatio: 1,
      // 裁剪框只能在图片范围内移动，不能进入透明区域
      viewMode: 1,
      crop: ({ detail }) => {
        if (detail.width > 0 && detail.height > 0) {
          this.props.actions.merge({
            cropped: this.cropper.getCroppedCanvas().toDataURL()
          })
        }
      }
    })
  }

  componentWillUnmount() {
    this.cropper.destroy()
  }

  render() {
    return (
      <Modal
        title={'二维码裁剪 - 滚轮缩放图片，双击进行裁剪'}
        visible={true}
        width={800}
        footer={null}
        onCancel={() => {
          this.props.actions.merge({
            showCropModal: false
          })
        }}
      >
        <div onDoubleClick={() => {
          this.props.actions.merge({
            showCropModal: false
          })
        }}>
          <img src={this.props.image} ref={img => {
            this.initCrop(img)
          }} />
        </div>
      </Modal>
    )
  }
}

export default CropModal
