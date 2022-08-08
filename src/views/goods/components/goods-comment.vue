<template>
  <!-- 商品评价组件 -->
  <div class="goods-comment">
    <div class="head" v-if="commentInfo">
      <div class="data">
        <p>
          <span>{{ commentInfo.salesCount }}</span
          ><span>人购买</span>
        </p>
        <p>
          <span>{{ commentInfo.praisePercent }}</span
          ><span>好评率</span>
        </p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a
            href="javascript:;"
            :class="{ active: currTagIndex === i }"
            @click="changeTag(i)"
            v-for="(tag, i) in commentInfo.tags"
            :key="tag.title"
            >{{ tag.title }}（{{ tag.tagCount }}）</a
          >
        </div>
      </div>
    </div>
    <div class="sort">
      <span>排序：</span>
      <a
        href="javascript:;"
        :class="{ active: reqParams.sortField === null }"
        @click="changeSort(null)"
        >默认</a
      >
      <a
        href="javascript:;"
        :class="{ active: reqParams.sortField === 'createTime' }"
        @click="changeSort('createTime')"
        >最新</a
      >
      <a
        href="javascript:;"
        :class="{ active: reqParams.sortField === 'praiseCount' }"
        @click="changeSort('praiseCount')"
        >最热</a
      >
    </div>
    <!-- 列表 -->
    <div class="list">
      <div class="item" v-for="item in commentList.items" :key="item.id">
        <div class="user">
          <img :src="item.member.avatar" alt="" />
          <span>{{ formatNickname(item.member.nickname) }}</span>
        </div>
        <div class="body">
          <div class="score">
            <i
              class="iconfont icon-wjx01"
              v-for="i in item.score"
              :key="i + 's'"
            ></i>
            <i
              class="iconfont icon-wjx02"
              v-for="i in 5 - item.score"
              :key="i + 'k'"
            ></i>
            <span class="attr">{{ formatSpecs(item.orderInfo.specs) }}</span>
          </div>
          <div class="text">
            {{ item.content }}
          </div>
          <div class="time">
            <span>{{ item.orderInfo.createTime }}</span>
            <span class="zan"
              ><i class="iconfont icon-dianzan"></i>{{ item.praiseCount }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GoodsComment',
}
</script>

<script setup>
import { inject, ref, reactive, watch } from 'vue'
import { findGoodsCommentInfo, findGoodsCommentList } from '@/api/product'
const goods = inject('goods')

// 获取商品评论的头部信息
const commentInfo = ref(null)
findGoodsCommentInfo(goods.value.id).then((data) => {
  data.result.tags.unshift({
    title: '有图',
    tagCount: data.result.hasPictureCount,
    type: 'img',
  })
  data.result.tags.unshift({
    title: '全部评价',
    tagCount: data.result.evaluateCount,
    type: 'all',
  })
  commentInfo.value = data.result
})

// 改变tag标签的激活状态
const currTagIndex = ref(0)
const changeTag = (i) => {
  currTagIndex.value = i
  const currTag = commentInfo.value.tags[i]
  // 单独判断全部评价和有图两种情况
  if (currTag.type === 'all') {
    reqParams.hasPicture = null
    reqParams.tag = null
  } else if (currTag.type === 'img') {
    reqParams.hasPicture = true
    reqParams.tag = null
  } else {
    reqParams.hasPicture = null
    reqParams.tag = currTag.title
  }
  // 每次点击将页码重置为1
  reqParams.page = 1
}

// 定义筛选条件
const reqParams = reactive({
  page: 1,
  pageSize: 10,
  hasPicture: null,
  tag: null,
  sortField: null, // 排序字段，可选值范围[praiseCount, createTime]
})

// 改变sort标签的激活状态
const changeSort = (type) => {
  reqParams.sortField = type
  // 每次点击将页码重置为1
  reqParams.page = 1
}

// 获取商品评价列表数据
const commentList = ref([])
// 监听请求参数对象的变化，每次请求参数对象属性变化后重新发送请求获取数据
watch(
  reqParams,
  () => {
    findGoodsCommentList(goods.value.id, reqParams).then((data) => {
      console.log(data.result)
      commentList.value = data.result
    })
  },
  { immediate: true }
)

// 格式化商品信息
const formatSpecs = (specs) => {
  return specs.reduce((p, c) => `${p} ${c.name}：${c.nameValue}`, '').trim()
}
// 用户昵称匿名处理
const formatNickname = (nickname) => {
  return nickname.substring(0, 1) + '****' + nickname.substr(-1)
}
</script>

<style lang="less" scoped>
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;
    .data {
      width: 340px;
      display: flex;
      padding: 20px;
      p {
        flex: 1;
        text-align: center;
        span {
          display: block;
          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }
          &:last-child {
            color: #999;
          }
        }
      }
    }
    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;
      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }
      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        > a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;
          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor, 50%);
            color: @xtxColor;
          }
          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }
  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;
    > span {
      margin-left: 20px;
    }
    > a {
      margin-left: 30px;
      &.active,
      &:hover {
        color: @xtxColor;
      }
    }
  }
  .list {
    padding: 0 20px;
    .item {
      display: flex;
      padding: 25px 10px;
      border-bottom: 1px solid #f5f5f5;
      .user {
        width: 160px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }
        span {
          padding-left: 10px;
          color: #666;
        }
      }
      .body {
        flex: 1;
        .score {
          line-height: 40px;
          .iconfont {
            color: #ff9240;
            padding-right: 3px;
          }
          .attr {
            padding-left: 10px;
            color: #666;
          }
        }
      }
      .text {
        color: #666;
        line-height: 24px;
      }
      .time {
        color: #999;
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
      }
    }
  }
}
</style>
