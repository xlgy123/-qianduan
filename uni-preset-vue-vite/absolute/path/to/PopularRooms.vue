// 修改initScrollParams方法
initScrollParams() {
// 使用选择器查询获取准确的容器和视口宽度
  const query = uni.createSelectorQuery().in(this);
  query.select('.popular-rooms-scroll').boundingClientRect();
  query.exec((res) => {
    if (res && res[0] && this.rooms.length > 0) {
      // 获取实际的视口宽度
      const viewportWidth = res[0].width;
      // 容器宽度 = 卡片数 * 卡片宽度
      const containerWidth = this.rooms.length * this.cardWidth;
      // 最大滚动距离
      this.maxScrollLeft = Math.max(0, containerWidth - viewportWidth);
    } else {
      this.maxScrollLeft = 0;
    }
  });
}

// 将原有的manualScroll方法替换为以下代码
manualScroll(position) {
  // 使用选择器查询来获取scroll-view元素并设置滚动位置
  const query = uni.createSelectorQuery().in(this);
  query.select('.popular-rooms-scroll')
    .boundingClientRect()
    .fields({
      scrollOffset: true,
      size: true
    }, function(res) {
      // 这里可以获取到实际的滚动元素信息
    })
    .exec(function() {
      // 设置滚动位置
      query.select('.popular-rooms-scroll').scrollOffset({
        scrollLeft: position,
        duration: 300
      });
    });
    
  // 同时更新数据中的值
  this.scrollLeftValue = position;
}