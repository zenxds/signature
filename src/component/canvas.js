import React, { Component } from 'react'
import {
  Button,
  Steps,
  Modal
} from 'antd'
const Step = Steps.Step

const ratio = 2
const canvasWidth = 680
const canvasHeight = 216
// pingfang sc字体下大小对应的（行高 - 字体大小）/ 2
const lineHeightsDiff = {
  '12': 2,
  '14': 3,
  '16': 3.5,
  '20': 4
}
const textX = 266
const bg = require('../image/bg@2.png')

class Canvas extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      showStepModal: false
    }
  }

  componentDidMount() {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        this.draw(this.props.data)
      })
    } else {
      setTimeout(() => {
        this.draw(this.props.data)
      }, 1000)
    }
  }

  /**
   * 把二倍大小的canvas转为1倍大小
   */
  download() {
    const canvas = this.canvas
    const ctx = canvas.getContext('2d')
    // const resizedCanvas = document.createElement("canvas")
    // const resizedContext = resizedCanvas.getContext("2d")

    // resizedCanvas.height = canvasHeight
    // resizedCanvas.width = canvasWidth
    // resizedContext.drawImage(canvas, 0, 0, resizedCanvas.width, resizedCanvas.height)

    const a = document.createElement('a')
    a.download = '邮件签名'
    a.href = canvas.toDataURL()
    a.click()
  }

  componentWillReceiveProps(nextProps) {
    this.draw(nextProps.data)
  }

  draw(data) {
    const canvas = this.canvas
    const ctx = canvas.getContext('2d')

    loadImage(bg).then(image => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

      // 分隔线
      ctx.strokeStyle = '#363E91'
      ctx.lineWidth = 1 * ratio
      ctx.beginPath()
      ctx.moveTo(225 * ratio, 18 * ratio)
      ctx.lineTo(225 * ratio, (150 + 18) * ratio)
      ctx.closePath()
      ctx.stroke()

      // 名字的宽度，职位要写在名字的后面
      let nameWidth = 0

      ctx.fillStyle = '#fff'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'

      // 姓名
      if (data.name) {
        ctx.save()

        // const name = data.name.replace(/\s+/g, '').split('').join('  ')
        const name = data.name
        ctx.font = `${20 * ratio}px "sc-medium"`
        nameWidth = ctx.measureText(name).width
        ctx.fillText(name, textX * ratio, (19 - lineHeightsDiff['20']) * 2)

        ctx.restore()
      }

      // 职位
      if (data.job) {
        ctx.save()
        ctx.font = `${12 * ratio}px "sc-regular"`
        ctx.fillText(data.job, textX * ratio + nameWidth + 10 * ratio, (26 - lineHeightsDiff['12']) * 2)
        ctx.restore()
      }

      // 公司
      if (data.company) {
        ctx.save()
        ctx.font = `${14 * ratio}px "sc-medium"`
        ctx.fillText(data.company, textX * ratio, (59 - lineHeightsDiff['12']) * 2)
        ctx.restore()
      }

      // 电话
      if (data.phone) {
        ctx.save()
        ctx.font = `${12 * ratio}px "sc-regular"`
        ctx.fillText(`电话：${data.phone}`, textX * ratio, (95 - lineHeightsDiff['12']) * 2)
        ctx.restore()
      }

      // 邮箱
      if (data.email) {
        ctx.save()
        ctx.font = `${12 * ratio}px "sc-regular"`
        ctx.fillText(`邮箱：${data.email}`, textX * ratio, (115 - lineHeightsDiff['12']) * 2)
        ctx.restore()
      }

      // 地址
      if (data.address) {
        ctx.save()
        ctx.font = `${12 * ratio}px "sc-regular"`
        ctx.fillText(`地址：${data.address}`, textX * ratio, (135 - lineHeightsDiff['12']) * 2)
        ctx.restore()
      }

      if (data.website) {
        ctx.save()
        ctx.font = `${12 * ratio}px "sc-regular"`
        ctx.fillText(`网址：${data.website}`, textX * ratio, (155 - lineHeightsDiff['12']) * 2)
        ctx.restore()
      }

      // 二维码
      if (data.cropped) {
        // 二维码背景
        roundedRect(ctx, 576 * ratio, 20 * ratio, 84 * ratio, 84 * ratio, 4 * ratio)
        ctx.fill()

        loadImage(data.cropped).then(img => {
          ctx.drawImage(img, 580 * ratio, 24 * ratio, 76 * ratio, 76 * ratio)
        })
      }

      // footer文字
      ctx.save()
      ctx.font = `${16 * ratio}px "sc-medium"`
      ctx.textAlign = 'center'
      ctx.fillText('公 司 标 语', canvas.width / 2, (186 - lineHeightsDiff['16'] + 7) * ratio)
      ctx.restore()
    })
  }

  render() {
    /**
     * 画一个两倍的canvas
     * 展示的时候使用一倍的大小
     * 解决高清屏模糊的问题
     */
    return (
      <div className="canvas-container">
        <canvas width={canvasWidth * ratio} height={canvasHeight * ratio} style={{
          width: canvasWidth,
          height: canvasHeight
        }} ref={(canvas) => {
          this.canvas = canvas
        }} />

        <div className="download-box">
          <Button icon="download" onClick={this.download.bind(this)}>下载图片</Button>
          <a onClick={() => {
            this.setState({
              showStepModal: true
            })
          }}>邮件签名设置教程</a>
        </div>

        {
          this.state.showStepModal ?
          <Modal
            title={'邮件签名设置教程'}
            visible={true}
            footer={null}
            onCancel={() => {
              this.setState({
                showStepModal: false
              })
            }}
          >
            <Steps direction="vertical">
              <Step title="打开企业邮箱首页" status="finish" />
              <Step title="点击设置-常规-添加个性签名" status="finish" />
              <Step title="上传图片" status="finish" />
              <Step title="设置图片大小" description={
                <div>
                  { '为了保证签名图片在高清屏下能够清晰展示，需要手动设置图片大小，点击HTML模式，在图片标签上添加宽高设置，如下所示' }
                  <pre>{ '<div><img width="680" height="216" src="图片地址"></div>' }</pre>
                </div>
              } status="finish" />
              <Step title="保存" status="finish" />
            </Steps>
          </Modal>
          : null
        }
      </div>
    )
  }
}

export default Canvas

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.setAttribute('crossOrigin', 'anonymous')

    image.onload = () => {
      resolve(image)
    }
    image.onabort = image.onerror = reject

    image.src = url
  })
}

/**
 * 圆角矩形
 */
function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath()
  ctx.moveTo(x, y + radius)
  ctx.lineTo(x, y + height - radius)
  ctx.quadraticCurveTo(x, y + height, x + radius, y + height)
  ctx.lineTo(x + width - radius, y+height)
  ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius)
  ctx.lineTo(x + width,y + radius)
  ctx.quadraticCurveTo(x+width,y,x+width-radius,y)
  ctx.lineTo(x + radius, y)
  ctx.quadraticCurveTo(x, y, x, y + radius)
}
