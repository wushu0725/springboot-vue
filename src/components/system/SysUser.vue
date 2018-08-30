<template>

<div>
  <el-form :inline="true"   class="demo-form-inline">
    <el-form-item label="账号:">
    <el-input placeholder="账号" v-model="queryName"></el-input>
    </el-form-item>

    <el-button type="primary" @click="initUserList">查询</el-button>
    <el-button type="primary" @click="showAddUserView" icon="el-icon-plus">新增</el-button>
    <el-button type="primary" @click="deleteUsers" >删除</el-button>
  </el-form>
  <el-table
    :data="tableData"
    border
    :cell-style="getCellStyle"
    @selection-change="handleSelectionChange"
    style="width: 100%">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      prop="username"
      label="姓名"
      width="350">
    </el-table-column>
    <el-table-column
      prop="remark"
      label="备注"
      width="470">
    </el-table-column>
    <el-table-column
      label="状态"
      width="120">
      <template slot-scope="scope">
        {{ scope.row.enable==='0' ? '禁用' : '启用' }}
      </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="120"
      >
      <template slot-scope="scope">
        <el-button type="text" size="small" @click="showEditUser(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNumber"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalRows">
      </el-pagination>
    </div>

  <el-form :model="user" :rules="rules" ref="userForm" :label-position="labelPosition" label-width="80px">
    <div style="text-align: left">
      <el-dialog
        :title="dialogTitle"
        style="padding: 0px;"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        width="47%">
          <el-form-item label="名称" prop="username">
            <el-input v-model="user.username" ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="user.password" ></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="user.remark"></el-input>
          </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="user.enable" placeholder="请选择">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        </el-form-item>

          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cacelEdit">取 消</el-button>
            <el-button size="mini" type="primary" @click="addUser('userForm')">确 定</el-button>
          </span>
      </el-dialog>
    </div>
  </el-form>
</div>
</template>

<script>
  export default {
    methods: {
      //初始化页面
      initUserList(){
        this.$post('/api/user?pageSize='+this.pageSize+"&pageNumber="+this.pageNumber+"&username="+this.queryName)
          .then(res => {
              this.tableData=res.data.dataList;
              this.totalRows=res.data.total;
          }, function (error) {
            console.log(error)
          })
      },handleCurrentChange(val){
          this.pageNumber=val;
          this.initUserList();
      },handleSizeChange(val){
        this.pageSize=val;
        this.initUserList();
      },handleSelectionChange(val){
        this.multipleSelection = val;
        //aaa=JSON.parse(val);
      },getCellStyle(){
        return "padding:2px;";
      }, showAddUserView() {
        this.dialogTitle = "添加用户";
        this.dialogVisible = true;
        this.emptyUserData();
      },cacelEdit(){
        this.dialogVisible = false;
        this.emptyUserData();
      },emptyUserData(){
        this.user={
          username:'',
          password:'',
          remark:'',
          enable:''
        }
      },addUser(formName){
        var _this = this;
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.saveUser();
            console.log(_this.user);
          }
        });
      },saveUser(){
        if(this.user.id){
          this.$post('/api/updateUser',this.user)
            .then(res => {
              if(res.code=='200'){
                this.$confirm('修改用户成功', '提示', {
                  confirmButtonText: '确定',
                  type: 'info'
                }).then(() => {
                  this.dialogVisible = false;
                  this.initUserList();
                }).catch(() => {
                  _this.$message({
                    type: 'info',
                    message: '取消'
                  });
                });
              }
            }, function (error) {
              console.log(error)
            });
        }else{
          this.$post('/api/saveUser',this.user)
            .then(res => {
              if(res.code=='200'){
                this.$confirm('新增用户成功', '提示', {
                  confirmButtonText: '确定',
                  type: 'info'
                }).then(() => {
                  this.dialogVisible = false;
                  this.initUserList();
                }).catch(() => {
                  _this.$message({
                    type: 'info',
                    message: '取消'
                  });
                });
              }
            }, function (error) {
              console.log(error)
            })
        }


      },
      deleteUser(id){
        return this.$fetch('/api/deleteUser/'+id)
          .then(res => {
            if(res.code=='200'){
            }
          }, function (error) {
            console.log(error)
          })
      },
      deleteUsers(){
        let requestList = [];

        if(this.multipleSelection){
          this.multipleSelection.forEach(selectedItem => {
            // 删除请求
            requestList.push(this.deleteUser(selectedItem.id))
          })
        }
        //同步请求
        Promise.all(requestList)
          .then((responseList)=>{
            this.initUserList();
          })
      },showEditUser(val){
        this.user=val;
        this.dialogTitle = "编辑用户";
        this.dialogVisible = true;
      }
    },
    mounted: function () {
      this.initUserList();
    },

    data() {
      return {
        username:'',
        tableData: [],
        labelPosition:'left',
        pageSize:10,
        pageNumber:1,
        totalRows:0,
        value:'',
        queryName:'',
        options: [{
          value: '1',
          label: '启用'
        }, {
          value: '0',
          label: '禁用'
        }],
        user:{
          username:'',
          password:'',
          remark:'',
          enable:''
        },
        rules: {
          username: [{required: true, message: '必填:姓名', trigger: 'blur'}],
          password: [{required: true, message: '必填:密码', trigger: 'blur'}]
        },
        dialogTitle:'',
      dialogVisible: false,
        multipleSelection:{}

      }
    }
  }
</script>
<style scoped>

</style>
