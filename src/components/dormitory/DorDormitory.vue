<template>
  <section class="container">
    <!--       这是用户管理页面-->
    <div class="table"> <!-- 页面表格begin -->
      <div class=""><!-- 页面内容区begin -->


        <el-row>
          <el-col :span="6">
            <div class="divbuju" style="height: 610px"> <!-- 搜索区begin -->
              <!--工具条-->

                  <el-form :inline="true" :model="ddmcForm">
                    <el-form-item style="width: 100%">
                      专业：
                      <el-select v-model="ddmcForm.majorId" placeholder="请选择" @change="majorChange" clearable
                                 size="mini">
                        <el-option v-for="item in majorList" :key="item.id" :label="item.name"
                                   :value="item.majorId"></el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item style="width: 100%">
                      班级：
                      <el-select v-model="ddmcForm.classId" placeholder="请选择"  clearable size="mini">
                        <el-option v-for="item in classList" :key="item.id" :label="item.name"
                                   :value="item.classId"></el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item style="width: 100%">
                      栋：
                      <el-input v-model="ddmcForm.dong" placeholder="楼栋编号" style="width:150px; heght:30px;"
                                size="mini"></el-input>
                    </el-form-item>
                    <el-form-item style="width: 100%">
                      层：
                      <el-input v-model.number="ddmcForm.floor" placeholder="楼层数" style="width:150px; heght:30px;"
                                size="mini"></el-input>
                    </el-form-item>

                    <el-form-item style="width: 100%">
                      性别：
                      <el-select v-model="ddmcForm.sex" placeholder="请选择" clearable size="mini">
                        <el-option v-for="item in sexOptions" :key="item.value" :label="item.label"
                                   :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item style="width: 100%">
                      几人间：
                      <el-select v-model="ddmcForm.number" placeholder="请选择" clearable size="mini">
                        <el-option v-for="item in numberOptions" :key="item.value" :label="item.label"
                                   :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item style="width: 100%">
                      宿舍类型：
                      <el-select v-model="ddmcForm.enough" placeholder="请选择" clearable size="mini">
                        <el-option v-for="item in enoughOptions" :key="item.value" :label="item.label"
                                   :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item style="width: 100%">
                      <el-button type="primary" icon="el-icon-search" @click="getalldormitory()" style="width: 250px" size="mini">搜索</el-button>
                    </el-form-item>
                  </el-form>
            </div> <!-- 搜索区end -->
          </el-col>

          <el-col :span="18">
            <div class="divbuju">


            <!--新增按钮      -->
                    <el-row>
                      <el-col :span="4">
                        <div class="grid-content bg-purple">
                          <el-button type="success" icon="el-icon-circle-plus-outline" @click="handleAdd" size="mini" round>新增
                          </el-button>

                        </div>
                      </el-col>
                      <el-col :span="4">
                        <div class="grid-content bg-purple-light">
                          <el-button type="danger" icon="el-icon-delete" @click="handleDeleteList" size="mini" round>删除</el-button>
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
                <el-table-column fixed="right" label="操作" width="250">
                  <template slot-scope="scope">  <!-- -->
                    <el-button plain size="small" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
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
            </div>
          </el-col>

        </el-row>

      </div><!-- 页面内容区end-->
    </div><!-- 页面表格end -->

    <!--新增or修改-->
    <el-dialog title="新增or修改" :visible.sync="addandeditFromVisible" :close-on-click-modal="false">
      <el-form :model="addandeditFrom" label-width="80px"  ref="addandeditFrom">
        <el-form-item label="栋" prop="dong">
          <el-input v-model="addandeditFrom.dong" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="层" prop="floor">
          <el-input v-model.number="addandeditFrom.floor" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="房间" prop="room">
          <el-input v-model.number="addandeditFrom.room" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="性别" prop="sex">
          <el-select v-model="addandeditFrom.sex" placeholder="请选择" clearable size="mini">
            <el-option v-for="item in sexOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="几人间" prop="number">
          <el-select v-model="addandeditFrom.number" placeholder="请选择" clearable size="mini">
            <el-option v-for="item in numberOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="租金/人/年" prop="rent">
          <el-input   v-model.number="addandeditFrom.rent" auto-complete="off"> </el-input >
        </el-form-item>



      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addandeditFromVisible=false">取消</el-button>
        <el-button type="primary" @click="addeditSubmit" >提交</el-button>
      </div>
    </el-dialog>

    <!--  显示该宿舍分配情况-->
    <el-dialog title="学生名单" :visible.sync="dormitoryShowInfoVisible" :close-on-click-modal="false" v-loading="dormitoryShowInfoLoading">
      <div>
        班级：{{dormitoryClass}}
        <div>
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
    name: "DroDormitory",

    created() {
        this.getAllMajor();
    },
    mounted() {
      this.getalldormitory();

    },
    methods: {
        getalldormitory(){
          this.dormitoryLoading=true;
          this.postRequest('/dormitory/alldormitory/getallDormitory', {
            majorId: this.ddmcForm.majorId,
            classId: this.ddmcForm.classId,
            dong: this.ddmcForm.dong,
            floor: this.ddmcForm.floor,
            sex: this.ddmcForm.sex,
            number: this.ddmcForm.number,
            enough:this.ddmcForm.enough
          }).then(resp => {
            if (resp && resp.status == 200) {
              var data = resp.data;
              console.info(JSON.stringify(data))
              this.dormitoryList = data;
              this.dormitoryLoading = false;
            }
          });
        },
      //专业改变事件
      majorChange(id) {
        this.classList = [],
          this.postRequest('/dormitory/alldormitory/getClassByMajorId', {
            majorId: this.ddmcForm.majorId
          }).then(resp => {
            if (resp && resp.status == 200) {
              var data = resp.data;
              this.classList = data;
              console.info("班级信息" + JSON.stringify(this.classList))
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

      //批量删除
      handleDeleteList: function () {
        const length = this.selectList.length;
        let id = "";
        for (let i = 0; i < length; i++) {
          id += this.selectList[i].id + ",";
        }

        //去掉结尾,
        id = id.substring(0, id.length - 1);
        console.info(id);
        this.$confirm("确认删除该宿舍信息吗?", "提示", {
          type: "warning"
        }).then(() => {
          this.postRequest('/dormitory/alldormitory/deleteDormitory', {
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
      },
      // 手动添加宿舍信息
      handleAdd(){
          this.addandeditFromVisible=true;
      },
      handleEdit(index,row){
        this.addandeditFromVisible=true;
        this.addandeditFromType="edit";
        this.addandeditFrom.id=row.id;
        this.addandeditFrom.dong=row.dong;
        this.addandeditFrom.floor=row.floor;
        this.addandeditFrom.room=row.room;
        this.addandeditFrom.sex=row.sex;
        this.addandeditFrom.number=row.number;
        this.addandeditFrom.rent=row.rent;

      },
      addeditSubmit(){
          if(this.addandeditFromType=="edit"){
            this.postRequest('/dormitory/alldormitory/updatetDormitory', {
              id: this.addandeditFrom.id,
              dong:this.addandeditFrom.dong,
              floor:this.addandeditFrom.floor,
              room:this.addandeditFrom.room,
              sex:this.addandeditFrom.sex,
              number:this.addandeditFrom.number,
              rent:this.addandeditFrom.rent
            }).then(resp => {
              if (resp && resp.status == 200) {
                this.getalldormitory();
              }
            });
          }else{
            this.postRequest('/dormitory/alldormitory/insertDormitory', {
              dong:this.addandeditFrom.dong,
              floor:this.addandeditFrom.floor,
              room:this.addandeditFrom.room,
              sex:this.addandeditFrom.sex,
              number:this.addandeditFrom.number,
              rent:this.addandeditFrom.rent
            }).then(resp => {
              if (resp && resp.status == 200) {
                this.getalldormitory();
              }
            });
          }
      },



      //宿舍查看已入住学生
      getstudent(row){
        this.dormitoryShowInfoLoading=true;
        this. dormitoryShowInfoVisible=true;
        var _this=this;
        this.postRequest('/dormitory/alldormitory/getStudentByDormitoryId', {
          dormitoryId:row.id
        }).then(resp => {
          if (resp && resp.status == 200) {
            console.info(JSON.stringify(resp.data))
            _this.dormitoryShowInfoLoading=false;
            let cs=resp.data[0];
            let classname="";
            if(cs.length>0){
              for(let i=0;i<cs.length;i++){
                classname+=cs[i].m.name+cs[i].name+"、"
              }
            }
            classname = classname.substring(0, classname.length - 1);
            this.dormitoryClass=classname;
            this.dormitoryStudent=resp.data[1];
            console.info(JSON.stringify(resp.data[0])+JSON.stringify(resp.data[1]));

          }
        });
      },

      //获取专业
      getAllMajor(){
        this.postRequest('/dormitory/alldormitory/getAllMajor', {
        }).then(resp => {
          if (resp && resp.status == 200) {
              this.majorList=resp.data;
          }
        });

      },



    },
    data() {
      return {
        ddmcForm: {
          majorId: "",
          classId: "",
          dong: "",
          floor: 0,
          sex: "",
          number: 0,
          enough:""
        },
        dormitoryList:[],
        dormitoryLoading:false,

        //班级信息
        classList: [],

        //专业信息
        majorList: [],

        //性别下拉框
        sexOptions: [
          {
            value: "男",
            label: "男"
          },
          {
            value: "女",
            label: "女"
          }
        ],
        //几人间下拉框
        numberOptions: [
          {
            label: "2人间",
            value: 2
          },
          {
            label: "3人间",
            value: 3
          },
          {
            label: "4人间",
            value: 4
          },
          {
            label: "5人间",
            value: 5
          }
        ],
        //是否满下拉框
        enoughOptions: [
          {
            value: "1",
            label: "已安排班级"
          },
          {
            value: "0",
            label: "未安排班级"
          },
        ],
        selectList:[],
        currentPage: 1, //初始页
        pagesize: 10,    //    每页的数据

        formatnumber: function (row, column) {
          return row.number == 2 ? "2人间"
            : row.number == 3 ? "3人间"
              :row.number == 4 ? "4人间"
                : row.number == 5 ? "5人间"
                  : "未知";
        },

        addandeditFromVisible:false,
        addandeditFrom:{
          id:"",
          dong:"",
          floor:0,
          room:0,
          sex: "",
          number: 0,
          rent:0.0
        },
        addandeditFromType:"",


        //宿舍人员
        dormitoryStudent:[],
        dormitoryClass:"",
        dormitoryShowInfoLoading:false,
        dormitoryShowInfoVisible:false,

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
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
  }
</style>
