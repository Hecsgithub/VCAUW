<template>
  <section>
    <div class="table"> <!-- 页面表格begin -->
      <div class="container"><!-- 页面内容区begin -->
        <div class="handle-box"> <!-- 搜索区begin -->
          <!--工具条-->
          <el-row :gutter="20">
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
              <el-form :inline="true" :model="classForm">
                <el-form-item>
                  班主任：
                  <el-select v-model="classForm.director" placeholder="请选择" clearable size="mini">
                    <el-option v-for="item in directorList" :key="item.teacherId" :label="item.name"
                               :value="item.teacherId"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item>
                  专业：
                  <el-select v-model="classForm.major" placeholder="请选择" clearable size="mini">
                    <el-option v-for="item in majorList" :key="item.name" :label="item.name"
                               :value="item.name"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item>
                  系：
                  <el-select v-model="classForm.department" placeholder="请选择" clearable size="mini">
                    <el-option v-for="item in departmentList" :key="item.name" :label="item.name"
                               :value="item.name"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item>
                  部门：
                  <el-select v-model="classForm.dept" placeholder="请选择" clearable size="mini">
                    <el-option v-for="item in deptList" :key="item.name" :label="item.name"
                               :value="item.name"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" @click="getAllClass()" size="mini">搜索</el-button>
                </el-form-item>

              </el-form>
            </el-col>

          </el-row>
        </div> <!-- 搜索区end -->

        <template>
          <!--表格数据及操作-->
          <el-table :data="classList.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                    size="mini"
                    highlight-current-row border
                    class="el-tb-edit mgt20"
                    ref="multipleTable"
                    tooltip-effect="dark"
                    v-loading="initLoading"
                    @selection-change="selectChange">
            <!--勾选框-->
            <el-table-column type="selection" width="55">
            </el-table-column>
            <!--索引-->
            <el-table-column type="index" :index="indexMethod">
            </el-table-column>
            <el-table-column label="部门" prop="dept">
            </el-table-column>
            <el-table-column label="系" prop="department">
            </el-table-column>
            <el-table-column label="专业" prop="major">
            </el-table-column>
            <el-table-column label="年级" prop="grade">
            </el-table-column>
            <el-table-column label="班级" prop="name">
            </el-table-column>
            <el-table-column label="学生" prop="classId">
              <template slot-scope="scope">  <!-- -->
                <el-button type="primary" icon="el-icon-search" circle size="small" @click="showStudentInfo(scope.row)">
                  查看详情
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="班主任编号" prop="director">
              <template slot-scope="scope">
                <el-button @click="showdirector(scope.row)" type="text" size="small">{{scope.row.director}}</el-button>
              </template>
            </el-table-column>

            <el-table-column fixed="right" label="班主任" width="150">
              <template slot-scope="scope">  <!-- @click="handleEdit(scope.$index,scope.row)"-->
                <el-select v-model="scope.row.director" @change="directorchage(scope.row)" placeholder="请选择" clearable
                           size="mini">
                  <el-option v-for="item in directorList" :key="item.teacherId" :label="item.name"
                             :value="item.teacherId"></el-option>
                </el-select>
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
                       :total="classList.length">
        </el-pagination>
      </div><!-- 页面内容区end-->

    </div><!-- 页面表格end -->


    <!--  显示该班级学生-->
    <el-dialog title="班级学生" :visible.sync="studentFormVisible" :close-on-click-modal="false" v-loading="studentLoading">
            <div>
              <div>
                <template>
                  <!--表格数据及操作-->
                  <el-table :data="studentList.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                            size="mini"
                            highlight-current-row border
                            class="el-tb-edit mgt20"
                            ref="multipleTable"
                            tooltip-effect="dark"
                            v-loading="studentLoading"
                            @selection-change="selectChange">
                    <!--勾选框-->
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <!--索引-->
                    <el-table-column type="index" :index="indexMethod">
                    </el-table-column>
                    <el-table-column label="姓名" prop="sb.name">
                    </el-table-column>
                    <el-table-column label="性别" prop="sb.sex">
                    </el-table-column>
                    <el-table-column label="手机号码" prop="sb.phone">
                    </el-table-column>
                    <el-table-column label="邮箱" prop="sb.email">
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
                               :total="studentList.length">
                </el-pagination>

              </div>
            </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="studentFormVisible=false">确定</el-button>
      </div>
    </el-dialog>

    <!--  显示该班主任详细信息-->
    <el-dialog title="班主任" :visible.sync="teacherFormVisible" :close-on-click-modal="false" v-loading="teacherLoading">
      <el-row>
        <el-col :spam="6">
          姓名:{{teacher.name}}
        </el-col>
        <el-col :span="12">

        </el-col>
      </el-row>
      <el-row>
        <el-col :spam="12">
          职工号:{{teacher.director}}
        </el-col>
        <el-col :span="12">

        </el-col>
      </el-row>
      <el-row>
        <el-col :spam="12">
          手机:{{teacher.phone}}
        </el-col>
        <el-col :span="12">

        </el-col>
      </el-row>
      <el-row>
        <el-col :spam="12">
          邮件:{{teacher.email}}
        </el-col>
        <el-col :span="12">

        </el-col>

      </el-row>
      <el-row>
        <el-col :spam="12">
          性别:{{teacher.sex}}
        </el-col>
        <el-col :span="12">

        </el-col>

      </el-row>
      <el-row>
        <el-col :spam="12">
          住址:{{teacher.adress}}
        </el-col>
        <el-col :span="12">

        </el-col>

      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="teacherFormVisible=false">确定</el-button>
      </div>
    </el-dialog>


  </section>
</template>

<script>
  export default {
    name: "TeaClassInfo",
    created() {
      this.initdata();
    },
    mounted() {
      this.getAllClass();
    },
    methods: {
      // 按条件查询班级信息
      getAllClass() {
        this.initLoading = true;
        var _this = this;
        this.postRequest('/teacher/teaclassinfocontroller/getallclass', {
          director: _this.classForm.director,
          major: _this.classForm.major,
          department: _this.classForm.department,
          dept: _this.classForm.dept
        }).then(resp => {
          if (resp && resp.status == 200) {
            var data = resp.data;
            console.info("classlist--------->" + JSON.stringify(data));
            _this.classList = data;
            _this.initLoading = false;
          }
        });
      },
      //初始化专业、系、部门资料
      initdata() {
        var _this = this;
        this.postRequest('/teacher/teaclassinfocontroller/initdata', {}).then(resp => {
          if (resp && resp.status == 200) {
            var data = resp.data;
            console.info("arraylist--------->" + JSON.stringify(data));
            _this.majorList = data[0];
            console.info("0-------------------->" + JSON.stringify(_this.majorList));
            _this.departmentList = data[1];
            console.info("1-------------------->" + JSON.stringify(_this.departmentList));
            _this.deptList = data[2];
            console.info("2-------------------->" + JSON.stringify(_this.deptList));
            _this.directorList = data[3];
            console.info("3-------------------->" + JSON.stringify(_this.directorList));
          }
        });
      },

      indexMethod(index) {
        return index + 1;
      },

      //批量选中
      selectChange: function (val) {
        this.selectList = val;
      },

      //批量删除
      handleDeleteList: function () {
        let nowid = this.$store.state.user.id;
        const length = this.selectList.length;
        let id = "";
        for (let i = 0; i < length; i++) {
          if (nowid == this.selectList[i].id) {
            this.$message({
              message: "不允许删除自身信息",
              type: "error"
            });
            return;
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

      // 初始页currentPage、初始每页数据数pagesize和数据data
      handleSizeChange: function (size) {
        this.pagesize = size;
        console.log(this.pagesize)  //每页下拉显示数据
      },
      handleCurrentChange: function (currentPage) {
        this.currentPage = currentPage;
        console.log(this.currentPage)  //点击第几页
      },

      //查询新生详情
      showStudentInfo(row) {
        this.studentFormVisible = true;
        this.studentLoading = true;
        var _this = this;
        console.info(JSON.stringify(row))
        this.postRequest('/teacher/teaclassinfocontroller/getclassstudent', {
          id: row.class_id
        }).then(resp => {
          if (resp && resp.status == 200) {
            _this.studentList = resp.data;
            console.info(JSON.stringify(resp.data));
            this.studentLoading = false;
          }
        });

      },
      // 显示班主任详细
      showdirector(row) {
        if (row.director != "") {
          this.teacherFormVisible = true;
          this.teacherLoading = true;
          var _this = this;
          this.postRequest('/teacher/teaclassinfocontroller/getteacherinfo', {id: row.director}).then(resp => {
            _this.teacher = resp.data;
            _this.teacherLoading = false;
          });
        }
      },
      //修改该班级班主任人选
      directorchage(row) {
        this.postRequest('/teacher/teaclassinfocontroller/updatedirector', {
          tid: row.id,
          id: row.director
        }).then(resp => {

        });
      },

    },
    data() {
      return {

        initLoading: false,
        //查询的班级信息
        //搜索区域参数
        currentPage: 1, //初始页
        pagesize: 10,    //    每页的数据
        classList: [],
        //专业信息
        majorList: [],
        //系信息
        departmentList: [],
        //部门信息
        deptList: [],
        //班主任信息
        directorList: [],

        classForm: {
          id: "",
          class_id: "",
          name: "",
          director: "",
          grade: "",
          major_id: "",
          major: "",
          department: "",
          dept: "",
        },

        //批量选中data
        selectList: [],

        // 显示学生窗口参数

        studentList: [],
        studentLoading: false,
        studentFormVisible: false,

        // 显示班主任详细窗口参数

        teacher: {},
        teacherLoading: false,
        teacherFormVisible: false,
      }
    }

  }
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
