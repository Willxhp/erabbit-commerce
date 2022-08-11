<template>
  <Form class="xtx-form" ref="formEl" :validation-schema="schema" v-slot="{errors}" autocomplete="off">
    <div class="user-info">
      <img :src="avatar" alt="" />
      <p>Hi，{{nickname}} 欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field class="input" :class="{err: errors.mobile}" type="text" placeholder="绑定的手机号" name="mobile" v-model="form.mobile" />
      </div>
      <div class="error" v-if="errors.mobile">{{errors.mobile}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field class="input" :class="{err: errors.code}" type="text" placeholder="短信验证码" name="code" v-model="form.code" />
        <span class="code" @click="send">{{time === 0 ? '发送验证码' : `${time}秒后重发`}}</span>
      </div>
      <div class="error" v-if="errors.code">{{errors.code}}</div>
    </div>
    <a href="javascript:;" class="submit" @click="submit">立即绑定</a>
  </Form>
</template>

<script>
export default {
  name: 'CallbackBind'
}
</script>

<script setup>
import { Field, Form } from 'vee-validate'
import { reactive, ref } from 'vue'
import schemaFn from '@/utils/vee-validate-schema'
import { useCode } from '@/hooks'
import { getQQLoginCode, bindQQLogin } from '@/api/user'
import Message from '@/components/library/Message'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'

const store = useStore()
const router = useRouter()
// 2. 已注册未绑定情况
const props = defineProps({
  nickname: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  unionId: {
    type: String,
    default: ''
  }
})
// 表单ref对象
const formEl = ref(null)
// 表单信息对象
const form = reactive({
  account: null,
  code: null
})
// 表单校验规则
const schema = {
  mobile: schemaFn.mobile,
  code: schemaFn.code
}
// 发送短信验证码
const { time, send } = useCode(schema, form, formEl, getQQLoginCode)
// 绑定账号
const submit = async () => {
  // 表单校验
  const valid = await formEl.value.validate()
  if (valid) {
    bindQQLogin({unionId: props.unionId, mobile: form.mobile, code: form.code}).then(data => {
      const { account, id, avatar, mobile, nickname, token } = data.result
      // 用户信息存储至vuex中
      store.commit('user/setUser', { account, id, avatar, mobile, nickname, token })
      Message({ type: 'success', text: '绑定成功' })
      // 登录成功后跳转至来源页面或首页
      router.push(store.state.user.redirectUrl)
    }, error => {
      // 登录失败
      Message({ type: 'error', text: error.response.data.message || '绑定失败' })
    })
  }
}
</script>

<style scoped lang='less'>
.user-info {
  width: 320px;
  height: 70px;
  margin: 0 auto;
  display: flex;
  background: #f2f2f2;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 25px;
  img {
    background: #f2f2f2;
    width: 50px;
    height: 50px;
  }
  p {
    padding-left: 10px;
  }
}
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>