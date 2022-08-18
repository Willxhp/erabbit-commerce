# erabbit-commerce

## 项目介绍

本项目是基于Vue3.0全家桶开发的电商平台前台项目。

### 项目技术栈

Vue3.0，vueRouter，vuex，less，axios，vueuse，vuex-persistedstate，vee-validate。

### 项目内容

- 首页模块：顶部通栏，吸顶导航，网站头部，左侧分类，轮播图，新鲜好物，人气推荐，热门品牌，分类商品推荐，专题推荐，网站底部。
- 一级分类：面包屑，轮播图，全部二级分类，二级分类推荐商品。
- 二级分类：筛选区域，排序功能，商品列表，无限加载。
- 商品详情：商品图片展示，基本信息展示，配送城市选择，SKU选择，库存选择，商品详情展示，商品评价展示，24小时热销，相关专题，加入购物车。
- 购物车
  - 头部购物车：展示商品数量和列表，删除商品，跳转购物车页面。
  - 购物车页面：购物车商品展示，选择商品，修改数量，修改商品规格，价格计算，跳转下单
- 登录模块：表单校验，账户密码登录，手机号登录，第三方登录，绑定手机，完善信息
- 填写订单：订单商品展示，收货地址选择，收货地址修改，支付方式选择，生成订单。
- 进行支付：订单信息展示，跳转支付网关，提示正在支付，等待支付结果，跳转支付成功页面。
- 个人中心
  - 中心首页：展示个人信息，近期收藏商品，近期足迹，猜你喜欢
  - 订单管理：全部订单，待付款，待发货，待收货，待评价，已完成，已取消。立即付款，取消订单，确认收货，删除订单，查看物流。
  - 订单详情：订单状态，订单进度，详细信息。

## 快速部署

1. clone项目到本地`git@github.com:Willxhp/erabbit-commerce.git`

2. 进入到`erabbit-commerce`目录中，在命令行中依次输入以下命令：

   ```powershell
   # 安装依赖
   npm install
   
   # 在localhost:8080启动项目
   npm run serve
   ```

3. 项目开发完成要上线时，依然进入到`erabbit-commerce`目录中，然后执行如下命令：

   ```powershell
   npm run build
   ```

   
