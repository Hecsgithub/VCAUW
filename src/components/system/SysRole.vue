<template>
  <section>
    <!--       这是菜单管理页面-->
    <div class="table"> <!-- 页面表格begin -->
      <div class="container"><!-- 页面内容区begin -->
        <div class="handle-box"> <!-- 搜索区begin -->
          <!--工具条-->
          <el-row :gutter="20">
            <el-col :span="12" class="toolbar" style="padding-bottom: 0px;">
              <el-form :inline="true" :model="filters">
                <el-form-item>
                  角色名：
                  <el-input v-model="filters.name" placeholder="角色名" style="width:150px; heght:30px;"
                            size="mini"></el-input>
                </el-form-item>
                <el-form-item>
                  编码：
                  <el-input v-model="filters.roleId" placeholder="编码" style="width:150px; heght:30px;"
                            size="mini"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" @click="handleUserList()" size="mini">搜索</el-button>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light"></div>
            </el-col>
          </el-row>
        </div> <!-- 搜索区end -->
        <!--新增按钮      -->
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <el-button type="success" icon="el-icon-circle-plus-outline" @click="handleAdd" size="mini" round>新增
              </el-button>
              <el-button type="danger" icon="el-icon-delete" @click="handleDeleteList" size="mini" round>删除</el-button>
            </div>
          </el-col>
          <el-col :span="20">
            <div class="grid-content bg-purple-light">
            </div>
          </el-col>
        </el-row>

        <template>
          <!--表格数据及操作-->
          <el-table :data="userList.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                    size="mini"
                    highlight-current-row border
                    class="el-tb-edit mgt20"
                    ref="multipleTable"
                    tooltip-effect="dark"
                    v-loading="listLoading"
                    @selection-change="selectChange">
            <!--勾选框-->
            <el-table-column type="selection" width="55">
            </el-table-column>
            <!--索引-->
            <el-table-column type="index" :index="indexMethod">
            </el-table-column>

            <el-table-column label="角色名" prop="name">
            </el-table-column>
            <el-table-column label="编码" prop="roleId">
            </el-table-column>

            <el-table-column fixed="right" label="操作" width="550">
              <template slot-scope="scope">  <!-- -->
                <el-button size="small" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>

                <el-button type="success" icon="el-icon-circle-plus-outline" size="small" @click="handleAddUser(scope.$index,scope.row,'add')">新增用户</el-button>

                <el-button type="danger" icon="el-icon-delete" size="small" @click="handleAddUser(scope.$index,scope.row,'delete')">删除用户</el-button>

                <el-button type="success" icon="el-icon-circle-plus-outline" size="small" @click="handleAddmenu(scope.$index,scope.row,'add')">新增界面</el-button>

                <el-button type="danger" icon="el-icon-delete" size="small" @click="handleAddmenu(scope.$index,scope.row,'delete')">删除界面</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <br>
        <br>
        <!-- 分页 -->
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-sizes="[5, 10, 20, 40]"
                       :page-size="pagesize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="userList.length">
        </el-pagination>
      </div><!-- 页面内容区end-->
    </div><!-- 页面表格end -->
    <!--新增界面-->
    <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :inline="true" :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-row :gutter="20">
          <el-col :span="16">
            <div>
              <el-form-item label="角色名" prop="name">
                <el-input v-model.number="addForm.name" auto-complete="off"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div></div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="16">
            <div>
              <el-form-item label="角色编码" prop="roleId">
                <el-input v-model="addForm.roleId" auto-complete="off"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div></div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :inline="true" :model="editForm" label-width="80px" :rules="addFormRules" ref="editForm">
        <el-row :gutter="20">
          <el-col :span="16">
            <div>
              <el-form-item label="角色名" prop="name">
                <el-input v-model.number="editForm.name" auto-complete="off"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div></div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="16">
            <div>
              <el-form-item label="角色编码" prop="roleId">
                <el-input v-model="editForm.roleId" auto-complete="off"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div></div>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>



    <!--添加用户界面-->
    <el-dialog title="管理角色用户" :visible.sync="adduserFormVisible" :close-on-click-modal="false">
      <el-row :gutter="20">
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
          <el-form :inline="true" :model="ufilters">
            <el-form-item>
              用户名：
              <el-input v-model="ufilters.username" placeholder="用户名" style="width:200px; heght:30px;"
                        size="mini"></el-input>
            </el-form-item>
            <el-form-item>
              类型：
              <el-select v-model="ufilters.type" placeholder="请选择" clearable size="mini">
                <el-option v-for="item in ufilters.typeOptions" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="selecthandleAddUser" size="mini">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>

      </el-row>

      <template>
        <!--表格数据及操作-->
        <el-table :data="noAddRoleUser.slice((acurrentPage-1)*apagesize,acurrentPage*apagesize)"
                  size="mini"
                  highlight-current-row border
                  class="el-tb-edit mgt20"
                  ref="multipleTable"
                  tooltip-effect="dark"
                  v-loading="listLoading"
                  @selection-change="selectChange">
          <!--勾选框-->
          <el-table-column type="selection" width="55">
          </el-table-column>
          <!--索引-->
          <el-table-column type="index" :index="indexMethod">
          </el-table-column>

          <el-table-column label="用户名" prop="username">
          </el-table-column>
          <el-table-column label="密码" prop="password">
          </el-table-column>

          <el-table-column label="类型" prop="type" :formatter="formatType" sortable>
          </el-table-column>

        </el-table>
      </template>
      <br>
      <br>
      <!-- 分页 -->
      <el-pagination @size-change="ahandleSizeChange"
                     @current-change="ahandleCurrentChange"
                     :current-page="acurrentPage"
                     :page-sizes="[5, 10, 20, 40]"
                     :page-size="apagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="noAddRoleUser.length">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="adduserFormVisible = false">取消</el-button>
        <el-button type="primary" @click="adduserSubmit" :loading="adduserLoading">提交</el-button>
      </div>
    </el-dialog>



<!--  处理角色界面-->

    <el-drawer
      title="管理界面"
      :visible.sync="drawer"
      :direction="rtl"
      :close-on-press-escape="true"
    >
      <div style=" width:45%;float:right;">
        <el-button type="success" icon="el-icon-search" @click="saveRoleacl" size="mini">保存</el-button>
        <el-tree :data="treeData" class="mgt20" show-checkbox default-expand-all node-key="id" ref="tree" highlight-current :check-strictly=true :props="defaultProps">
        </el-tree>
      </div>

    </el-drawer>



  </section>
</template>
<script>
export default {
  name: "SysRole",
  data() {
    return {
      //搜索区域参数
      currentPage: 1, //初始页
      pagesize: 10,    //    每页的数据
      userList: [],

      filters: {
        name: "",
        roleId: "",
      },

      ufilters: {
        username: "",
        type: "",
        //类型下拉框
        typeOptions: [
          {
            value: "student_basic",
            label: "新生"
          },
          {
            value: "teacher",
            label: "教师"
          }
        ],
      },

      //列表Loading加载
      listLoading: false,
      //批量选中data
      selectList: [],

      //新增界面是否显示
      addFormVisible: false,
      //添加按钮Loading加载
      addLoading: false,
      //输入框验证
      addFormRules: {
        name: [{required: true, message: "请输入角色名", trigger: "blur"}],
        roleId: [
          {required: true, message: "请输入角色编码", trigger: "blur"}
        ]
      },
      //新增界面数据
      addForm: {
        name: "",
        roleId: ""
      },

      //编辑界面是否显示
      editFormVisible: false,
      //编辑按钮Loading加载
      editLoading: false,
      //编辑界面数据
      editForm: {
        id: "",
        name: "",
        roleId: ""
      },

      //添加用户界面是否显示
      adduserFormVisible: false,
      //添加用户按钮Loading加载
      adduserLoading: false,
      //添加用户界面数据
      adduserForm: {
          id: "",
          name: "",
          roleId: "",
        index:"",
        row:[],
        //区别点击的是增加或删除
        type:""
      },
      // 没有加入某角色的用户集合
      noAddRoleUser:[],
      acurrentPage: 1, //初始页
      apagesize: 10,    //    每页的数据

    //侧面窗弹出，显示界面树
      drawer:false ,

      addmenuForm:{
        id: "",
        type:""
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },

      treeData:[],

    };
  },
  mounted() {
    this.handleUserList()
  },
  methods: {
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function (size) {
      this.pagesize = size;
      console.log(this.pagesize)  //每页下拉显示数据
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
      console.log(this.currentPage)  //点击第几页
    },
    handleUserList() {
      var _this = this;
      this.postRequest('/system/sysrole/getallrole', {
        name: this.filters.name,
        roleId: this.filters.roleId
      }).then(resp => {
        if (resp && resp.status == 200) {
          var data = resp.data;
          console.info(JSON.stringify(data.obj));
          _this.userList = data;
        }
      });
    },
    //批量选中
    selectChange: function (val) {
      this.selectList = val;
    },
    formatType: function (row, column) {
      return row.type === "student_basic" ? "新生" : row.type === "teacher" ? "教师" : "未知";
    },
    indexMethod(index) {
      return index + 1;
    },
    //批量删除
    handleDeleteList: function () {
      const length = this.selectList.length;
      let nowid =this.$store.state.user.roles[0].id;
      console.info(nowid);
      let id = "";
      for (let i = 0; i < length; i++) {

        if(nowid==this.selectList[i].id){
          this.$message({
            message: "不允许删除自身角色",
            type: "error"
          });
          return ;
        }
        id += this.selectList[i].id + ",";
      }
      //去掉结尾,
      id = id.substring(0, id.length - 1);
      console.info(id);
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.listLoading = true;
        this.postRequest('/system/sysrole/deletelistrole', {
          id: id
        }).then(resp => {
          if (resp && resp.status == 200) {
            this.listLoading = false;
            this.selectList = [];
            this.handleUserList();
          }
        });
      })
        .catch(() => {
        });
    },
    //显示新增界面
    handleAdd: function () {
      this.addFormVisible = true;
    },
    //新增
    addSubmit: function () {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            this.postRequest('/system/sysrole/addroleinfo', {
              name: this.addForm.name,
              roleId: this.addForm.roleId,
            }).then(resp => {
              if (resp && resp.status == 200) {
                this.addLoading = false;
                this.$refs["addForm"].resetFields();
                this.addFormVisible = false;
                this.handleUserList();
              }
            });
          });
        }
      });
    },

    //显示编辑界面
    handleEdit: function (index, row) {
      console.info(JSON.stringify(row));
      this.editFormVisible = true;
      this.editForm.id = row.id;
      this.editForm.name = row.name;
      this.editForm.roleId = row.roleId;
    },
    //编辑
    editSubmit: function () {
      this.$refs.editForm.validate(valid => {
        let nowid =this.$store.state.user.roles[0].id;
        if(nowid==this.editForm.id){
          this.$message({
            message: "不允许修改自身角色",
            type: "error"
          });
          return ;
        }else{
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            this.postRequest('/system/sysrole/updateroleinfo', {
              id: this.editForm.id,
              name: this.editForm.name,
              roleId: this.editForm.roleId
            }).then(resp => {
              if (resp && resp.status == 200) {
                this.addLoading = false;
                this.$refs["editForm"].resetFields();
                this.editFormVisible = false;
                this.handleUserList();
              }
            });
          });
        }
        }
      });
    },
    // 显示为角色添加用户界面
    handleAddUser: function (index, row,type) {
      this.noAddRoleUser=[];
        this.adduserFormVisible=true;
        this.addLoading=true;
        this.adduserForm.id=row.id;
      this.adduserForm.name=row.name;
      this.adduserForm.roleId=row.roleId;
      this.adduserForm.index=index;
      this.adduserForm.row=row;
      this.adduserForm.type=type;
        var _this=this;
      // 加载未加入此角色的用户
      this.postRequest('/system/sysrole/getnoaddroleuserinfo', {
        roleId: row.roleId,
        type:type,
        username: this.ufilters.username,
        utype:this.ufilters.type
      }).then(resp => {
        if (resp && resp.status == 200) {
          _this.noAddRoleUser=resp.data;
          console.info(JSON.stringify(resp.data));
        }
      });
    },
    // 带条件的查询
    selecthandleAddUser:function(){
      this.noAddRoleUser=[];
      this.addLoading=true;
      var _this=this;
      // 加载未加入此角色的用户
      this.postRequest('/system/sysrole/getnoaddroleuserinfo', {
        roleId:_this.adduserForm.roleId,
        type:_this.adduserForm.type,
        username: this.ufilters.username,
        utype:this.ufilters.type
      }).then(resp => {
        if (resp && resp.status == 200) {
          _this.noAddRoleUser=resp.data;
          this.addLoading=false;
          console.info(JSON.stringify(resp.data));
        }
      });
    },



    // 初始页currentPage、初始每页数据数pagesize和数据data
    ahandleSizeChange: function (size) {
      this.apagesize = size;
      console.log(this.apagesize)  //每页下拉显示数据
    },
    ahandleCurrentChange: function (currentPage) {
      this.acurrentPage = currentPage;
      console.log(this.acurrentPage)  //点击第几页
    },

    adduserSubmit: function () {
      var _this=this;
      const length = this.selectList.length;
      let nowid =this.$store.state.user.id;

      let id = "";
      for (let i = 0; i < length; i++) {
        if(nowid==this.selectList[i].id){
          this.$message({
            message: "不允许给自身变动角色",
            type: "error"
          });
          return ;
        }
        id += this.selectList[i].id + ",";
      }

      if(id==""){
        this.$message(
          {
            message:"请选择用户",
            type:"warning"
          }
        );
      }else{
        //去掉结尾,
        id = id.substring(0, id.length - 1);
        console.info(id);
        console.info(_this.adduserForm.id);

        var wordtype="赋予";
        if(_this.adduserForm.type!='add'){
          var wordtype="剥夺";
        }
        this.$confirm("确认"+wordtype+"该用户"+_this.adduserForm.name+"角色吗?", "提示", {
          type: "warning"
        }).then(() => {

          if(_this.adduserForm.type=='add'){
            this.postRequest('/system/sysrole/insertuserrole', {
              id: id,
              role_id: _this.adduserForm.id
            }).then(resp => {
              if (resp && resp.status == 200) {
                _this.listLoading = false;
                _this.selectList = [];
                _this.handleAddUser(_this.adduserForm.index,_this.adduserForm.row,'add');
              }
            });
          }else{
            this.postRequest('/system/sysrole/deleteinsertuserrole', {
              id: id,
              role_id: _this.adduserForm.id
            }).then(resp => {
              if (resp && resp.status == 200) {
                _this.listLoading = false;
                _this.selectList = [];
                _this.handleAddUser(_this.adduserForm.index,_this.adduserForm.row ,'delete');
              }
            });
          }

        })
          .catch(() => {
          });
      }

    },


    saveRoleacl: function() {
      var _this = this;
      const ids = this.$refs.tree.getCheckedKeys();
      console.log(this.$refs.tree.getCheckedKeys());
      let id = "";
      if (ids.length > 0) {
        for (let i = 0; i < ids.length; i++) {
          id += ids[i] + ",";
        }
        //去掉结尾,
        id = id.substring(0, id.length - 1);
        console.info(id);

          this.postRequest('/system/sysrole/addordelrolemenu', {
            menuid: id,
            roleid:this.addmenuForm.id,
            type: this.addmenuForm.type
          }).then(resp => {
            if (resp && resp.status == 200) {
              this.drawer=false;
            }
          });

      }else{
        this.$message({
          message: "请选择界面！",
          type: "error"
        });
      }
    },

    handleAddmenu: function(index,row,type){
      console.info(JSON.stringify(row));
      this.addmenuForm.id=row.id;
      this.addmenuForm.type=type;
      console.info(type);
      console.info(row);
      // 加载未加入此角色的菜单
      this.postRequest('/system/sysrole/getnoaddrolemenuuserinfo', {
        roleId: row.roleId,
        type:type,
      }).then(resp => {
        if (resp && resp.status == 200) {
          this.treeData=resp.data;
          console.info(JSON.stringify(resp.data));
          // 加载出数据才是抽屉出现
          this.drawer=true;
        }
      });

    },
  },

};
</script>
<style scoped>
  .container {
    padding: 30px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
  }
</style>
