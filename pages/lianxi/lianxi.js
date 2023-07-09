// pages/lianxi/lianxi.js
Page({

    /**
     * 页面的初始数据
     */
    data: { 
      tem_price:'',
      tem_spec:'',
      specList:[
        {spec:'iphone6',good_price:'5555',class:''},
        {spec:'iphone7',good_price:'6565',class:''},
        {spec:'iphone8',good_price:'8557',class:''}
      ]
    },

    tapTitle(e){
     let index=e.currentTarget.dataset.id
     let arr=this.data.specList
     let var_price
     let var_spec
     for(let i=0;i<arr.length;i++){
       if(i==index){
         arr[i]['class']="txtColor";
         var_price=arr[i].good_price;
         var_spec=arr[i].spec;
         continue;
       }
       arr[i]['class']="";
     }
     this.setData({
       specList:arr,current:index,tem_price:var_price,tem_spec:var_spec
     })
   },

   swiperInfo(e){
    let index=e.detail.current
    let arr=this.data.specList
    let var_price
     let var_spec
    for(let i=0;i<arr.length;i++){
      if(i==index){
        arr[i]['class']="txtColor";
        var_price=arr[i].good_price;
        var_spec=arr[i].spec;
        continue;
      }
      arr[i]['class']="";
    }
    this.setData({
      specList:arr,current:index,tem_price:var_price,tem_spec:var_spec
    })
  },
  

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

     
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})