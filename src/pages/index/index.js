//index.js
const util = require("../../utils/util.js");
//播放的视频或者音频的ID
var playingID = -1;
var types = ["1", "41", "10", "29", "31"];
var page = 1; //页码
var allMaxtime = 0; //全部 最大时间
var videoMaxtime = 0; //视频 最大时间
var pictureMaxtime = 0; //图片 最大时间
var textMaxtime = 0; //段子 最大时间
var voiceMaxtime = 0; //声音 最大时间

//1->全部;41->视频;10->图片;29->段子;31->声音;
var DATATYPE = {
  ALLDATATYPE: "1",
  VIDEODATATYPE: "41",
  PICTUREDATATYPE: "10",
  TEXTDATATYPE: "29",
  VOICEDATATYPE: "31"
};

Page({
  data: {
    topTabItems: ["全部", "视频", "图片", "段子", "声音"],
    currentTopItem: 0,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //切换顶部标签
  switchTab: function (e) {
    this.setData({
      currentTopItem: e.currentTarget.dataset.idx
    });
    //如果需要加载数据
    if (this.needLoadNewDataAfterSwiper()) {
      this.refreshNewData();
    }
  },
  //滚动后需不要加载数据
  needLoadNewDataAfterSwiper: function () {

    switch (types[this.data.currentTopItem]) {
      //全部
      case DATATYPE.ALLDATATYPE:
        return this.data.allDataList.length > 0 ? false : true;

        //视频
      case DATATYPE.VIDEODATATYPE:
        return this.data.videoDataList.length > 0 ? false : true;

        //图片
      case DATATYPE.PICTUREDATATYPE:
        return this.data.pictureDataList.length > 0 ? false : true;

        //段子
      case DATATYPE.TEXTDATATYPE:
        return this.data.textDataList.length > 0 ? false : true;

        //声音
      case DATATYPE.VOICEDATATYPE:
        return this.data.voiceDataList.length > 0 ? false : true;

      default:
        break;
    }

    return false;
  },
  //刷新数据
  refreshNewData: function () {
    //加载提示框
    util.showLoading();
    var that = this;
    var parameters = 'a=list&c=data&type=' + types[this.data.currentTopItem];
    console.log("parameters = " + parameters);
    util.request(parameters, function (res) {
      page = 1;
      that.setNewDataWithRes(res, that);
      setTimeout(function () {
        util.hideToast();
        wx.stopPullDownRefresh();
      }, 1000);
    });
  }
})