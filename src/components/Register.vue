<template>
  <div class="login-wrap">
    <el-form class="login-container">
      <h1 class="title">用户注册</h1>
      <el-form-item>
        <el-input
          type="text"
          placeholder="用户账号"
          v-model="username"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          type="password"
          placeholder="用户密码"
          v-model="password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          type="text"
          placeholder="邮箱"
          v-model="email"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="doRegister" style="width: 100%"
          >注册</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
 
<script>
export default {
  name: "Res_",
  data: function () {
    return {
      username: "",
      password: "",
      email: "",
    };
  },
  methods: {
    doRegister: function () {
      let params = {
        username: this.username,
        password: this.password,
        email: this.email,
      };
      this.Bmob.User.register(params)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    toLogin: function () {
      this.$router.push("/");
    },
  },
};
</script>
 
<style>
</style>
 