Page({
  onTap: function () {
    // wx.navigateTo({
    //   // 从父级跳往子级
    //   url: '../posts/post',
    // });

    //跳到有tabbar的页面，redirectTo和navigateTo不能再跳转到带有tab选项卡的页面
    wx.switchTab({
      url: '../posts/post'
    })

  }
})