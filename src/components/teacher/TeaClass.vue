<template xmlns:el-col="http://www.w3.org/1999/html">
  <section class="container">
    <div>

      <el-tabs :tab-position="tabPosition" style="height: 200px;" @tab-click="clicktab">


        <el-tab-pane  label="专业分班" >

          <div class="divbuju" style="width: 100%; height: 600px;">

            <el-row>
              <el-col :span="4">专业</el-col>
              <el-col :span="4">男生数量</el-col>
              <el-col :span="4">女生数量</el-col>
              <el-col :span="4">班级个数</el-col>
            </el-row>

            <div class="divbuju" style="height: 50px" v-for="mas in majorandstudentlist">
              <el-row>
                  <el-col :span="4">{{mas.major}}</el-col>
                  <el-col :span="4">{{mas.boynumber}}</el-col>
                  <el-col :span="4">{{mas.girlnumber}}</el-col>
                  <el-col :span="4">

                    <el-input v-model.number="mas.classnumber" placeholder="请输入该专业班级数量"
                      auto-complete="off" @change="changenumber(mas)"></el-input>

                  </el-col>

                <el-col :span="8">{{mas.word}}</el-col>

              </el-row>
            </div>

                                  <el-row>
                                    <div style="margin-top: 20px">
                                      <el-col :span="4" :offset="20">
                                        <div class="grid-content bg-purple">
                                          <el-button type="success" icon="el-icon-circle-plus-outline" @click="assignmentClass" size="mini" round>
                                            确定分班
                                          </el-button>
                                        </div>
                                      </el-col>
                                    </div>
                                  </el-row>
                                </div>


                      <!--          <template>-->
<!--            <el-table-->
<!--              :data="majorandstudentlist"-->
<!--              style="width: 100%"-->
<!--              :v-loading="majornameLoading"-->
<!--            >-->
<!--              <el-table-column-->
<!--                prop="major"-->
<!--                label="专业">-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                prop="boynumber"-->
<!--                label="男生人数">-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                prop="girlnumber"-->
<!--                label="女生人数">-->
<!--              </el-table-column>-->

<!--              <el-table-column-->
<!--                label="班级数">-->
<!--                <template slot-scope="scope">-->
<!--                  <el-input v-model.number="scope.row.classnumber" placeholder="请输入该专业班级数量"-->
<!--                            auto-complete="off" @blur="changenumber(scope.$index,scope.row)"></el-input>-->
<!--                </template>-->
<!--              </el-table-column>-->

<!--              <el-table-column-->
<!--                label="提示">-->
<!--                <template slot-scope="scope">-->
<!--                  <div v-if="true"> {{scope.row.word}}</div>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--            </el-table>-->
<!--          </template>-->



        </el-tab-pane>


        <el-tab-pane  label="分班调控" >
          <el-row>

            <el-col :span="6">
              <div class="divbuju">
                <el-row>
                  <el-col :span="12">
                    <h2>全部班级:</h2>
                  </el-col>
                  <el-col :span="12">
                    <el-button type="warning" style="margin-top: 20px" class="el-icon-refresh-right"@click="shuaxin()" circle>刷新数据</el-button>
                  </el-col>
                </el-row>
              </div>

              <div class="divbuju" style="height: 500px;overflow-y: auto">
              <el-tree :data="treeData" :props="defaultProps" accordion node-key="id" style="margin-left: 20%"
                       :expand-on-click-node="false">
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span>
                           <i  @click="changtable(node)">{{node.label}}</i>
                           <i title="点击为此专业新增一个空白班级" v-if="!node.label.endsWith('班')" class="el-icon-plus"
                              @click="() => addNewClass(node)"></i>
                           <i v-if="(node.label.endsWith('班'))" class="el-icon-delete"
                              @click="() => removeClass(node, data)"></i>
                           </span>
                        </span>
              </el-tree>
              </div>
            </el-col>

            <el-col :span="18">
              <div class="divbuju" style="height: 600px;overflow-y: auto">
              <div class="handle-box"> <!-- 搜索区begin -->
                <!--工具条-->
                <el-row :gutter="20">
                  <el-form :inline="true" :model="ddmForm">

                    <el-col :span="6">
                      <el-form-item>
                        部门：
                        <el-select v-model="ddmForm.dept" placeholder="请选择" @change="deptChange" clearable size="mini">
                          <el-option v-for="item in deptList" :key="item.id" :label="item.name"
                                     :value="item.deptId"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>

                    <el-col :span="6">
                      <el-form-item>
                        系：
                        <el-select v-model="ddmForm.department" placeholder="请选择" @change="departmentChange" clearable
                                   size="mini">
                          <el-option v-for="item in departmentList" :key="item.id" :label="item.name"
                                     :value="item.departmentId"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>

                    <el-col :span="6">
                      <el-form-item>
                        专业：
                        <el-select v-model="ddmForm.major" placeholder="请选择" @change="majorChange" clearable
                                   size="mini">
                          <el-option v-for="item in majorList" :key="item.id" :label="item.name"
                                     :value="item.majorId"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        班级：
                        <el-select v-model="ddmForm.class" placeholder="请选择" @change="getStudent" clearable size="mini">
                          <el-option v-for="item in classList" :key="item.id" :label="item.name"
                                     :value="item.classId"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-form>

                </el-row>
              </div> <!-- 搜索区end -->

              <el-row>
                <el-col :span="4">
                  <div class="grid-content bg-purple">

                    <el-button type="danger" icon="el-icon-delete" @click="handleDeleteList" size="mini" round>移出班级
                    </el-button>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple-light">
                    <el-button type="success" icon="el-icon-circle-plus-outline" @click="handleAddList" size="mini" round>新增
                    </el-button>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple-light">
                    <el-button type="warning" icon="el-icon-warning" @click="selectnoclassstudent" size="mini" round>检查遗漏
                    </el-button>
                  </div>
                </el-col>
              </el-row>

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
            </el-col>


          </el-row>


        </el-tab-pane>

      </el-tabs>

      <!--  显示该专业为加入班级学生-->
      <el-dialog title="学生名单" :visible.sync="addStudentFromVisible" :close-on-click-modal="false" v-loading="addStudentFromLoading">
        <div>
          {{major}}专业未加入班级学生名单
          <div>
            <template>
              <!--表格数据及操作-->
              <el-table :data="addStudentList.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                        size="mini"
                        highlight-current-row border
                        class="el-tb-edit mgt20"
                        ref="multipleTable"
                        tooltip-effect="dark"
                        v-loading="addStudentFromLoading"
                        @selection-change="selectChange">
                <!--勾选框-->
                <el-table-column type="selection" width="55">
                </el-table-column>
                <!--索引-->
                <el-table-column type="index" :index="indexMethod">
                </el-table-column>
                <el-table-column label="姓名" prop="sb.name">
                </el-table-column>
                <el-table-column label="初始学号" prop="studentId">
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
                           :total="addStudentList.length">
            </el-pagination>

          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addStudentFromVisible=false">取消</el-button>
          <el-button @click="addStudentToCLass">确定</el-button>
        </div>
      </el-dialog>


    </div>
  </section>

</template>

<script>
  export default {
    name: "TeaClass",
    created() {
      this.initmajorandstudent();
      this.initTreeData();
    },
    mounted() {
     this.selectnoclassstudent();
    },
    methods: {
      initmajorandstudent() {
        this.majornameLoading = true;
        //获取专业
        this.postRequest('/teacher/teacherclass/getallmajorbynow', {}).then(resp => {
          if (resp && resp.status == 200) {
            var data = resp.data;
            console.info("major--------->" + JSON.stringify(data));
            this.majorandstudentlist = data;
            this.majornameLoading = false;
          }
        });
      },
      changenumber(row) {
        row.word="";
        if (row.classnumber > 0) {
          let allnumber = row.boynumber + row.girlnumber;
          let personnumber = allnumber / row.classnumber;
          if(personnumber<25){
            this.$message({
              message: "班级学生必须要在25人以上！请重新规划班级！！",
              type: "error"
            });
            row.classnumber = 0;
            row.isshow=false;
            return;
          }
          let word = row.major + "专业共" + allnumber + "人,该专业分为" + row.classnumber +
            "个班，每班大概" + Math.round(personnumber) + "人左右";
          row.classnumber=row.classnumber+1;
          row.classnumber=row.classnumber-1;
          row.isshow=true;
          row.word=word;

        } else {
          this.$message({
            message: "班级数必须大于0！",
            type: "error"
          });
          row.classnumber = 0;
          row.isshow=false;
        }
      },
      //开始分班
      assignmentClass() {
        console.info("赋值前" + JSON.stringify(this.numberlist));
        if (this.numberlist != "") {
          this.numberlist = "";
        }
        let maslist = this.majorandstudentlist;
        let errorword = "";
        for (let i = 0; i < maslist.length; i++) {
          if (maslist[i].classnumber <= 0) {
            errorword += maslist[i].major + "、";
          }
          this.numberlist += maslist[i].major + ":" + maslist[i].classnumber + ",";
          console.info("赋值中临时变量" + JSON.stringify(this.numberlist));
        }
        this.numberlist = this.numberlist.substring(0, this.numberlist.length - 1);
        console.info("赋值后" + JSON.stringify(this.numberlist));

        if (errorword != "") {
          this.$message(
            {
              message: errorword + "专业未设置分班数量，请设置！",
              type: "error"
            }
          );
          this.numberlist = "";
          console.info("清空后" + JSON.stringify(this.numberlist));
        } else {
          if (this.numberlist == "") {
            this.$message(
              {
                message: "暂无数据！！",
                type: "error"
              }
            );
          } else {
            this.$confirm("即将开始分班，是否已确定最终数目！", "注意！", {
              type: "warning"
            }).then(() => {
              this.majornameLoading = true;
              let finanumber = this.numberlist;
              console.info(finanumber);
              this.postRequest('/teacher/teacherclass/initclass', {
                finanumber: finanumber
              }).then(resp => {
                if (resp && resp.status == 200) {
                  this.numberlist = "";
                  this.majornameLoading = false;
                  this.initmajorandstudent();
                }
              });
            }).catch(() => {
              this.numberlist = "";
              this.majornameLoading = false;
            });
          }
        }
      },


      // 获取部门信息
      initDept() {
        this.postRequest('/teacher/teacherclass/getDept', {}).then(resp => {
          if (resp && resp.status == 200) {
            var data = resp.data;
            this.deptList = data;
            console.info("dept--------->" + JSON.stringify(data));
          }
        });
      },

      //部门改变事件
      deptChange(id) {
        this.departmentList = [];
        this.postRequest('/teacher/teacherclass/getDepartmentByDeptId', {
          deptId: this.ddmForm.dept
        }).then(resp => {
          if (resp && resp.status == 200) {
            var data = resp.data;
            this.departmentList = data;
          }
        });
      },

      //系改变事件
      departmentChange(id) {
        this.majorList = [],
          this.postRequest('/teacher/teacherclass/getMajorByDepartmentId', {
            departmentId: this.ddmForm.department
          }).then(resp => {
            if (resp && resp.status == 200) {
              var data = resp.data;
              this.majorList = data;
            }
          });
      },

      //专业改变事件
      majorChange(id) {
        this.classList = [],
          this.postRequest('/teacher/teacherclass/getClassByMajorId', {
            majorId: this.ddmForm.major
          }).then(resp => {
            if (resp && resp.status == 200) {
              var data = resp.data;
              this.classList = data;
              console.info("班级信息" + JSON.stringify(this.classList))
            }
          });
      },


      //班级改变事件&&根据参数获取学生信息
      getStudent() {
        console.info("ddmFrom--------------->" + JSON.stringify(this.ddmForm))
        this.studentLoading = true;
        this.signclassId=this.ddmForm.class;
        this.postRequest('/teacher/teacherclass/getStudentStatus', {
          deptId: this.ddmForm.dept,
          departmentId: this.ddmForm.department,
          majorId: this.ddmForm.major,
          classId: this.ddmForm.class
        }).then(resp => {
          if (resp && resp.status == 200) {
            var data = resp.data;
            this.studentList = data;
            this.studentLoading = false;
          }
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
      indexMethod(index) {
        return index + 1;
      },

      //批量选中
      selectChange: function (val) {
        this.selectList = val;
      },

      //初始化树
      initTreeData() {
        this.postRequest('/teacher/teacherclass/initTreeData', {}).then(resp => {
          if (resp && resp.status == 200) {
            var data = resp.data;
            this.treeData = data;
            //初始化部门
            this.initDept();
            console.info("树" + JSON.stringify(this.treeData))
          }
        });
      },
      //批量删除
      handleDeleteList: function () {
        const length = this.selectList.length;
        if(length>0){
          let id = "";
          for (let i = 0; i < length; i++) {
            id += this.selectList[i].id + ",";
          }
          //去掉结尾,
          id = id.substring(0, id.length - 1);
          console.info(id);
          var word = "确定将编号" + id + "的同学移出编号" + this.studentList[0].classId + "的班级吗";
          this.$confirm(word, "提示", {
            type: "warning"
          }).then(() => {
            this.postRequest('/teacher/teacherclass/deletelistclassformstudent', {
              id: id
            }).then(resp => {
              if (resp && resp.status == 200) {
                this.selectList = [];
                this.getStudent();
              }
            });
          })
            .catch(() => {
            });
        }else{
          this.$message({
            message:"请先选择学生",
            type:"warning"
          });
        }

      },


      //查询未加入班级的学生
      selectnoclassstudent() {
        this.getRequest('/teacher/teacherclass/getMajorAndStudentSun').then(resp => {
          if (resp && resp.status == 200) {
            var data = resp.data;
            var word = "";
            for (var i = 0; i < data.length; i++) {
              word += data[i].major + "专业有" + data[i].classnumber + "名学生未安排班级！！！！！！ <br/>"
            }
            if (word != "") {
              this.$notify({
                title: '提示',
                dangerouslyUseHTMLString: true,
                message: '<h4>注意！'+word+'</h4>',
                type: 'warning',
                duration: 0
              });
            }
          }
        });
      },
      //删除整个班级，学生回归未分配状态，学号不会改变
      removeClass(node, data) {
        console.info(JSON.stringify(node.data));
        this.$confirm("确定删除" + node.data.name + "吗？删除后该班级学生将无班级", "提示", {
          type: "warning"
        }).then(() => {
          this.postRequest('/teacher/teacherclass/deleteclassandformstudent', {
            id: node.data.classId
          }).then(resp => {
            if (resp && resp.status == 200) {
              this.selectList = [];
              this.initTreeData();
            }
          });
        })
          .catch(() => {
          });
      },

      //新建班级按钮事件
      addNewClass(node) {
        console.info(JSON.stringify(node.data));
        var children=node.data.children;
        let maxclassId=0;
        for(let i=0;i<children.length;i++){
          let tempclassId=children[i].classId;
          console.info(i+"次:"+tempclassId)
          if(maxclassId<tempclassId){
            maxclassId=tempclassId;
            console.info(i+"次:"+maxclassId)
          }
        }
        let oldlen=maxclassId.length;

        maxclassId=parseInt(maxclassId)+1;


        console.info("+1:"+maxclassId);
        let smaxclassId=String(maxclassId);
        let newlen=smaxclassId.length;
        let name =parseInt(smaxclassId.slice(smaxclassId.length-2))+"班";

        console.info("长度"+oldlen+newlen+(oldlen>newlen));
        if(oldlen>newlen){
          smaxclassId="0"+smaxclassId;
        }
        console.info("班级名称与编号"+name+smaxclassId);
        this.$confirm("确定在" + node.label + "专业中新建立一个班级吗？", "提示", {
          type: "warning"
        }).then(() => {
          this.postRequest('/teacher/teacherclass/getNewClass', {
            classId: smaxclassId,
            name:name,
            grade:children[0].grade,
            majorId:children[0].majorId
          }).then(resp => {
            if (resp && resp.status == 200) {
              this.initTreeData();
            }
          });
        })
          .catch(() => {
          });

      },

      //从本专业中挑选未有班级的学生
      handleAddList() {
        if(this.signclassId!=""){
          this.addStudentFromVisible=true;
          this.addStudentFromLoading=true;
          this.postRequest('/teacher/teacherclass/getNoCLassStudentSunByMajorId', {
            classId: this.signclassId
          }).then(resp => {
            if (resp && resp.status == 200) {
              console.info(JSON.stringify(resp.data.allsss))
              this.addStudentList=resp.data.allsss;
              this.major=resp.data.major;
              this.addStudentFromLoading=false;
            }
          });
        }else{
          this.$message({
            message:'请先选择班级',
            type:'error'
          });
        }
      },

      //批量添加新生到该班级
      addStudentToCLass(){
        const length = this.selectList.length;
        let id = "";
        for (let i = 0; i < length; i++) {
          id += this.selectList[i].id + ",";
        }
        //去掉结尾,
        id = id.substring(0, id.length - 1);
        if(id!=""){
          console.info(id);
          var word = "确定将编号" + id + "的同学添加编号" + this.signclassId + "的班级吗";
          this.$confirm(word, "提示", {
            type: "warning"
          }).then(() => {
            this.postRequest('/teacher/teacherclass/addStudentCLassByid', {
              id: id,
              classId:this.signclassId
            }).then(resp => {
              if (resp && resp.status == 200) {
                this.selectList = [];
                this.ddmForm.class=this.signclassId;
                this.getStudent();
                this.addStudentFromVisible=false;
              }
            });
          })
            .catch(() => {
            });
        }

      },

      //点击树的子节点班级名称触发的事件
      changtable(node) {
        if (node.label.endsWith('班')) {
          this.signclassId=node.data.classId;
          this.studentLoading = true;
          this.postRequest('/teacher/teacherclass/getStudentStatus', {
            classId: node.data.classId
          }).then(resp => {
            if (resp && resp.status == 200) {
              var data = resp.data;
              this.studentList = data;
              this.studentLoading = false;
            }
          });
        }
      },
      //刷新树
      shuaxin(){
        this.initTreeData();
      },

      //点击tab
      clicktab(tab){
        if(tab.label=='分班调控'){
          this.initTreeData();
        }else{
          this.initmajorandstudent();
        }
      }

    },
    data() {
      return {
        majornameLoading: false,
        majorandstudent: {
          major: "",
          boynumber: "",
          girlnumber: "",
          classnumber: "0",
        },
        majorandstudentlist: [],
        numberlist: "",
        submitLoading: false,

        tabPosition: "top",

        changid: "",


        //班级信息
        classList: [],

        //专业信息
        majorList: [],
        //系信息
        departmentList: [],
        //部门信息
        deptList: [],

        ddmForm: {

          class: "",
          major: "",
          department: "",
          dept: "",

        },

        // 显示学生窗口参数

        studentList: [],
        studentLoading: false,

        currentPage: 1, //初始页
        pagesize: 5,    //    每页的数据

        selectList: [],


        defaultProps: {
          children: 'children',
          label: 'name'
        },

        treeData: [],

        //标记当前的班级id，点击新增时可以确认当前班级
        signclassId:"",
        major:"",
        addStudentFromLoading:false,
        addStudentFromVisible:false,
        addStudentList:[],
      }
    },
  }
</script>

<style scoped>
  .container {
    height: 700px;
    padding: 30px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
  }
</style>
