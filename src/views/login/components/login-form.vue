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
            <Field type="text" name="account" placeholder="请输入用户名" v-model="form.account" />
          </div>
          <div class="error" v-if="errors.account">
            <i class="iconfont icon-warning" />{{errors.account}}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field type="password" name="password" placeholder="请输入密码" v-model="form.password" />
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
            <Field type="text" name="mobile" placeholder="请输入手机号" v-model="form.mobile" />
          </div>
          <div class="error" v-if="errors.mobile">
            <i class="iconfont icon-warning" />{{errors.mobile}}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field type="text" name="code" placeholder="请输入验证码" v-model="form.code" />
            <span class="code">发送验证码</span>
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
      <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="">
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
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
import { reactive, ref, watch } from 'vue'
import { Field, Form } from 'vee-validate'
import schemaFn from '@/utils/vee-validate-schema'
import Message from '@/components/library/Message'

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
  console.log(valid)
  Message({type: 'success', text: '请输入密码'})
}
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
    img {
      cursor: pointer;
    }
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>