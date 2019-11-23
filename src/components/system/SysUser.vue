<template>
  <section>
    <!--       这是用户管理页面-->
    <div class="table"> <!-- 页面表格begin -->
      <div class="container"><!-- 页面内容区begin -->
        <div class="handle-box"> <!-- 搜索区begin -->
          <!--工具条-->
          <el-row :gutter="20">
            <el-col :span="12" class="toolbar" style="padding-bottom: 0px;">
              <el-form :inline="true" :model="filters">
                <el-form-item>
                  用户名：
                  <el-input v-model="filters.username" placeholder="用户名" style="width:150px; heght:30px;"
                            size="mini"></el-input>
                </el-form-item>
                <el-form-item>
                  类型：
                  <el-select v-model="filters.type" placeholder="请选择" clearable size="mini" style="width:150px; heght:30px;">
                    <el-option v-for="item in filters.typeOptions" :key="item.value" :label="item.label"
                               :value="item.value"></el-option>
                  </el-select>
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

            <el-table-column label="用户名" prop="username">
              <template slot-scope="scope">
                <el-button @click="handleSelect(scope.$index,scope.row)" type="text" size="small">
                  {{scope.row.username}}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="密码" prop="password">
            </el-table-column>

            <el-table-column label="类型" prop="type" :formatter="formatType" sortable>
            </el-table-column>

            <el-table-column fixed="right" label="操作" width="150">
              <template slot-scope="scope">  <!-- -->
                <el-button type="primary" plain size="small" @click="handleRole(scope.$index,scope.row)">角色</el-button>
                <el-button size="small" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
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
              <el-form-item label="用户名" prop="username">
                <el-input v-model.number="addForm.username" auto-complete="off"></el-input>
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
              <el-form-item label="登录密码" prop="password">
                <el-input v-model="addForm.password" auto-complete="off"></el-input>
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
              <el-form-item label="类型" prop="type">
                <el-select v-model="addForm.type" placeholder="请选择" clearable>
                  <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
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
    <!--详细界面-->
    <el-dialog title="详细信息" :visible.sync="selectFormVisible" :close-on-click-modal="false">
      <el-form :inline="true" :model="selectForm" label-width="80px" ref="selectForm">
        <div v-if="selectForm.type == 'student_basic'">
          <el-form-item label="姓名" prop="userName">
            <el-input v-model="selectForm.student.name" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
          <el-form-item label="身份证号" prop="loginName">
            <el-input v-model="selectForm.student.idNumber" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="出生日期" prop="birthday">
            <el-date-picker v-model="selectForm.student.birthday" type="date" placeholder="选择日期"
                            value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="selectForm.student.phone" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
          <el-form-item label="父母手机" prop="mobile">
            <el-input v-model="selectForm.student.parentPhone" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
          <el-form-item label="邮件" prop="email">
            <el-input v-model="selectForm.student.email" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
          <el-form-item label="性别" prop="sex">
            <el-input v-model="selectForm.student.sex" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="家庭住址" prop="homeAddress">
            <el-input v-model="selectForm.student.adress" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="专业" prop="homeAddress">
            <el-input v-model="selectForm.student.major" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item label="姓名" prop="userName">
            <el-input v-model="selectForm.teacher.name" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
          <el-form-item label="职工号" prop="loginName">
            <el-input v-model="selectForm.teacher.teacherId" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="登录密码" prop="password">
            <el-input v-model="selectForm.teacher.password" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="selectForm.teacher.phone" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="邮件" prop="email">
            <el-input v-model="selectForm.teacher.email" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
          <el-form-item label="性别" prop="sex">
            <el-input v-model="selectForm.teacher.sex" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="家庭住址" prop="homeAddress">
            <el-input v-model="selectForm.teacher.adress" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="selectFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :inline="true" :model="editForm" label-width="80px" :rules="addFormRules" ref="editForm">
        <el-row :gutter="20">
          <el-col :span="16">
            <div>
              <el-form-item label="用户名" prop="username">
                <el-input v-model.number="editForm.username" auto-complete="off"></el-input>
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
              <el-form-item label="登录密码" prop="password">
                <el-input v-model="editForm.password" auto-complete="off"></el-input>
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
              <el-form-item label="类型" prop="type">
                <el-select v-model="editForm.type" placeholder="请选择" clearable>
                  <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
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

    <!-- 查看角色 -->
    <el-dialog title="查看角色" :visible.sync="roleFormVisible" :close-on-click-modal="false">
      <el-form :model="selectForm" label-width="80px" ref="selectForm" :inline="true">
        <el-form-item label="用户名" prop="positionName">
          <el-input v-model="selectForm.username" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <el-form label-width="80px" :inline="true">
        <div v-for="item in selectForm.roles" :key="item.id">
          <el-form-item label="角色名称" prop="">
            <el-input v-model="item.name" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="角色编码" prop="">
            <el-input v-model="item.roleId" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

  </section>
</template>
<script>
  export default {
    name: "SysUser",

    data() {
      return {
        //搜索区域参数
        currentPage: 1, //初始页
        pagesize: 10,    //    每页的数据
        userList: [],

        filters: {
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
        //table返回的数据
        tableData: [],
        //列表Loading加载
        listLoading: false,
        //批量选中data
        selectList: [],
        //分页
        count: 0,
        currentPage: 1,
        pageSize: 10,
        //角色信息
        roleData: [],
        //新增界面是否显示
        addFormVisible: false,
        //添加按钮Loading加载
        addLoading: false,
        //输入框验证
        addFormRules: {
          username: [{required: true, message: "请输入用户名(数字)", trigger: "blur"}],
          password: [
            {required: true, message: "请输入登录密码", trigger: "blur"}
          ],
          type: [{required: true, message: "请选择类型", trigger: "blur"}]
        },
        //新增界面数据
        addForm: {
          username: "",
          password: "",
          type: ""
        },
        //查看详细
        selectForm: {
          username: "",
          password: "",
          type: "",
          roles: [],
          student: {
            id: '',
            name: '',
            sex: '',
            birthday: '',
            phone: '',
            idNumber: '',
            email: '',
            parentPhone: '',
            adress: '',
            major: '',
            state: ''
          },

          teacher: {
            id: '',
            teacherId: '',
            password: '',
            name: '',
            sex: '',
            phone: '',
            email: '',
            adress: ''
          }
        },
        //详细界面是否显示
        selectFormVisible: false,
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
        //编辑界面是否显示
        editFormVisible: false,
        //编辑按钮Loading加载
        editLoading: false,
        //编辑界面数据
        editForm: {
          id: "",
          username: "",
          password: "",
          type: ""
        },


        //用户信息
        infoForm: [],
        //角色Loading加载
        roleListLoading: false,
        //角色信息
        roleData: [],
        //是否显示角色信息
        roleFormVisible: false,


        //未加入用户信息



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

        this.postRequest('/system/sysuser/getallusers', {
          username: _this.filters.username,
          type: _this.filters.type
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
        let nowid=this.$store.state.user.id;
        const length = this.selectList.length;
        let id = "";
        for (let i = 0; i < length; i++) {
          if(nowid==this.selectList[i].id){
            this.$message({
              message: "不允许删除自身信息",
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
          this.postRequest('/system/sysuser/deletelistusers', {
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
            //如果类型未选择给默认值
            if (this.addForm.type == "") {
              this.addForm.sex = "teacher";
            }
            this.$confirm("确认提交吗？", "提示", {}).then(() => {
              this.addLoading = true;
              this.postRequest('/system/sysuser/addusersinfo', {
                username: this.addForm.username,
                password: this.addForm.password,
                type: this.addForm.type
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

      // 点击登录名显示详细
//row的数据===》{"id":1,"username":"2019714","password":"0000","type":"teacher","roles":[{"id":8,"roleId":"ROLE_ADMIN","name":"超级管理员"}]}
      handleSelect: function (index, row) {
        this.selectFormVisible = true;
        var _this = this;
        this.postRequest('/system/sysuser/selectusersinfo', {
          username: row.username,
          type: row.type
        }).then(resp => {
          if (resp && resp.status == 200) {
            _this.selectForm.username = row.username;
            _this.selectForm.password = row.password;
            _this.selectForm.type = row.type;
            _this.selectForm.roles = row.roles;

            if (resp.data.msg == '新生') {
              _this.selectForm.student = resp.data.obj;
            } else {
              _this.selectForm.teacher = resp.data.obj;
            }
            console.info(resp.data.msg == '新生');
          }
        });
        console.info(JSON.stringify(row));
        console.info(JSON.stringify(_this.selectForm));

      },

      //查看角色
      handleRole: function (index, row) {
        //显示角色信息页面
        this.roleFormVisible = true;
        this.roleListLoading = true;
        this.selectForm.username = row.username;
        this.selectForm.type = row.type;
        this.selectForm.roles = row.roles;
        this.roleListLoading = false;
      },


      //显示编辑界面
      handleEdit: function (index, row) {
        this.editFormVisible = true;
        this.editForm.id = row.id;
        this.editForm.username = row.username;
        this.editForm.password = row.password;
        this.editForm.type = row.type;
      },
      //编辑
      editSubmit: function () {
        let nowid=this.$store.state.user.id;
        if(nowid==this.editForm.id){
          this.$message({
            message: "不允许修改自身信息",
            type: "error"
          });
          return ;
        }else{
          //如果类型未选择给默认值
          if (this.editForm.type == "") {
            //默认修改为学生
            this.editForm.type = "student";
          }
          this.$refs.editForm.validate(valid => {
            if (valid) {
              this.$confirm("确认提交吗？", "提示", {}).then(() => {
                this.addLoading = true;
                this.postRequest('/system/sysuser/updateusersinfo', {
                  id: this.editForm.id,
                  username: this.editForm.username,
                  password: this.editForm.password,
                  type: this.editForm.type
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
          });
        }
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




































