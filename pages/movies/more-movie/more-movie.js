// pages/movies/more-movie/more-movie.js
var app = getApp();//引入全局变量
var util = require('../../../utils/util.js');
Page({
  data: {
    navigateTitle: "",
    movies: {},
    requestUrl:"",
    totalCount:0,
    isEmpty:true,
  },
  onLoad: function (options) {
    var category = options.category;//获取get传的数据
    this.setData({
      navigateTitle: category
    });
    //this.data.navigateTitle = category;
    var dataUrl = "";
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "豆瓣Top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    this.data.requestUrl = dataUrl;
    util.http(dataUrl, this.processDoubanData);
  },

  // onScrollLower:function(event){
  //   // console.log("加载更多。。。");
  //   var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
  //   util.http(nextUrl, this.processDoubanData);
  //   wx.showNavigationBarLoading();
  // },
  //版本更新加载更多的方法：
  onReachBottom: function (event) {
    var nextUrl = this.data.requestUrl +
      "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData)
    wx.showNavigationBarLoading()
  },

  onPullDownRefresh:function(event){
    var refreshUrl = this.data.requestUrl + "?start=0&count=20";
    this.data.movies = {};
    this.data.isEmpty = true;
    util.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  processDoubanData: function (moviesDouban) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      //五星[1,1,1,1,1]  [1,1,1,0,0]
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        avarage: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      };
      movies.push(temp);
    }

    var totalMovies = {} //定义变量设置容器
    // 如果要绑定新加载的数据，那么需要同旧有的数据合并在一起
    if(!this.data.isEmpty){
      totalMovies = this.data.movies.concat(movies);
    }
    else{
      totalMovies = movies;
      this.data.isEmpty = false;
    }

    this.setData({
      movies: totalMovies
    });
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();
  },

  onReady: function (event) {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
    })
  }
})