var postsData = require('../../data/posts-data.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    //小程序总会读取data对象来做数据绑定，这个动作我们称之为动作A
    //而这个动作A的执行，总是在onload函数执行之后发生的
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //页面初始化 options为页面跳转所带来的参数
    //this.data.postList = postsData.postList也可以以设置属性的方式绑定数据
    this.setData({
      posts_key: postsData.postList
    });

  },

  onPostTap:function(event){
    var postId = event.currentTarget.dataset.postid;
    // console.log("on post id is" + postId);
    wx.navigateTo({
      url: 'post-detail/post-detail',
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})