<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登陆">
      <i class="toutiao toutiao-yanzhengma" slot="left-icon"></i>
    </van-nav-bar>
    <!-- 导航栏 -->
    <!-- 登录表单 -->
    <van-form ref="loginFrom" @submit="onSubmit">
      <van-field
        name="mobile"
        placeholder="请输入手机号"
        type="number"
        maxlength="11"
        left-icon="smile-o"
        v-model="user.mobile"
        :rules="userFormRules.mobile"
      >
        <i class="toutiao toutiao-shouji" slot="left-icon"></i>
      </van-field>
      <van-field
        class=""
        name="code"
        placeholder="请输入验证码"
        maxlength="6"
        v-model="user.code"
        :rules="userFormRules.code"
      >
        <i class="toutiao toutiao-yanzhengma" slot="left-icon"></i>
        <template #button>
          <!-- time是总时间 -->
          <van-count-down
            :time="1000 * 10"
            format="ss s"
            v-if="isCountDownShow"
            @finish="isCountDownShow = false"
          />
          <van-button
            round
            size="small"
            native-type="button"
            type="default"
            class="send-sms-btn"
            v-else
            @click="onSeedYzm"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button
          class="login-btn"
          block
          type="info"
          native-type="submit"
          left-icon="smile-o"
          >登录</van-button
        >
      </div>
    </van-form>
    <!-- 登录表单 -->
  </div>
</template>

<script>
import { login, sendYzm } from '@/api/user'

export default {
  name: 'loginIndex',
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      userFormRules: {
        mobile: [
          {
            required: true,
            message: '手机号不能为空'
          },
          {
            pattern: /^1[3|5|7|8]\d{9}$/,
            message: '手机号格式错误'
          }
        ],
        code: [
          {
            required: true,
            message: '验证码不能为空'
          },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式错误'
          }
        ]
      },
      // 控制倒计时隐藏显示
      isCountDownShow: false
    }
  },
  methods: {
    async onSubmit () {
      // 1获取表单数据
      const user = this.user
      // 2表单验证

      // 对组件的调用使用this.$
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, // 是否禁止背景点击
        duration: 0 // 持续时间，0表示持续展示不停止
      })
      // 3点击提交按钮，发出请求
      // 3-1成功
      try {
        const { data } = await login(user) // {data} =res.data
        this.$store.commit('setUser', data.data)
        // console.log(res);
        this.$toast.success('登录成功')
      } catch (err) {
        console.log(err)
        // 3-2失败
        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误', err)
        } else {
          this.$toast.fail('登录失败')
        }
      }
    },
    async onSeedYzm () {
      // 1校验手机号
      try {
        await this.$refs.loginFrom.validate('mobile')
      } catch (err) {
        return console.log('验证失败')
      }

      // 2校验成功，开启倒计时
      this.isCountDownShow = true
      // 3发起请求注册接口
      try {
        await sendYzm(this.user.mobile)
        this.$toast.success('发送成功')
      } catch (err) {
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast.fail('发送太频繁，请稍后重试')
        } else {
          this.$toast.fail('发送失败')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 180px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 16px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>>
