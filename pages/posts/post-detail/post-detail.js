var postsData = require('../../../data/posts-data.js');
var app = getApp();
Page({
  data: {
    isPlayingMusic: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postId = options.id;
    this.data.currentPostId = postId;
    var postData = postsData.postList[postId];
    this.setData({
      postData: postData
    });
    //this.data.posts_detail = postData;
    //如果在onLoad方法中，不是异步的去执行一个数据绑定，就不需要this.setData()方法，这里的this.data赋值不生效
    //最好默认按照this.setData()这种方法绑定数据

    //设置缓存，永久缓存，不超过10Mb
    //wx.setStorageSync('key', { game: "QQ飞车", developer: "Tencent" });


    // var postCollected = {
    //   1:"true",
    //   2:"false",
    //   3:"true"
    //   ...
    // },

    var postsCollected = wx.getStorageSync('posts_collected')

    if (postsCollected) {
      //console.log(postsCollected[postId]);
      var postCollected = postsCollected[postId]
      if (postsCollected[postId]) {
        this.setData({
          collected: postCollected
        })
      }

    }
    else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected);
    }
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId){
      // this.data.isPlayingMusic = true;
      this.setData({
        isPlayingMusic:true,
      });
    }
    this.setMusicMonitor();
  },
  setMusicMonitor:function(){
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true
      });
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentMusicPostId = that.data.currentPostId;
    });
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      });
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    });

    wx.onBackgroundAudioStop(function () {
      that.setData({
        isPlayingMusic: false
      });
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    });
  },

  onCollectionTap: function (event) {
    this.getPostCollectedSyc();
    //this.getPostCollectedAsy();
  },
  //异步的方法
  getPostCollectedAsy: function () {
    var that = this;
    wx.getStorage({
      key: 'posts_collected',
      success: function (res) {
        var postsCollected = res.data;
        var postCollected = postsCollected[that.data.currentPostId];
        postCollected = !postCollected;//取反:收藏变成未收藏，未收藏变成收藏
        postsCollected[that.data.currentPostId] = postCollected;//更新
        that.showToast(postsCollected, postCollected);
      }
    })
  },

  //同步的方法
  getPostCollectedSyc: function () {
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = postsCollected[this.data.currentPostId];
    postCollected = !postCollected;//取反:收藏变成未收藏，未收藏变成收藏
    postsCollected[this.data.currentPostId] = postCollected;//更新
    this.showToast(postsCollected, postCollected);

  },

  showModal: function (postsCollected, postCollected) {
    var that = this;
    wx.showModal({
      title: '收藏',
      content: postCollected ? '收藏该文章?' : '取消收藏该文章？',
      showCancel: 'true',
      cancelText: "取消",
      cancelColor: "#333",
      confirmText: "确认",
      confirmColor: "405f80",
      //success里面的this指代是改变的，如果用当前PAGE需要提前指定
      success: function (res) {
        if (res.confirm) {
          //更新文章是否的缓存值，相当于更新数据库值
          wx.setStorageSync('posts_collected', postsCollected);
          //更新数据绑定变量，从而实现切换图片
          that.setData({
            collected: postCollected
          })
        }
      }
    })
  },

  showToast: function (postsCollected, postCollected) {
    //更新文章是否的缓存值，相当于更新数据库值
    wx.setStorageSync('posts_collected', postsCollected);
    //更新数据绑定变量，从而实现切换图片
    this.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? "收藏成功" : "取消成功",
      duration: 1000,
      icon: "success",
    })
  },

  onShareTap: function (event) {
    var itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ]
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function (res) {
        //res.cancel 用户是不是点击了取消按钮
        //res.tapTindx 数组元素的序号，从0开始
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: '用户是否取消' + res.cancel + "现在无法实现分享功能，什么时候支持呢",
        })

      }
    })
  },
  onMusicTap: function (event) {
    var currentPostId = this.data.currentPostId;
    var isPlayingMusic = this.data.isPlayingMusic;
    var postData = postsData.postList[currentPostId];
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      });
    }
    else {
      wx.playBackgroundAudio({
        // dataUrl: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46',
        // title: '此时此刻-许巍',
        // coverImgUrl: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg
      });
      this.setData({
        isPlayingMusic: true
      });
    }

  }
})