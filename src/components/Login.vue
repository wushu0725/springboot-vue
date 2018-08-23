<template>
  <div class="登陆" id="login">
    <img src="../assets/logo.png"></img>

    <el-form :model="user"  ref="user" label-width="100px" class="demo-ruleForm">
      <center>
      <el-form-item label="用户名：" style="width: 400px" >
        <el-input type="test" v-model="user.username" style="width: 200px" placeholder="请输入用户名" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码：" style="width: 400px" >
        <el-input type="password" v-model="user.password" style="width: 200px"  placeholder="请输入密码" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">登陆</el-button>
        <el-button @click="getCity()">重置</el-button>
      </el-form-item>
      </center>
    </el-form>
  </div>
</template>

<script>
  import axios from 'axios'


  const  params = new URLSearchParams();

export default {
  data () {
    return {
      user:{
        username:'32323',
        password:''
      }
    }
  },
  methods :{
    submitForm:function(){

      params.set('username', this.user.username);
      params.set('password', this.user.password);


      axios.post('http://127.0.0.1:8080/login',params,{'xhrFields' : {withCredentials: true},crossDomain: true})
        .then(res => {
          if(res.status){
            if(res.status==200){
              //this.$router.push({ name: 'Home'})
              var datas = res.data;
              if(datas.status=='success'){

              }{
                alert(datas.msg);
              }
            }
          }
        }, function (error) {
          console.log(error)
        })

    },

    getCity(){
      axios.post('/api/user',{},{'xhrFields' : {withCredentials: true},crossDomain: true})
        .then(res => {
          if(res.status){
            console.log(res)
          }
        }, function (error) {
          console.log(error)
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
</style>
