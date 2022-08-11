<template>
  <LoginHeader>用户注册</LoginHeader>
  <section class="container">
    <nav class="tab">
      <a>
        <i class="iconfont icon-edit" />
        <span>请填写用户基本信息</span>
      </a>
    </nav>
    <Form ref="formEl" class="xtx-form" :validation-schema="schema" autocomplete="off" v-slot="{errors}">
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
      <a href="javascript:;" class="submit" @click="register">立即注册</a>
    </Form>
  </section>
  <LoginFooter></LoginFooter>
</template>

<script>
export default {
  name: 'Register'
}
</script>

<script setup>
import LoginHeader from './components/login-header'
import LoginFooter from './components/login-footer'
import { Field, Form } from 'vee-validate'
import {reactive, ref} from 'vue'
import schemaFn from '@/utils/vee-validate-schema'
import {useCode} from '@/hooks'
import {userRegister, getRegisterCode} from '@/api/user'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import Message from '@/components/library/Message'

const store = useStore()
const router = useRouter()
const formEl = ref(null)
const form = reactive({
  account: null,
  mobile: null,
  password: null,
  rePassword: null,
  code: null
})

const schema = {
  account: schemaFn.accountApi,
  mobile: schemaFn.mobile,
  password: schemaFn.password,
  rePassword: schemaFn.rePassword,
  code: schemaFn.code
}

const {time, send} = useCode(schema, form, formEl, getRegisterCode)

// 注册点击事件
const register = async () => {
  // 表单校验
  const valid = await formEl.value.validate()
  if (valid) {
    userRegister({...form}).then(data => {
      const { account, id, avatar, mobile, nickname, token } = data.result
      // 用户信息存储至vuex中
      store.commit('user/setUser', { account, id, avatar, mobile, nickname, token })
      Message({ type: 'success', text: '注册成功' })
      // 登录成功后跳转至来源页面或首页
      router.push(store.state.user.redirectUrl)
    }, error => {
      // 登录失败
      Message({ type: 'error', text: error.response.data.message || '注册失败' })
    })
  }
}
</script>

<style lang="less" scoped>
.container {
  padding: 25px 0;
  position: relative;
  background: #fff;
  margin: 10px auto;
}
.tab {
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
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