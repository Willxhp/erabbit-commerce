<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="isMsgLogin=false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="isMsgLogin=true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <!-- validation-schema属性用于指定表单校验规则对象，通过作用域插槽可以获取校验错误信息 -->
    <Form class="form" :validation-schema="schema" v-slot="{errors}" autocomplete="off" ref="formEl">
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field type="text" name="account" placeholder="请输入用户名" v-model="form.account" :class="{error: errors.account}" />
          </div>
          <div class="error" v-if="errors.account">
            <i class="iconfont icon-warning" />{{errors.account}}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field type="password" name="password" placeholder="请输入密码" v-model="form.password" :class="{error: errors.password}" />
          </div>
          <div class="error" v-if="errors.password">
            <i class="iconfont icon-warning" />{{errors.password}}
          </div>
        </div>
      </template>
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field type="text" name="mobile" placeholder="请输入手机号" v-model="form.mobile" :class="{error: errors.mobile}" />
          </div>
          <div class="error" v-if="errors.mobile">
            <i class="iconfont icon-warning" />{{errors.mobile}}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field type="text" name="code" placeholder="请输入验证码" v-model="form.code" :class="{error: errors.code}" />
            <span class="code" @click="send">{{time === 0 ? '发送验证码' : `${time}秒后重发`}}</span>
          </div>
          <div class="error" v-if="errors.code">
            <i class="iconfont icon-warning" />{{errors.code}}
          </div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <Field as="XtxCheckbox" name="isAgree" v-model="form.isAgree" />
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
        <div class="error" v-if="errors.isAgree">
          <i class="iconfont icon-warning" />{{errors.isAgree}}
        </div>
      </div>
      <a href="javascript:;" class="btn" @click="login">登录</a>
    </Form>
    <div class="action">
      <!-- <span id="qqLoginBtn"></span> -->
      <a href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback">
        <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="">
      </a>
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <router-link to="/register">免费注册</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginForm'
}
</script>

<script setup>
import { reactive, ref, watch, onMounted } from 'vue'
import { Field, Form } from 'vee-validate'
import schemaFn from '@/utils/vee-validate-schema'
import Message from '@/components/library/Message'
import { userAccountLogin, getMobileLoginCode, userMobileLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useIntervalFn } from '@vueuse/core'
import { useCode } from '@/hooks'
// import QC from 'qc'

const store = useStore()
const router = useRouter()

// 表单组件实例
const formEl = ref(null)
// 当前是否使用用户名密码登录
const isMsgLogin = ref(false)
// 表单信息对象
const form = reactive({
  isAgree: true,
  account: null,
  password: null,
  mobile: null,
  code: null
})
// 表单校验规则，每个字段的校验规则对应一个函数，单独封装在'@/utils/vee-validate-schema.js'文件中
const schema = {
  isAgree: schemaFn.isAgree,
  account: schemaFn.account,
  password: schemaFn.password,
  mobile: schemaFn.mobile,
  code: schemaFn.code
}
// 当用户切换登录方式时，重置表单内容信息
watch(isMsgLogin, () => {
  form.isAgree = true
  form.account = null
  form.password = null
  form.mobile = null
  form.code = null
  // 清除校验效果，当在校验提示信息DOM上使用v-show时有效，使用v-if不需要
  formEl.value.resetForm()
})

// 登录按钮
const login = async () => {
  // Form组件提供了一个validate函数作为整体的表单校验，返回的是一个Promise
  const valid = await formEl.value.validate()
  // 通过表单校验后发请求
  if (valid) {
    if (!isMsgLogin.value) {
      // 用户使用用户名密码登录
      userAccountLogin({ account: form.account, password: form.password }).then(data => {
        const { account, id, avatar, mobile, nickname, token } = data.result
        // 用户信息存储至vuex中
        store.commit('user/setUser', { account, id, avatar, mobile, nickname, token })
        // 登录成功后清空本地购物车列表
        store.dispatch('cart/mergeCart').then(() => {
          // 提示登录成功
          Message({ type: 'success', text: '登录成功' })
          // 登录成功后跳转至来源页面或首页
          router.push(store.state.user.redirectUrl)
        })
      }, error => {
        // 登录失败
        Message({ type: 'error', text: error.response.data.message || '登录失败' })
      })
    } else {
      // 使用短信登录
      userMobileLogin({ mobile: form.mobile, code: form.code }).then(data => {
        const { account, id, avatar, mobile, nickname, token } = data.result
        // 用户信息存储至vuex中
        store.commit('user/setUser', { account, id, avatar, mobile, nickname, token })
        Message({ type: 'success', text: '登录成功' })
        // 登录成功后跳转至来源页面或首页
        router.push(store.state.user.redirectUrl)
      }, error => {
        // 登录失败
        Message({ type: 'error', text: error.response.data.message || '登录失败' })
      })
    }
  }
}

// 将发送验证码我的逻辑封装成一个hooks
const { send, time } = useCode(schema, form, formEl, getMobileLoginCode)
// // 发送验证码60s后才可以重新发送
// const time = ref(0)
// // 使用@vueuse/core提供的useIntervalFn来实现time每隔1s自动减1
// // pause和resume是两个函数，分别用于关闭和开启定时器
// // useIntervalFn接收三个参数，回调函数，时间间隔和配置对象
// const { pause, resume } = useIntervalFn(() => {
//   time.value--
//   if (time.value <= 0) pause()
// }, 1000, {
//   immediate: false // 定时器不会立即开启，必须调用resume方法才会开启
// })

// // 发送验证码
// const send = () => {
//   // 对mobile表单项进行单独校验
//   const valid = schema.mobile(form.mobile)
//   if (valid === true) {
//     // 手机号格式正确，发送请求获取短信验证码，同时开启定时器
//     if (time.value === 0) {
//       getMobileLoginCode(form.mobile)
//       Message({ type: 'success', text: '验证码发送成功' })
//       time.value = 60
//       pause() // 先关闭定时器再开启定时器，以防重复开启定时器
//       resume()
//     }
//   } else {
//     // 手机号格式错误
//     formEl.value.setFieldError('mobile', valid)
//   }
// }

// onMounted(() => {
//   // 组件渲染完成后，使用QC生成QQ登录按钮
//   QC.Login({
//     btnId: 'qqLoginBtn'
//   })
// })
</script>

<style lang="less" scoped>
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,
          &:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>