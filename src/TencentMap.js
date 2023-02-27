import React from 'react'
import Request from './request';

export default class TencentMap extends React.Component {
  constructor(props) {
    super(props)
    this.TMap = null
    this.map = null // 地图示例
  }
  componentDidMount() {
    this.request = Request;
    this.loadScript()
    setTimeout(() => {

      this.TMap = window.TMap
      this.initMap();
    }, 100)
  }

  initMap() {
    //定义地图中心点坐标
    let center = new this.TMap.LatLng(39.98412, 116.307484)
    //定义map变量，调用 TMap.Map() 构造函数创建地图
    let map = new this.TMap.Map(document.getElementById('container'), {
      center: center, //设置地图中心点坐标
      zoom: 17.2, //设置地图缩放级别
    })
    // console.log('map',map)
    // this.setState({ map })
  }


  fetch = async () => {
    let url = `/`
        await this.request.get()
  }

  loadScript() {
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://map.qq.com/api/gljs?v=1.exp&key=N7EBZ-QNXCK-42DJR-A66DX-I4T6E-QLBOJ&libraries=place'
    document.body.appendChild(script)
  }
  render() {
    return <div id="container"></div>
  }
}
