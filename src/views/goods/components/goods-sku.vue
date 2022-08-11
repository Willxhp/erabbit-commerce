<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.id">
          <img
            :class="{ selected: val.selected, disabled: val.disabled }"
            @click="changeSku(item, val)"
            v-if="val.picture"
            :src="val.picture"
            :title="val.name"
          />
          <span
            :class="{ selected: val.selected, disabled: val.disabled }"
            @click="changeSku(item, val)"
            v-else
            >{{ val.name }}</span
          >
        </template>
      </dd>
    </dl>
  </div>
</template>

<script>
export default {
  name: 'GoodsSku',
}
</script>

<script setup>
import getPowerSet from '@/vender/power-set'
const props = defineProps({
  goods: {
    type: Object,
    default: () => ({}),
  },
  skuId: {
    type: String,
    default: 's',
  },
})
const emit = defineEmits(['change'])
// 一、实现按钮的选中效果 规格信息保存在props.goods.specs中
// 点击按钮切换选中状态
const changeSku = (item, val) => {
  // 如果规格处于禁用状态，则直接return
  if (val.disabled) return
  // 点击按钮后，给当前项添加selected属性
  // 同属于一个属性item的两个规格val不能同时被选中
  if (val.selected) {
    // 点击时如果该规格已经被选中，将其selected设置为false即可
    val.selected = false
  } else {
    // 如果按钮未被选中，需要先遍历当前规格val所在属性item，将其中的所有规格val的selected都设置为false
    item.values.forEach((value) => {
      value.selected = false
    })
    // 将所点击规格的selected设置为true
    val.selected = true
  }
  // 点击规格时更新规格的禁用状态
  updateDisabledStatus(props.goods.specs, pathMap)

  // 触发change事件，向父组件传递当前选中的规格信息
  // 获取当前已经选中规格的有效集合，即排除集合中的undefined项
  const validSelectedArr = getSelectedArr(props.goods.specs).filter((v) => v)
  if (validSelectedArr.length === props.goods.specs.length) {
    // 当所有属性都有规格被选中时，才传递完整的sku信息对象
    // 从路径字典中查找当前规格集合对应sku的id信息
    const skuId = pathMap[validSelectedArr.join(spliter)][0]
    const sku = props.goods.skus.find((sku) => sku.id === skuId)
    const { id, price, oldPrice, inventory, specs } = sku
    emit('change', {
      skuId,
      price,
      oldPrice,
      inventory,
      specsText: specs
        .reduce((p, c) => `${p} ${c.name}：${c.valueName}`, '')
        .trim(),
    })
  } else {
    // 如果选择的规格不完整，传递空对象
    emit('change', {})
  }
}
// 二、实现按钮的禁用效果（项目难点） sku信息保存在props.goods.skus中
// 不同的产品规格可以组合成多个sku组合，每种sku的库存信息通过后台返回，sku组合就是规格的笛卡尔积
// 判断库存是否大于0，从而筛选出当前有效的sku组合
// 得到每个sku组合的子集或幂集，如['蓝色', '中国']的幂集是[[], ['蓝色'], ['中国'], ['蓝色', '中国']]
// 根据子集集合组合成一个路径字典，也就是对象
// 在组件初始化的时候判断规格是否可选，在选择规格的时候判断其他规格是否可选

// (1) 获取路径字典
const spliter = '★'
const getPathMap = (skus) => {
  const pathMap = {}
  skus.forEach((sku) => {
    // 1. 过滤出有库存有效的sku
    if (sku.inventory) {
      // 2. 得到sku属性值数组，如['蓝色', '中国']
      const specs = sku.specs.map((spec) => spec.valueName)
      // 3. 得到每个sku属性值数组的子集，如[[], ['蓝色'], ['中国'], ['蓝色', '中国']]
      // getPowerSet函数是第三方js算法库提供的幂集算法函数，文件下载后保存在vender文件夹中，利用该函数可以获得一个数组的子集
      // js算法库 https://github.com/trekhleb/javascript-algorithms
      const powerSet = getPowerSet(specs)
      // 4. 遍历子集，添加到路径字典中，key为子集对应的字符串，value为sku的id值
      powerSet.forEach((set) => {
        const key = set.join(spliter)
        if (pathMap[key]) {
          pathMap[key].push(sku.id)
        } else {
          pathMap[key] = [sku.id]
        }
      })
    }
  })
  return pathMap
}
const pathMap = getPathMap(props.goods.skus)

// (2) 设置禁用状态
// 在组件初始化和点击规格的时候，更新其他按钮的禁用状态
// 1. 得到当前选中规格的集合
const getSelectedArr = (specs) => {
  const selectedArr = []
  // 对所有属性进行遍历
  specs.forEach((spec) => {
    // 将已选中的规格放入数组中
    const selectedVal = spec.values.find((val) => val.selected)
    selectedArr.push(selectedVal ? selectedVal.name : undefined)
  })
  return selectedArr
}

// 2. 更新规格状态的方法
const updateDisabledStatus = (specs, pathMap) => {
  // 判断每个规格是否禁用的逻辑:
  // 1. 如果当前规格已经被选中，则不会被禁用，直接跳过判断逻辑
  // 2. 如果当前规格未被选中，就尝试把当前规格插入到选中规格的集合中，(替换位置，不改变数组原先的顺序)
  // 3. 将选中规格集合排除掉undefined项之后，判断是否在路径字典的key中
  // 4. 如果存在，则该规格不被禁用，若不存在，则禁用
  // 获取当前已经选中的规格集合
  specs.forEach((spec, i) => {
    // 每一个属性单独创建一个数组保存信息，从而不会影响到其他属性
    const selectedArr = getSelectedArr(specs)
    spec.values.forEach((val) => {
      // 对每个规格进行遍历，如果已经被选中，则不用判断
      if (val.selected) return
      // 将当前规格插入到选中规格的集合中
      selectedArr[i] = val.name
      // 将选中规格集合中的undefined项过滤掉
      const key = selectedArr.filter((item) => item).join(spliter)
      val.disabled = !pathMap[key]
    })
  })
}

// 三、根据父组件传入的skuId，初始化规格的选中状态，
const initSelectedStatus = (goods, skuId) => {
  // 根据skuId从商品信息中筛选出对应的sku信息
  const sku = goods.skus.find((sku) => sku.id === skuId)
  if (sku) {
    // 遍历商品属性
    goods.specs.forEach((spec, i) => {
      const value = sku.specs[i].valueName
      // 将每种属性中与sku信息相符合的规格设置为selected
      const val = spec.values.find((val) => val.name === value)
      val.selected = true
    })
  }
}
// 组件初始化时调用initSelectedStatus
initSelectedStatus(props.goods, props.skuId)
// 组件初始化时调用updateDisabledStatus
updateDisabledStatus(props.goods.specs, pathMap)
</script>

<style lang="less" scoped>
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin: 0 10px 5px 0;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
