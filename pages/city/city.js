//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: '这里是图片',
    userInfo: {},
    cityList:{}
  },
  //事件处理函数
  selectCity: function (event) {
    wx.setStorageSync('selectCity', this.data.cityList.c[event.target.dataset.selectid].n)
    wx.reLaunch({
      url: '../index/index' 
    })
  },
  onLoad: function (option) {
    console.log(option.provinceid)
    console.log(wx.getStorageSync('provinceList')[option.provinceid])
    var that = this
    //调用应用实例的方法获取全局数据
      that.setData({
        cityList: wx.getStorageSync('provinceList')[option.provinceid]
      })
  },
})
