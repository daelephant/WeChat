var util = require('../../utils/util.js');
var app = getApp();
Page({

  // RESTFul API JSON  粒度和自描述性

  data: {
    //给预定的空值，以免界面异步加载的时候报未定义的错误，
    inTheaters: {},
    comingSoon: {},
    top250: {}
  },

  onLoad: function (event) {
    var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";

    this.getMovieListData(inTheatersUrl, "inTheaters","正在热映");
    this.getMovieListData(comingSoonUrl, "comingSoon","即将上映");
    this.getMovieListData(top250Url, "top250","豆瓣Top250");
  },

  onMoreTap:function(event){
    var category = event.currentTarget.dataset.category;
    //console.log(category);
    wx.navigateTo({
      url: 'more-movie/more-movie?category='+category,
    })
  },

  getMovieListData: function (url, settedkey, categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        // console.log(res);
        that.processDoubanData(res.data, settedkey, categoryTitle);
      },
      fail: function (error) {
        // console.log(error)
      }
    })
  },

  processDoubanData: function (moviesDouban, settedkey,categoryTitle) {
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
    // console.log(movies);
    // this.setData({
    //   movies: movies
    // });

    var readyData = {};
    readyData[settedkey] = {
      movies: movies,
      categoryTitle:categoryTitle
    };
    this.setData(readyData);//这种方法设置变量为键名
  }


})