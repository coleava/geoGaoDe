import React from 'react'
import './MapContainer.css'
import AMapLoader from '@amap/amap-jsapi-loader'
import { Input, List, Tag } from 'antd'

class MapComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      selectTarget: {},
    }
    this.map = {}
    this.AMap = null
    this.markerList = []
    this.marker = null
  }
  // 2.dom渲染成功后进行map对象的创建
  componentDidMount() {
    AMapLoader.load({
      key: '3a19a9a07a26368d3111b630b75db77e', // 申请好的Web端开发者Key，首次调用 load 时必填
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

        // 加载热力图插件
        // this.map.plugin(['AMap.HeatMap'], () => {
        //   // 在地图对象叠加热力图
        //   heatmap = new AMap.HeatMap(this.map, {
        //     radius: 50, //给定半径
        //     opacity: [0.4, 0.8],
        //     gradient: {
        //       0.3: 'blue',
        //       0.5: 'green',
        //       0.7: 'yellow',
        //       0.9: 'red',
        //     },
        //   })
        //   // 设置热力图数据集
        //   heatmap.setDataSet({ data: points, max: 100 })
        // })
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
      this.map.plugin('AMap.Geocoder', () => {
        result.cityList.map((city) => {
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
    let { list } = this.state

    // console.log(data,this)
    new this.AMap.PlaceSearch({
      city: data.name,
      pageSize: 999, //每页结果数,默认10
      pageIndex: 1, //请求页码，默认1
      extensions: 'base',
    }).search('希尔顿酒店', (status, result) => {
      // 搜索成功时，result即是对应的匹配数据
      let { pois } = result.poiList
      this.setState({ list: pois }, () => {
        pois.forEach((poi) => {
          let marker = new this.AMap.Marker({
            position: [poi.location.lng, poi.location.lat], // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            title: poi.name,
            icon: 'https://webapi.amap.com/theme/v1.3/markers/b/mark_bs.png',
          })
          marker.on('click', (e) => {
            let newList = []
            let { _opts } = e.target
            pois.forEach((po) => {
              let obj = { ...po }
              if (po.name === _opts.title) {
                obj['padding'] = 8
                obj['border'] = '1px solid red'
              } else {
                obj['padding'] = 0
                obj['border'] = ''
              }
              newList.push(obj)
            })
            this.setState({ list: newList })
          })
          this.markerList.push(marker)
        })

        this.map.add(this.markerList)
        this.map.setZoomAndCenter(10, center, false, 1500)
      })
    })
  }

  select = (item) => {
    // if (this.marker) {
    //   this.map.remove(this.marker)
    // }
    // let marker = new this.AMap.Marker({
    //   position: [item.location.lng, item.location.lat], // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
    //   //   title: '',
    //   icon: 'https://webapi.amap.com/theme/v1.3/markers/b/mark_bs.png',
    // })
    // this.marker = marker
    // this.map.add(marker)

    let { list } = this.state
    let newList = []
    list.forEach((l) => {
      let obj = { ...l }
      if (l.name === item.name) {
        obj['padding'] = 8
        obj['border'] = '1px solid red'
      } else {
        obj['padding'] = 0
        obj['border'] = ''
      }
      newList.push(obj)
    })

    this.setState({ list: newList }, () => {
      this.markerList.map((marker) => {
        if (marker._opts.title == item.name) {
          marker.setIcon(require('./imgs/location-red.png'))
        } else {
          marker.setIcon('https://webapi.amap.com/theme/v1.3/markers/b/mark_bs.png')
        }

        return marker
      })
      this.map.setZoomAndCenter(13, [item.location.lng, item.location.lat], false, 1500)
    })
  }
  render() {
    // 1.初始化创建地图容器,div标签作为地图容器，同时为该div指定id属性；
    return (
      <div style={{ overflowY: 'hidden', height: '100vh' }}>
        <div id="container" className="map" style={{ height: '60vh' }}></div>
        {/* <Input.Search className="map-input" onSearch={(val) => this.search(val)} /> */}

        <List
          style={{ margin: '0 16px', overflowY: 'auto', height: 'calc(100% - 60vh)' }}
          itemLayout="horizontal"
          dataSource={this.state.list}
          renderItem={(item) => (
            <List.Item
              style={{ cursor: 'pointer', border: item.border || '', padding: item.padding || 0 }}
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
      </div>
    )
  }
}
//导出地图组建类
export default MapComponent

// 31.23785863767256, 121.59711
