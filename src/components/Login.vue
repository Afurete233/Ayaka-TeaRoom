<template>
  <div class="login-wrap">
    <el-form class="login-container" v-if="!islogin">
      <h1 class="title">用户登录</h1>
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
        <el-button type="primary" @click="doLogin" style="width: 100%"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
    <el-row v-if="islogin" style="margin-top: 10px">
      <input type="file" id="profilePhotoFileUpload" multiple="multiple" />
      <el-button type="primary" icon="el-icon-refresh-right" @click="updata">
        同步</el-button
      >
    </el-row>
  </div>
</template>
 
<script>
export default {
  name: "Login_",
  data: function () {
    return {
      islogin: this.Cookies.get() != null ? true : false,
      username: "",
      password: "",
    };
  },
  methods: {
    doLogin: function () {
      let username = this.username;
      let password = this.password;
      /* let params={
        } */
      this.Bmob.User.login(username, password)
        .then((res) => {
          console.log(res);
          this.islogin = true;
          this.Cookies.set(username, res, { expires: 30 });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    updata() {
        
},
  },
};
</script>
 
<style>
.login-wrap {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  /* background-color: #112346; */
  background-repeat: no-repeat;
  background-position: center right;
  background-size: 100%;
}

.login-container {
  border-radius: 10px;
  padding: 30px 35px 15px 35px;
  background: #fff;
}

.title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}
</style>
 
