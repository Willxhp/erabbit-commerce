<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggle" :class="{active: visible}">
      <span class="placeholder" v-if="!fullLocation">请选择配送地址</span>
      <span class="value">{{fullLocation}}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="visible" >
      <div class="loading" v-if="loading"></div>
      <template v-else>
        <span class="ellipsis" v-for="item in cityList" :key="item.code" @click="changeItem(item)">{{item.name}}</span>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'XtxCity'
}
</script>

<script setup>
import { ref, computed, reactive } from 'vue'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
const props = defineProps({
  fullLocation: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['change'])
const visible = ref(false)
// 用于展示加载图片
const loading = ref(false)
const cityData = ref([])

// 获取地址数据方法
const getCityData = () => {
  // 由于地址数据较多，数据返回较慢，将数据缓存到内存中可以提高加载速度
  // 由于获取数据既可能是从内存中获取，也可能是发送请求后获得数据，为了让方法在同步或异步操作下都可以返回数据
  // 所以将方法的返回结果包装成Promise对象
  return new Promise((resolve, reject) => {
    if (window.cityData) {
      // 有缓存时直接获取数据
      resolve(window.cityData)
    } else {
      const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
      axios.get(url).then(({ data }) => {
        // 缓存优化，将返回的数据存储在浏览器内存中
        window.cityData = data
        resolve(data)
      })
    }
  })
}

// 记录目前城市地区的选择结果
const changeResult = reactive({
  provinceCode: '',
  provinceName: '',
  cityCode: '',
  cityName: '',
  countyCode: '',
  countyName: '',
  fullLocation: ''
})

// 城市组件中当前展示的列表数据，由于返回的城市列表数据中有省市区三层结构，不能将其全部展示在页面上
const cityList = computed(() => {
  let list = cityData.value
  if (changeResult.provinceCode && changeResult.provinceName) {
    list = list.find(item => item.code === changeResult.provinceCode).areaList
  }
  if (changeResult.cityCode && changeResult.cityName) {
    list = list.find(item => item.code === changeResult.cityCode).areaList
  }
  return list
})

// 省市区列表的点击事件
const changeItem = (item) => {
  if (item.level === 0) {
    // 省级
    changeResult.provinceCode = item.code
    changeResult.provinceName = item.name
  } else if (item.level === 1) {
    // 市级
    changeResult.cityCode = item.code
    changeResult.cityName = item.name
  } else if (item.level === 2) {
    changeResult.countyCode = item.code
    changeResult.countyName = item.name
    changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`
    // 将完整地址传递给父组件
    emit('change', changeResult)
    close()
  }
}

// 显示城市选择框
const open = () => {
  visible.value = true
  loading.value = true
  getCityData().then(data => {
    loading.value = false
    cityData.value = data
  })
}
// 关闭城市选择框
const close = () => {
  visible.value = false
  // 关闭选择框后，将选择的信息清空
  for (let key in changeResult) {
    changeResult[key] = ''
  }
}
// 切换城市选择框
const toggle = () => {
  visible.value ? close() : open()
}
// 点击城市选择框外面的区域将选择框关闭，利用@vueuse/core库提供的onClickOutside函数判断点击区域是否在目标元素之外
const target = ref(null)
onClickOutside(target, () => {
  close()
})
</script>

<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
    // 省略图片
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>