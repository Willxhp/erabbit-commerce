<template>
  <Form class="xtx-form" ref="formEl" :validation-schema="schema" autocomplete="off" v-slot="{errors}">
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field :class="{err: errors.account}" class="input" type="text" placeholder="请输入用户名" name="account" v-model="form.account" />
      </div>
      <div class="error" v-if="errors.account">{{errors.account}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field :class="{err: errors.mobile}" class="input" type="text" placeholder="请输入手机号" name="mobile" v-model="form.mobile" />
      </div>
      <div class="error" v-if="errors.mobile">{{errors.mobile}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field :class="{err: errors.code}" class="input" type="text" placeholder="请输入验证码" name="code" v-model="form.code" />
        <span class="code" @click="send">{{time === 0 ? '发送验证码' : `${time}秒后重发`}}</span>
      </div>
      <div class="error" v-if="errors.code">{{errors.code}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field :class="{err: errors.password}" class="input" type="password" placeholder="请输入密码" name="password" v-model="form.password" />
      </div>
      <div class="error" v-if="errors.password">{{errors.password}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field :class="{err: errors.rePassword}" class="input" type="password" placeholder="请确认密码" name="rePassword" v-model="form.rePassword" />
      </div>
      <div class="error" v-if="errors.rePassword">{{errors.rePassword}}</div>
    </div>
    <a href="javascript:;" class="submit" @click="submit">立即提交</a>
  </Form>
</template>

<script>
export default {
  name: 'CallbackPatch'
}
</script>

<script setup>
// 3. 未注册未绑定的情况
import { Field, Form } from 'vee-validate'
import { reactive, ref } from 'vue'
import schemaFn from '@/utils/vee-validate-schema'
import { useCode } from '@/hooks'
import {getRegisterCode, patchQQLogin} from '@/api/user'
import Message from '@/components/library/Message'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'

const store = useStore()
const router = useRouter()
const props = defineProps({
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
  mobile: null,
  code: null,
  password: null,
  rePassword: null
})
// 表单校验规则
const schema = {
  account: schemaFn.accountApi,
  mobile: schemaFn.mobile,
  code: schemaFn.code,
  password: schemaFn.password,
  rePassword: schemaFn.rePassword
}

const {time, send} = useCode(schema, form, formEl, getRegisterCode)

// 表单提交
const submit = async () => {
  // 表单校验
  const valid = await formEl.value.validate()
  if (valid) {
    patchQQLogin({unionId: props.unionId, ...form}).then(data => {
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
