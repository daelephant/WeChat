Page({
  onTap:function(){
      // wx.navigateTo({
      //   // 从父级跳往子级
      //   url: '../posts/post',
      // });
      
      //平级的跳转，无法返回
      wx.navigateTo({
        url: '../posts/post',
      });

  }
})