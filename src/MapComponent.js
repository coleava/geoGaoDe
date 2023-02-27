import React from 'react'
import './MapContainer.css'
import AMapLoader from '@amap/amap-jsapi-loader'
import { Card, List, Tag, Rate, Button, Modal } from 'antd'
// import cityList from './cityList'
// import list from './data'
class MapComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      showDetail: false,
      selectLocation: null,
    }
    this.map = {}
    this.AMap = null
    this.markerList = []
    this.marker = null
  }
  // 2.dom渲染成功后进行map对象的创建
  componentDidMount() {
    AMapLoader.load({
      key: '8e893029d763f08d6ca40b941597d6d0', // 申请好的Web端开发者Key，首次调用 load 时必填
      version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: ['AMap.HeatMap', 'AMap.PlaceSearch', 'AMap.Autocomplete'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    })
      .then((AMap) => {
        this.AMap = AMap
        this.map = new AMap.Map('container', {
          //设置地图容器id
          // viewMode:"3D",         //是否为3D地图模式
          zoom: 12,
          //   center: [116.397428, 39.90923],
          //   center: [121.38054, 31.22593], //初始化地图中心点位置
          //   rotation: 60,
          terrain: true,
        })
        this.search()
        // let marker = new AMap.Marker({
        //   position: new AMap.LngLat(121.297951, 31.138336), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        //   //   title: '',
        //   icon: 'https://webapi.amap.com/theme/v1.3/markers/b/mark_bs.png',
        // }

        // this.map.add([marker, marker1, marker2])
        // var heatmap
        // var points = [
        //   { lng: 121.596718, lat: 31.236351, count: 10 },
        // ]
      })
      .catch((e) => {
        console.log(e)
      })
  }

  search = (keyword) => {
    var PlaceSearchOptions = {
      //设置PlaceSearch属性
      city: '全国', //城市
      type: '', //数据类别
      pageSize: 999, //每页结果数,默认10
      pageIndex: 1, //请求页码，默认1
      extensions: 'base', //返回信息详略，默认为base（基本信息）
    }
    var MSearch = new this.AMap.PlaceSearch(PlaceSearchOptions) //构造PlaceSearch类
    MSearch.search('希尔顿酒店', (status, result) => {
        // console.log('result',result)
      let cityList = result.cityList || []
      this.map.plugin('AMap.Geocoder', () => {
        cityList.map((city) => {
          let geocoder = new this.AMap.Geocoder({
            extensions: 'all',
            city: city.name,
          })
          geocoder.getLocation(city.name, (status1, res) => {
            let { geocodes } = res
            let markerList = []
            geocodes.forEach((geocode) => {
              var marker = new this.AMap.LabelMarker({
                name: city.name,
                position: [geocode.location.lng, geocode.location.lat],
                text: {
                  content: city.name + ': ' + city.count,
                  direction: 'center',
                  style: {
                    fontSize: 12,
                    fontWeight: 'normal',
                    fillColor: '#fff',
                    padding: '2, 5',
                    backgroundColor: 'rgb(246,137,38)',
                    borderColor: '#fff',
                    borderWidth: 1,
                  },
                },
              })
              marker.on('click', (e) => {
                let { _opts } = e.target
                this.viewTarget(_opts, _opts.position)
              })
              markerList.push(marker)
            })

            this.map.add(markerList)
            this.map.setZoomAndCenter(4, [108.92583, 34.54581])
          })
        })
      })
    })
  }

  viewTarget = (data, center) => {
    new this.AMap.PlaceSearch({
      city: data.name,
      pageSize: 999, //每页结果数,默认10
      pageIndex: 1, //请求页码，默认1
      extensions: 'all',
    }).search('希尔顿酒店', (status, result) => {
      // 搜索成功时，result即是对应的匹配数据
      let { pois } = result.poiList
    // console.log('pois',pois)
      this.setState({ list: pois }, () => {
        pois.forEach((poi) => {
          let marker = new this.AMap.Marker({
            position: [poi.location.lng, poi.location.lat], // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            title: poi.name,
            icon: require('./imgs/location-blue.png'),
          })
          marker.on('click', (e) => {
            let newList = []
            let { _opts } = e.target
            let selectLocation = null
            pois.forEach((po) => {
              let obj = { ...po }
              if (po.name === _opts.title) {
                selectLocation = po
                obj['background'] = '#acdefa'
              } else {
                obj['background'] = ''
              }
              newList.push(obj)
            })
            this.setState({ list: newList, showDetail: true, selectLocation }, () => {
              this.openModal(this.state.selectLocation)
            })
          })
          this.markerList.push(marker)
        })

        this.map.add(this.markerList)
        this.map.setZoomAndCenter(10, center, false, 1500)
      })
    })
  }

  select = (item) => {
    let { list } = this.state
    let newList = []
    list.forEach((l) => {
      let obj = { ...l }
      if (l.name === item.name) {
        obj['background'] = '#acdefa'
      } else {
        obj['background'] = ''
      }
      newList.push(obj)
    })
    this.setState({ list: newList }, () => {
      this.markerList.map((marker) => {
        if (marker._opts.title == item.name) {
          marker.setIcon(require('./imgs/location-red.png'))
        } else {
          marker.setIcon(require('./imgs/location-blue.png'))
        }

        return marker
      })
      this.map.setZoomAndCenter(13, [item.location.lng, item.location.lat], false, 1500)
      this.setState({ showDetail: true, selectLocation: item })
    })
  }

  backList = () => {
    this.setState({ showDetail: false }, () => {
      document.querySelector(`#${this.state.selectLocation.id}`).scrollIntoView({
        block: 'end',
        behavior: 'smooth',
      })
    })
  }

  openModal = (target) => {
    this.setState({ showDetail: true, selectLocation: target }, () => {
      this.select(target)
    })
  }

  render() {
    // 1.初始化创建地图容器,div标签作为地图容器，同时为该div指定id属性；
    return (
      <div style={{ overflowY: 'hidden', height: '100vh' }}>
        <div id="container" className="map" style={{ height: '60vh' }}></div>
        {/* <Input.Search className="map-input" onSearch={(val) => this.search(val)} /> */}
        <List
          style={{ overflowY: 'auto', height: 'calc(100% - 62vh)' }}
          itemLayout="horizontal"
          dataSource={this.state.list}
          renderItem={(item) => (
            <List.Item
              id={item.id}
              style={{ cursor: 'pointer', background: item.background || '', marginLeft: 10 }}
              extra={
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                  <div>
                    {[...new Set(item.type.split(';'))].map((tag, index) => {
                      return <Tag key={index}>{tag}</Tag>
                    })}
                  </div>
                  <div>电话： {item.tel}</div>
                </div>
              }
              onClick={() => {
                this.select(item)
              }}>
              <List.Item.Meta title={<a>{item.name}</a>} description={item.address} />
            </List.Item>
          )}
        />
        <Modal
          title="详情"
          open={this.state.showDetail}
          centered
          onCancel={() => this.backList()}
          footer={
            <Button type="primary" onClick={() => this.backList()}>
              关闭
            </Button>
          }>
          <Card style={{border: 'none'}}>
            <div style={{ position: 'relative' }}>
              <img src="https://store.is.autonavi.com/showpic/2f22def110d066018c9386c0700e7fdf" width="100%" height={300} />
            </div>

            {this.state.selectLocation && (
              <div>
                <div style={{ fontSize: 22, fontWeight: 'bold' }}>{this.state.selectLocation.name}</div>
                <div>
                  <Rate allowHalf value={Number(this.state.selectLocation.rating)} style={{ color: 'red' }} />
                  <span style={{ marginLeft: 16 }}>{this.state.selectLocation.rating}分</span>
                  <span style={{ marginLeft: 16 }}> 高档型</span>
                </div>

                <div style={{ padding: '16px 0', display: 'flex', alignItems: 'center' }}>
                  <img src={require('./imgs/location-grey.png')} width="24" />
                  <span style={{ marginLeft: 16, fontSize: 18 }}>{this.state.selectLocation.address}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={require('./imgs/tel.png')} width="24" />
                  <span style={{ marginLeft: 16, fontSize: 18 }}>{this.state.selectLocation.tel}</span>
                </div>
              </div>
            )}
          </Card>
        </Modal>
      </div>
    )
  }
}
//导出地图组建类
export default MapComponent

// 31.23785863767256, 121.59711
