<template>
  <div class="主页" id="main">
    <el-container class="home-container">
      <el-header class="home-header">

        <span class="home_title">测试系统</span>

        <div style="display: flex;align-items: center;margin-right: 7px">

          <el-badge style="margin-right: 30px" >
            <i class="fa fa-bell-o"  style="cursor: pointer"></i>
          </el-badge>

          <el-dropdown trigger="click" @command="handleCommand">
  <span class="el-dropdown-link">
    设置<i class="el-icon-caret-bottom el-icon--right"></i>
  </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item class="clearfix" command="logout">
                退出
              </el-dropdown-item >
              <el-dropdown-item command="logout" divided class="clearfix">
                修改密码
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>


      </el-header>
      <el-container>
        <el-aside width="180px" class="home-aside">
          <el-menu style="background: #ececec;width: 180px;" unique-opened router>
            <template v-for="(item,index) in this.menus" v-if="!item.hidden">
              <el-submenu :key="index" :index="index+''">
                <template slot="title">
                  <i :class="item.iconCls" style="color: #20a0ff;width: 14px;"></i>
                  <span slot="title">{{item.name}}</span>
                </template>
                <el-menu-item width="180px"
                              style="padding-left: 30px;padding-right:0px;margin-left: 0px;width: 170px;text-align: left"
                              v-for="child in item.children"
                              :index="child.path"
                              :key="child.path">{{child.name}}
                </el-menu-item>
              </el-submenu>
            </template>
          </el-menu>
        </el-aside>

        <el-container>
          <router-view></router-view>
        </el-container>
      </el-container>
    </el-container>

  </div>
</template>

<script>


export default {
  mounted(){

      this.getMenus();
  },
  data(){
    return {
      menus:[]
    }
  },
  methods :{
    getMenus(){
      this.$post('/api/menus')
        .then(res => {
          this.menus=this.formatRoutes(res);
          this.$router.addRoutes(this.menus);
         // this.menus=res
        }, function (error) {
          console.log(error)
        })
    },
    formatRoutes(val){
      let fmRoutes = [];
      val.forEach(router=> {
        let {
          path,
          component,
          name,
          meta,
          iconCls,
          children
        } = router;
        if (children && children instanceof Array) {
          children = this.formatRoutes(children);
        }

        let fmRouter = {
          path: path,
          component(resolve){
            if (component.startsWith("Home")) {
              require(['../components/' + component + '.vue'], resolve)
            } else if (component.startsWith("Sys")) {
              require(['../components/system/' + component + '.vue'], resolve)
            }
          },
          name: name,
          iconCls: iconCls,
          meta: meta,
          children: children
        };

        fmRoutes.push(fmRouter);


      });

      return fmRoutes;
    },
    handleCommand(cmd){
      var _this = this;
      if (cmd == 'logout') {
        this.$confirm('注销登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$router.replace({path: '/login'});
        }).catch(() => {
          _this.$message({
            type: 'info',
            message: '取消'
          });
        });
      }
    },logout(){
      alert('还没实现');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .home-container {
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
  }

  .home-header {
    background-color: #20a0ff;
    color: #333;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: content-box;
    padding: 0px;
  }

  .home-aside {
    background-color: #ECECEC;
  }

  .home-main {
    background-color: #fff;
    color: #000;
    text-align: center;
    margin: 0px;
    padding: 0px;;
  }

  .home_title {
    color: #fff;
    font-size: 22px;
    display: inline;
    margin-left: 8px;
  }

  .home_userinfo {
    color: #fff;
    cursor: pointer;
  }

  .home_userinfoContainer {
    display: inline;
    margin-right: 20px;
  }

  .el-submenu .el-menu-item {
    width: 180px;
    min-width: 175px;
  }
</style>
