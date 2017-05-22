//index.js
//获取应用实例
var bmap = require('../../libs/bmap-wx.js');
var app = getApp()
Page({
  data: {
    motto: '布布是笨狗',
    userInfo: {},
    locationCityName: '正在定位...',
    selectCity: '西安',
    weatherData: {},
    nowAPIweatherData: {},
    aqiInfo:{},
    weatherSrc: '../../imgs/Weather_Forecast_yellow_02.png',
  },

  onPullDownRefresh: function () {
    this.onLoad();
    wx.stopPullDownRefresh()
  },

  selectProvince: function () {
    console.log('you tap it')
    wx.navigateTo({
      url: '../province/province',
    })
  },

  weatherPic: function (y) {
    var z;
    if (y.indexOf('晴') != -1) {
      z = '../../imgs/Weather_Forecast_yellow_01.png';
    } else if (y.indexOf('阴') != -1) {
      z = '../../imgs/Weather_Forecast_yellow_04.png';
    }
    else if (y.indexOf('多云') != -1) {
      z = '../../imgs/Weather_Forecast_yellow_37.png';
    }
    else if (y.indexOf('雨') != -1) {
      z = '../../imgs/Weather_Forecast_yellow_15.png';
    } else if (y.indexOf('雪') != -1) {
      z = '../../imgs/Weather_Forecast_yellow_24.png';
    } else if (y.indexOf('雷') != -1) {
      z = '../../imgs/Weather_Forecast_yellow_32.png';
    } else {
      z = '../../imgs/Weather_Forecast_yellow_02.png';
    }
    return z;
  },

  onLoad: function () {
    wx.showLoading({
      title: '加载中',
    })

    if (wx.getStorageSync('selectCity') ) {
      this.setData({
        selectCity: wx.getStorageSync('selectCity'),
      })
    } else {
      var that = this;

      // 新建百度地图对象 
      var BMap = new bmap.BMapWX({
        ak: 'KUGdmECfD2ovSTaGVfz2CoXGoM6H4GMe'
      });
      var fail = function (data) {
        console.log(data)
      };
      var success = function (data) {
        console.log(data);
        let result = data.originalData.result.addressComponent.city;
        if (result[result.length - 1] == '市') {
          result = result.slice(0, result.length - 1)
        };
        that.setData({
          selectCity: result
        })
      }
      // 发起regeocoding检索请求 
      BMap.regeocoding({
        fail: fail,
        success: success,
      });
    }
      var that = this
      wx.request({
        url: 'https://sapi.k780.com',
        data: {
          app: 'weather.future',
          appkey: '23683',
          sign: '3b68de4a11d52725024d652d0250a008',
          weaid: that.data.selectCity,
          format: 'json'
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log('未来天气')
          console.log(res);
          that.setData({
            nowAPIweatherData: res,
          });
          //AQI指数
          wx.request({
            url: 'https://sapi.k780.com', //仅为示例，并非真实的接口地址
            data: {
              app: 'weather.pm25',
              appkey: '23683',
              sign: '3b68de4a11d52725024d652d0250a008',
              weaid: that.data.selectCity,
              format: 'json'
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log('AQI指数');
              console.log(res);
              that.setData({
                aqiInfo: res,
              });
              //实时天气
              wx.request({
                url: 'https://sapi.k780.com', //仅为示例，并非真实的接口地址
                data: {
                  app: 'weather.today',
                  appkey: '23683',
                  sign: '3b68de4a11d52725024d652d0250a008',
                  weaid: that.data.selectCity,
                  format: 'json'
                },
                header: {
                  'content-type': 'application/json'
                },
                success: function (res) {
                  console.log('实时天气');
                  console.log(res);
                  that.setData({
                    weatherData: res,
                    weatherSrc: that.weatherPic(res.data.result.weather)
                  });
                  wx.hideLoading();
                }
              });
            }
          });
        }
      })
  
  },
})
