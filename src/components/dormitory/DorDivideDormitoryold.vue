<template>
  <section class="container">
    <div  class="divbuju" >
    <div >
      <el-steps  :active="stepsactive" align-center>
        <el-step title="一、自动划分宿舍" ></el-step>
        <el-step title="二、手动调整未满员宿舍"></el-step>
        <el-step title="三、查看班级分配情况"></el-step>
      </el-steps>

    </div>
      <el-button @click="presteps" icon="el-icon-back">上一步</el-button>
    <el-button @click="nextsteps" icon="el-icon-right">下一步</el-button>
    </div>


    <div class="divbuju" v-show="stepsactive==0" style="height: 500px">
      <div style="margin-top: 10px; margin-right: 20px">
        <el-row>
          <el-col :span="12">
            <el-button type="primary" icon="el-icon-caret-right" @click="dividedormitory" size="mini" round>分配宿舍
            </el-button>
          </el-col>
        </el-row>
      </div>

      <div class="jichudiv" :class="{'jichudivred':!isred,'jichudivgreen':!isgreen}">

      </div>

    </div>

    <div class="grid-content bg-purple" v-show="stepsactive==1">
      <div class="divbuju">
        <div>
          <el-tabs type="border-card">
            <el-tab-pane label="男生未满员宿舍管理">
              <el-row>
                <el-col :span="4">
                  <el-button type="danger" icon="el-icon-delete" @click="bhandleDeleteList" size="mini" round>解散宿舍
                  </el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="16">
                  <template>
                    <!--表格数据及操作-->
                    <el-table
                      :data="boyinsufficientDormitory.slice((boycurrentPage-1)*boypagesize,boycurrentPage*boypagesize)"
                      size="mini"
                      highlight-current-row border
                      class="el-tb-edit mgt20"
                      ref="multipleTable"
                      tooltip-effect="dark"
                      v-loading="addDormitoryforClassFromLoading"
                      @selection-change="blessselectChange">
                      <!--勾选框-->
                      <el-table-column type="selection" width="35">
                      </el-table-column>
                      <!--索引-->
                      <el-table-column type="index" :index="indexMethod" width="35">
                      </el-table-column>

                      <el-table-column label="栋" prop="dong" sortable width="70">
                      </el-table-column>
                      <el-table-column label="层" prop="floor" sortable width="70">
                      </el-table-column>
                      <el-table-column label="房间" prop="room" sortable width="70">
                      </el-table-column>
                      <el-table-column label="性别" prop="sex" width="50">
                      </el-table-column>
                      <el-table-column label="几人间" prop="number" :formatter="formatnumber" sortable width="100">
                      </el-table-column>
                      <el-table-column label="已分配" prop="hasnumber" sortable width="90">
                      </el-table-column>
                      <el-table-column label="费用/人/年）" prop="rent" width="90">
                      </el-table-column>
                      <el-table-column fixed="right" label="操作" width="200">
                        <template slot-scope="scope">  <!-- -->
                          <!--                <el-button plain size="small" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>-->
                          <el-button plain size="small" @click="getstudent(scope.row)">查看详情</el-button>
                          <el-button type="success" size="small" @click="badddormitory(scope.row)">选择班级</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                  <br>
                  <br>
                  <!-- 分页 -->
                  <el-pagination @size-change="boyhandleSizeChange"
                                 @current-change="boyhandleCurrentChange"
                                 :current-page="boycurrentPage"
                                 :page-sizes="[5, 10, 20, 40]"
                                 :page-size="boypagesize"
                                 layout="total, sizes, prev, pager, next, jumper"
                                 :total="boyinsufficientDormitory.length">
                  </el-pagination>
                </el-col>
                <el-col :span="8">
                  <el-row>
                    <el-col :span="4">
                      <el-button type="success" icon="el-icon-plus" @click="baddnewDormitory" size="mini" round>分配新宿舍
                      </el-button>
                    </el-col>
                  </el-row>
                  <template>
                    <!--表格数据及操作-->
                    <el-table
                      :data="bclassdormitort.slice((boyneedcurrentPage-1)*boyneedpagesize,boyneedcurrentPage*boyneedpagesize)"
                      size="mini"
                      highlight-current-row border
                      class="el-tb-edit mgt20"
                      ref="multipleTable1"
                      tooltip-effect="dark"
                      v-loading="addDormitoryforClassFromLoading"
                      @selection-change="bneedselectChange">
                      <!--勾选框-->
                      <el-table-column type="selection" width="35">
                      </el-table-column>
                      <el-table-column label="专业" prop="c.m.name">
                      </el-table-column>
                      <el-table-column label="班级" prop="c.name">
                      </el-table-column>
                      <el-table-column label="缺少床位" prop="boylessnumber" sortable>
                      </el-table-column>
                    </el-table>
                  </template>
                  <br>
                  <br>
                  <!-- 分页 -->
                  <el-pagination @size-change="boyneedhandleSizeChange"
                                 @current-change="boyneedhandleCurrentChange"
                                 :current-page="boyneedcurrentPage"
                                 :page-sizes="[5, 10, 20, 40]"
                                 :page-size="boyneedpagesize"
                                 layout="total, sizes, prev, pager, next, jumper"
                                 :total="bclassdormitort.length">
                  </el-pagination>
                </el-col>
              </el-row>


            </el-tab-pane>
            <el-tab-pane label="女生未满员宿舍管理">
              <el-row>
                <el-col :span="4">
                  <el-button type="danger" icon="el-icon-delete" @click="ghandleDeleteList" size="mini" round>解散宿舍
                  </el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="16">
                  <template>
                    <!--表格数据及操作-->
                    <el-table
                      :data="girlinsufficientDormitory.slice((girlcurrentPage-1)*girlpagesize,girlcurrentPage*girlpagesize)"
                      size="mini"
                      highlight-current-row border
                      class="el-tb-edit mgt20"
                      ref="multipleTable"
                      tooltip-effect="dark"
                      v-loading="addDormitoryforClassFromLoading"
                      @selection-change="glessselectChange">
                      <!--勾选框-->
                      <el-table-column type="selection" width="35">
                      </el-table-column>
                      <!--索引-->
                      <el-table-column type="index" :index="indexMethod" width="35">
                      </el-table-column>

                      <el-table-column label="栋" prop="dong" sortable width="70px">
                      </el-table-column>
                      <el-table-column label="层" prop="floor" sortable width="70px">
                      </el-table-column>
                      <el-table-column label="房间" prop="room" sortable width="70px">
                      </el-table-column>
                      <el-table-column label="性别" prop="sex" width="50px">
                      </el-table-column>
                      <el-table-column label="几人间" prop="number" :formatter="formatnumber" sortable width="100px">
                      </el-table-column>
                      <el-table-column label="已分配）" prop="hasnumber" sortable width="100px">
                      </el-table-column>
                      <el-table-column label="费用/人/年）" prop="rent" width="90px">
                      </el-table-column>
                      <el-table-column fixed="right" label="操作" width="200">
                        <template slot-scope="scope">  <!-- -->
                          <!--                <el-button plain size="small" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>-->
                          <el-button plain size="small" @click="getstudent(scope.row)">查看详情</el-button>
                          <el-button type="success" size="small" @click="gadddormitory(scope.row)">选择班级</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                  <br>
                  <br>
                  <!-- 分页 -->
                  <el-pagination @size-change="girlhandleSizeChange"
                                 @current-change="girlhandleCurrentChange"
                                 :current-page="girlcurrentPage"
                                 :page-sizes="[5, 10, 20, 40]"
                                 :page-size="girlpagesize"
                                 layout="total, sizes, prev, pager, next, jumper"
                                 :total="girlinsufficientDormitory.length">
                  </el-pagination>

                </el-col>
                <el-col :span="8">
                  <el-row>
                    <el-col :span="4">
                      <el-button type="success" icon="el-icon-plus" @click="gaddnewDormitory" size="mini" round>分配新宿舍
                      </el-button>
                    </el-col>
                  </el-row>
                  <template>
                    <!--表格数据及操作-->
                    <el-table
                      :data="gclassdormitort.slice((girlneedcurrentPage-1)*girlneedpagesize,girlneedcurrentPage*girlneedpagesize)"
                      size="mini"
                      highlight-current-row border
                      class="el-tb-edit mgt20"
                      ref="multipleTable1"
                      tooltip-effect="dark"
                      v-loading="addDormitoryforClassFromLoading"
                      @selection-change="gneedselectChange">
                      <!--勾选框-->
                      <el-table-column type="selection" width="35">
                      </el-table-column>
                      <!--索引-->
                      <el-table-column label="专业" prop="c.m.name">
                      </el-table-column>
                      <el-table-column label="班级" prop="c.name">
                      </el-table-column>
                      <el-table-column label="缺少床位" prop="girllessnumber" sortable>
                      </el-table-column>
                    </el-table>
                  </template>
                  <br>
                  <br>
                  <!-- 分页 -->
                  <el-pagination @size-change="girlneedhandleSizeChange"
                                 @current-change="girlneedhandleCurrentChange"
                                 :current-page="girlneedcurrentPage"
                                 :page-sizes="[5, 10, 20, 40]"
                                 :page-size="girlneedpagesize"
                                 layout="total, sizes, prev, pager, next, jumper"
                                 :total="gclassdormitort.length">
                  </el-pagination>
                </el-col>
              </el-row>

            </el-tab-pane>
          </el-tabs>

        </div>
      </div>
    </div>

    <el-row v-show="stepsactive==2">
      <el-col :span="6">
        <div class="divbuju" style="height: 600px">

          <el-row>
            <el-col >请选择班级</el-col>
          </el-row>
          <el-tree :data="treeData" :props="defaultProps" accordion node-key="id" style="margin-left: 20%"
                   :expand-on-click-node="false">
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span>
                           <i @click="showdormitory(node)">{{node.label}}</i>
                           </span>
                        </span>
          </el-tree>
        </div>
      </el-col>


      <el-col :span="18" >
        <div class="divbuju" style="height: 600px;overflow-y: auto ">
          <div v-if="classInfo.majorname!=''">
            <el-row :gutter="20" >
              <el-col :span="6" >
                <span style="color: #ff27e8">{{classInfo.majorname}}专业：{{classInfo.classname}}</span>
              </el-col>
              <el-col :span="8">
                班级男生床位/人数：<span style="color: #27ff14">{{classInfo.boydormitorynumber}} </span> / {{classInfo.boynumber}}
              </el-col>
              <el-col :span="8">
                女生床位/人数：<span style="color: #27ff14"> {{classInfo.girldormitorynumber}}</span> / {{classInfo.girlnumber}}
              </el-col>

            </el-row>


          </div>
          <el-row>
            <el-col>
              <!--新增按钮      -->
              <el-row>
                <el-col :span="4">
                  <div class="grid-content bg-purple-light">
                    <el-button type="danger" icon="el-icon-delete" @click="handleDeleteList" size="mini" round>删除
                    </el-button>
                  </div>
                </el-col>
              </el-row>

              <template>
                <!--表格数据及操作-->
                <el-table :data="dormitoryList.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                          size="mini"
                          highlight-current-row border
                          class="el-tb-edit mgt20"
                          ref="multipleTable"
                          tooltip-effect="dark"
                          v-loading="dormitoryLoading"
                          @selection-change="selectChange">
                  <!--勾选框-->
                  <el-table-column type="selection" width="55">
                  </el-table-column>
                  <!--索引-->
                  <el-table-column type="index" :index="indexMethod">
                  </el-table-column>

                  <el-table-column label="栋" prop="dong">
                  </el-table-column>
                  <el-table-column label="层" prop="floor">
                  </el-table-column>
                  <el-table-column label="房间" prop="room">
                  </el-table-column>
                  <el-table-column label="性别" prop="sex">
                  </el-table-column>
                  <el-table-column label="几人间" prop="number" :formatter="formatnumber" sortable>
                  </el-table-column>
                  <el-table-column label="费用/人/年）" prop="rent">
                  </el-table-column>
                  <el-table-column fixed="right" label="分配详情" width="150">
                    <template slot-scope="scope">  <!-- -->
                      <!--                <el-button plain size="small" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>-->
                      <el-button plain size="small" @click="getstudent(scope.row)">查看详情</el-button>
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
                             :total="dormitoryList.length">
              </el-pagination>
            </el-col>
          </el-row>
        </div>


      </el-col>

    </el-row>




    <!--  显示该宿舍分配情况-->
    <el-dialog title="分配到的班级及学生" :visible.sync="dormitoryShowInfoVisible" :close-on-click-modal="false"
               v-loading="dormitoryShowInfoLoading">
      <div class="divbuju">


          <div class="divbuju">
            <el-row>
            <el-col :span="6"><h1>分配到的班级：</h1></el-col>
            <el-col :span="18"> <h1>{{dormitoryClass}}</h1></el-col>
            </el-row>
          </div>


        <div class="divbuju">
          <h1>已报到入住学生名单</h1>
          <template>
            <!--表格数据及操作-->
            <el-table :data="dormitoryStudent"
                      size="mini"
                      highlight-current-row border
                      class="el-tb-edit mgt20"
                      ref="multipleTable"
                      tooltip-effect="dark"
                      v-loading="dormitoryShowInfoLoading"
            >
              <!--索引-->
              <el-table-column type="index" :index="indexMethod">
              </el-table-column>
              <el-table-column label="专业" prop="c.m.name">
              </el-table-column>
              <el-table-column label="班级" prop="c.name">
              </el-table-column>
              <el-table-column label="姓名" prop="sb.name">
              </el-table-column>
              <el-table-column label="学号" prop="studentId">
              </el-table-column>
              <el-table-column label="性别" prop="sb.sex">
              </el-table-column>
              <el-table-column label="手机号码" prop="sb.phone">
              </el-table-column>
              <el-table-column label="邮箱" prop="sb.email">
              </el-table-column>

            </el-table>
          </template>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dormitoryShowInfoVisible=false">确定</el-button>
      </div>
    </el-dialog>


  </section>


</template>

<script>
  export default {
    name: "DorDivideDormitoryold",
    created() {
      this.initTreeData();
    },


    methods: {

      //初始化树
      initTreeData() {
        this.postRequest('/dormitory/dividedormitory/initTreeData', {}).then(resp => {
          if (resp && resp.status == 200) {
            var data = resp.data;
            this.treeData = data;
            console.info("树" + JSON.stringify(this.treeData))
          }
        });
      },
      showdormitory(node) {

        console.info(node.data);
        if (node.data.classId != null) {
          this.classId = node.data.classId;
          this.grade = node.data.grade;
          this.dormitoryLoading = true;
          this.postRequest('/dormitory/dividedormitory/getallDormitory', {
            classId: node.data.classId,
          }).then(resp => {
            if (resp && resp.status == 200) {
              var data = resp.data;
              console.info(JSON.stringify(data))
              this.dormitoryList = data[0];
              this.classInfo = data[1];
              this.dormitoryLoading = false;
              console.info(JSON.stringify(this.classInfo))
            }
          });
        }
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

//男宿舍调整分页
      // 初始页currentPage、初始每页数据数pagesize和数据data
      boyhandleSizeChange: function (size) {
        this.boypagesize = size;
        console.log(this.boypagesize)  //每页下拉显示数据
      },
      boyhandleCurrentChange: function (currentPage) {
        this.boycurrentPage = currentPage;
        console.log(this.boycurrentPage)  //点击第几页
      },

      //女宿舍调整分页
      // 初始页currentPage、初始每页数据数pagesize和数据data
      girlhandleSizeChange: function (size) {
        this.girlpagesize = size;
        console.log(this.girlpagesize)  //每页下拉显示数据
      },
      girlhandleCurrentChange: function (currentPage) {
        this.girlcurrentPage = currentPage;
        console.log(this.girlcurrentPage)  //点击第几页
      },


      //批量选中
      selectChange: function (val) {
        this.selectList = val;
      },

      //批量选中
      blessselectChange: function (val) {
        this.blessselectList = val;
      },

      //男未满员宿舍批量删除
      //批量删除
      bhandleDeleteList: function () {
        const length = this.blessselectList.length;
        let id = "";
        for (let i = 0; i < length; i++) {
          id += this.blessselectList[i].id + ",";
        }
        //去掉结尾,
        id = id.substring(0, id.length - 1);
        if (id != "") {
          console.info(id);
          this.$confirm("确认删除这宿舍信息吗?这些同学将无宿舍分配哦！请尽快分配！", "提示", {
            type: "warning"
          }).then(() => {
            this.postRequest('dormitory/dividedormitory/deletelistDormitoryAllocation', {
              id: id
            }).then(resp => {
              if (resp && resp.status == 200) {
                this.bselectList = [];
                this.handleAdd();
              }
            });
          })
            .catch(() => {
            });
        }

      },


      //批量选中
      glessselectChange: function (val) {
        this.glessselectList = val;
      },
      //女生未满员宿舍批量删除
      //批量删除
      ghandleDeleteList: function () {
        const length = this.glessselectList.length;
        let id = "";
        for (let i = 0; i < length; i++) {
          id += this.glessselectList[i].id + ",";
        }
        //去掉结尾,
        id = id.substring(0, id.length - 1);
        if (id != "") {
          console.info(id);
          this.$confirm("确认删除这宿舍信息吗?这些同学将无宿舍分配哦！请尽快分配！", "提示", {
            type: "warning"
          }).then(() => {
            this.postRequest('dormitory/dividedormitory/deletelistDormitoryAllocation', {
              id: id
            }).then(resp => {
              if (resp && resp.status == 200) {
                this.gselectList = [];
                this.handleAdd();
              }
            });
          })
            .catch(() => {
            });
        }

      },

      //批量选中
      gneedselectChange: function (val) {
        this.gneedselectList = val;
      },
      //批量选中
      bneedselectChange: function (val) {
        this.bneedselectList = val;
      },


      //批量删除
      handleDeleteList: function () {
        const length = this.selectList.length;
        let id = "";
        for (let i = 0; i < length; i++) {
          id += this.selectList[i].id + ",";
        }
        //去掉结尾,
        id = id.substring(0, id.length - 1);
        if (id != "") {
          console.info(id);
          this.$confirm("确认删除这宿舍信息吗?这些同学将无宿舍分配哦！请尽快分配！", "提示", {
            type: "warning"
          }).then(() => {
            this.postRequest('dormitory/dividedormitory/deletelistDormitoryAllocation', {
              id: id
            }).then(resp => {
              if (resp && resp.status == 200) {
                this.selectList = [];
                this.getalldormitory();
              }
            });
          })
            .catch(() => {
            });
        }

      },
      //宿舍查看已入住学生
      getstudent(row) {
        this.dormitoryShowInfoLoading = true;
        this.dormitoryShowInfoVisible = true;
        var _this = this;
        this.postRequest('/dormitory/alldormitory/getStudentByDormitoryId', {
          dormitoryId: row.id
        }).then(resp => {
          if (resp && resp.status == 200) {
            console.info(JSON.stringify(resp.data))
            _this.dormitoryShowInfoLoading = false;
            let cs = resp.data[0];
            let classname = "";
            if (cs.length > 0) {
              for (let i = 0; i < cs.length; i++) {
                classname += cs[i].m.name + cs[i].name + "、"
              }
            }
            classname = classname.substring(0, classname.length - 1);
            this.dormitoryClass = classname;
            this.dormitoryStudent = resp.data[1];
            console.info(JSON.stringify(resp.data[0]) + JSON.stringify(resp.data[1]));

          }
        });
      },


      //!!!!!!!!!!!!!!!!!!!自动分配宿舍
      dividedormitory() {
        this.$confirm("确认自动分配宿舍到班级吗?", "提示", {
          type: "warning"
        }).then(() => {
          this.postRequest('/dormitory/alldormitory/dividedormitory', {}).then(resp => {
            if (resp && resp.status == 200) {

            }
          });
        })
          .catch(() => {
          });
      },

      handleAdd() {
        this.addDormitoryforClassFromLoading = true;
        this.addDormitoryforClassFromVisible = true;
        this.postRequest('/dormitory/dividedormitory/getIinsufficientDormitory', {}).then(resp => {
          if (resp && resp.status == 200) {
            this.boyinsufficientDormitory = resp.data[0];
            this.girlinsufficientDormitory = resp.data[1];
            console.info(JSON.stringify(resp.data));
            this.getIinsufficientClassDormitory();
            this.addDormitoryforClassFromLoading = false;
          }
        });
      },

      getIinsufficientClassDormitory() {
        var _this = this;
        this.postRequest('/dormitory/dividedormitory/getIinsufficientClassDormitory', {}).then(resp => {
          if (resp && resp.status == 200) {
            _this.bclassdormitort = resp.data[0];
            _this.gclassdormitort = resp.data[1];
            console.info(JSON.stringify(_this.bclassdormitort));
            console.info(JSON.stringify(_this.gclassdormitort));
            console.info(JSON.stringify(resp.data));
          }
        });
      },

//男宿舍调整分页
      // 初始页currentPage、初始每页数据数pagesize和数据data
      boyneedhandleSizeChange: function (size) {
        this.boyneedpagesize = size;
        console.log(this.boyneedpagesize)  //每页下拉显示数据
      },
      boyneedhandleCurrentChange: function (currentPage) {
        this.boyneedcurrentPage = currentPage;
        console.log(this.boyneedcurrentPage)  //点击第几页
      },

      //女宿舍调整分页
      // 初始页currentPage、初始每页数据数pagesize和数据data
      girlneedhandleSizeChange: function (size) {
        this.girlneedpagesize = size;
        console.log(this.girlneedpagesize)  //每页下拉显示数据
      },
      girlneedhandleCurrentChange: function (currentPage) {
        this.girlneedcurrentPage = currentPage;
        console.log(this.girlneedcurrentPage)  //点击第几页
      },

      // bneedselectList:[],
      // gneedselectList:[],
      //男添加到具体宿舍
      badddormitory(row) {
        const length = this.bneedselectList.length;
        let id = "";
        for (let i = 0; i < length; i++) {
          id +=this.bneedselectList[i].c.m.name+this.bneedselectList[i].c.name+":"+this.bneedselectList[i].c.classId + ":"+this.bneedselectList[i].boylessnumber+",";
        }
        //去掉结尾,
        id = id.substring(0, id.length - 1);
        console.info(id+JSON.stringify(this.bneedselectList))
        if (id != "") {
          let lessnumber=row.number - row.hasnumber;
          this.$confirm("该宿舍最多再容纳" + lessnumber + "人，请确认是否添加新生", "提示", {
            type: "warning"
          }).then(() => {
            this.postRequest('dormitory/dividedormitory/addDormitoryAllocation', {
              id: row.id,
            dong: row.dong,
            floor: row.floor,
            room: row.room,
            sex: row.sex,
            number: row.number,
            rent: row.rent,
            hasnumber: row.hasnumber,
            daid: id
          }).
            then(resp => {
              if (resp && resp.status == 200) {
                this.bneedselectList = [];
                this.handleAdd();
              }
            });
          })
            .catch(() => {
            });
        } else {
          this.$message(
            {
              message: "请先从右侧列表中选择要加入的班级学生",
              type: "error"
            }
          );
        }
      },
      //女添加到具体宿舍
      gadddormitory(row) {
        const length = this.gneedselectList.length;
        let id = "";
        for (let i = 0; i < length; i++) {
          id +=this.gneedselectList[i].c.m.name+this.gneedselectList[i].c.name+":"+this.gneedselectList[i].c.classId + ":"+this.gneedselectList[i].girllessnumber+",";
        }
        //去掉结尾,
        id = id.substring(0, id.length - 1);
        console.info(id)
        if (id != "") {
          let lessnumber=row.number - row.hasnumber;
          this.$confirm("该宿舍最多再容纳" + lessnumber + "人，请确认是否添加新生", "提示", {
            type: "warning"
          }).then(() => {
            this.postRequest('dormitory/dividedormitory/addDormitoryAllocation', {
              id: row.id,
              dong: row.dong,
              floor: row.floor,
              room: row.room,
              sex: row.sex,
              number: row.number,
              rent: row.rent,
              hasnumber: row.hasnumber,
              daid: id
            }).
            then(resp => {
              if (resp && resp.status == 200) {
                this.gneedselectList = [];
                this.handleAdd();
              }
            });
          })
            .catch(() => {
            });
        } else {
          this.$message(
            {
              message: "请先从右侧列表中选择要加入的班级学生",
              type: "error"
            }
          );
        }
      },

      //女生加入新宿舍
      gaddnewDormitory(){
        if(this.gclassdormitort.length!==0){
            let word="以下新生都会被安排到新的宿舍";
          if(this.girlinsufficientDormitory.length!==0){
            word="还有未满员的宿舍！确定安排新宿舍吗?"+word;
          }
          this.$confirm(word, "提示", {
            type: "warning"
          }).then(() => {
            const length = this.gclassdormitort.length;
            let info = "";
            for (let i = 0; i < length; i++) {
              info +=this.gclassdormitort[i].c.m.name+this.gclassdormitort[i].c.name+":"+this.gclassdormitort[i].c.classId + ":"+this.gclassdormitort[i].girllessnumber+",";
            }
            //去掉结尾,
            info = info.substring(0, info.length - 1);
            console.info(info)
            this.postRequest('dormitory/dividedormitory/addNewDormitoryAllocation', {
              info:info,
              sex:'女'
            }).then(resp => {
              this.gneedselectList = [];
              this.handleAdd();
            })

          }).catch(()=>{
          })
        }else{
          this.$message({
            message: "暂无需要宿舍的学生！不需要安排新宿舍！",
            type: "error"
          });
        }
      },
//男生加入新宿舍
      baddnewDormitory(){
        if(this.bclassdormitort.length!==0){
          let word="以下新生都会被安排到新的宿舍";
          if(this.boyinsufficientDormitory.length!==0){
            word="还有未满员的宿舍！确定安排新宿舍吗?"+word;
          }
          this.$confirm(word, "提示", {
            type: "warning"
          }).then(() => {
            const length = this.bclassdormitort.length;
            let info = "";
            for (let i = 0; i < length; i++) {
              info +=this.bclassdormitort[i].c.m.name+this.bclassdormitort[i].c.name+":"+this.bclassdormitort[i].c.classId + ":"+this.bclassdormitort[i].boylessnumber+",";
            }
            //去掉结尾,
            info = info.substring(0, info.length - 1);
            console.info(info)
            this.postRequest('dormitory/dividedormitory/addNewDormitoryAllocation', {
              info:info,
              sex:'男'
            }).then(resp => {
              this.bneedselectList = [];
              this.handleAdd();
            })

          }).catch(()=>{
          })
        }else{
          this.$message({
            message: "暂无需要宿舍的学生！不需要安排新宿舍！",
            type: "error"
          });
        }
      },

      //上一页
      presteps(){
        if(this.stepsactive>0){
          this.stepsactive--;
          if(this.stepsactive==1){
            this.handleAdd();
          }
        }
      },

      //下一页
      nextsteps(){
        if(this.stepsactive<2){
          this.stepsactive++;
          if(this.stepsactive==1){
            this.handleAdd();
          }
        }
      },


    },
    data() {
      return {
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        dormitoryList: [],
        dormitoryLoading: false,

        classInfo: {
          majorname: "",
          majorId: "",
          classId: "",
          classname: "",
          boynumber: "",
          girlnumber: "",
          boydormitorynumber: "",
          girldormitorynumber: "",
        },
        grade: "",
        selectList: [],
        currentPage: 1, //初始页
        pagesize: 10,    //    每页的数据

        formatnumber: function (row, column) {
          return row.number == 2 ? "2人间"
            : row.number == 3 ? "3人间"
              : row.number == 4 ? "4人间"
                : row.number == 5 ? "5人间"
                  : "未知";
        },
        //宿舍人员
        dormitoryStudent: [],
        dormitoryClass: "",
        dormitoryShowInfoLoading: false,
        dormitoryShowInfoVisible: false,

        //未满员宿舍集合
        classId: "",
        addDormitoryforClassFromLoading: false,
        addDormitoryforClassFromVisible: false,
        boyinsufficientDormitory: [],
        girlinsufficientDormitory: [],

        //未满员宿舍男女多选id集合
        blessselectList: [],
        glessselectList: [],


        // 男女宿舍缺床位集合
        bclassdormitort: [],
        gclassdormitort: [],

        //缺宿舍男女多选id集合
        bneedselectList: [],
        gneedselectList: [],


        // 男未满员数据
        boycurrentPage: 1, //初始页
        boypagesize: 5,    //    每页的数据

// 女未满员数据
        girlcurrentPage: 1, //初始页
        girlpagesize: 5,    //    每页的数据


        // 男缺床位数据
        boyneedcurrentPage: 1, //初始页
        boyneedpagesize: 5,    //    每页的数据

// 女缺床位数据
        girlneedcurrentPage: 1, //初始页
        girlneedpagesize: 5,    //    每页的数据



        //步骤条
        stepsactive:0,


        //宿舍图形化数据

        //样式
        isred:false,
        isgreen:true,


      }
    },


  }
</script>

<style scoped>
  .container {
    padding: 30px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
  }
  /*//定义宿舍图形宽高*/
  .jichudiv{
    width: 80px;
    height: 50px;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
  }
  .jichudivred{
    background-color: #ff0705;
  }
  .jichudivgreen{
    background-color: #00ff00;
  }


</style>
