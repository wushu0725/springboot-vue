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


export default {
  data () {
    return {
      heards:'',
      user:{
        username:'ws',
        password:'123456'
      }
    }
  },
  methods :{
    submitForm:function(){

      localStorage.setItem('login','0');
      this.$post('/login',{
        username: this.user.username,
        password: this.user.password
      })
        .then(res => {

            if(res.code==200){
                localStorage.setItem('token',JSON.stringify(res.data));
                //取：var mydata = JSON.parse(localStorage.mydata)
                this.$router.push({ name: 'Home'});
                //this.heards=res.data;
            }
        }, function (error) {
          console.log(error)
        })

    },

    getCity(){
//      this.$post('/api/menus')
//        .then(res => {
//          if(res.status){
//            console.log(res)
//          }
//        }, function (error) {
//          console.log(error)
//        })
      axios.post(
        '/api/menus',
        qs.stringify(data),
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
      ).then(result => {
        // do something
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
